import api from './tauri-bridge.js';
import ImageList from './image-list.js';
import ImageViewer from './image-viewer.js';
import AnnotationPanel from './annotation-panel.js';

const ATOM_LIBRARY_KEY = 'datasetcreator.atomLibrary';

class App {
  constructor() {
    this.currentImage = null;
    this.currentRegion = null;
    this.images = [];
    this.regions = [];
    this.labels = [];
    this.atomCounts = {};
    this.atomLibrary = this.loadAtomLibrary();
    this.activeAtomId = null;
    this.activeAtomKey = null;
    this.activeStructuralConfig = '1';
    this.pendingNewAtomColor = null;
    this.pendingNewAtomRegionId = null;
    this.undoStack = [];
    this.redoStack = [];
    this.historyLimit = 80;
    this.annotationsVisible = true;
    this.showOnlyImagesWithAtoms = false;
    this.atomPagePacket = null;
    this.selectedMoleculeId = null;
    this.moleculeRecalculateTimer = null;
    this.moleculeEditMode = false;
    this.moleculeEditSnapshot = null;
    this.moleculeEditSnapshots = new Map();
    this.pendingParticleAtomOrders = new Map();
    this.pendingMoleculeParticleOrders = new Map();
    this.orderDraftSaving = false;
    this.editModeActive = false;
    this.editTool = null;
    this.paintModeActive = false;
    this.paintStrokeBuffer = [];
    this.deleteModeActive = false;
    this.deleteRegionIds = new Set();
    this.rowEditModeActive = false;
    this.rowEditSnapshot = [];
    this.rowEditChangedRows = new Set();
    this.gapEditSnapshot = new Map();
    this.pendingMoleculeGapOverrides = new Map();
    this.particleRowOverrideSnapshot = new Map();
    this.pendingParticleRowOverrides = new Map();

    this.canvasEmptyEl = document.getElementById('canvas-empty');
    this.zoomInBtn = document.getElementById('zoom-in-btn');
    this.zoomOutBtn = document.getElementById('zoom-out-btn');
    this.zoomLevelLabel = document.getElementById('zoom-level');
    this.editModeBtn = document.getElementById('edit-mode-btn');
    this.editToolsEl = document.querySelector('.edit-controls__tools');
    this.editToolButtons = [...document.querySelectorAll('[data-edit-tool]')];
    this.editCommitBtn = document.getElementById('edit-commit-btn');
    this.editCancelBtn = document.getElementById('edit-cancel-btn');
    this.editCountEl = document.getElementById('edit-count');
    this.locatorForm = document.getElementById('locator-form');
    this.locatorSearchInput = document.getElementById('locator-search-input');
    this.sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
    this.sidebarFilterBtn = document.getElementById('sidebar-filter-btn');
    this.sidebarLabelsBtn = document.getElementById('sidebar-labels-btn');
    this.atomNameModal = document.getElementById('atom-name-modal');
    this.atomNameForm = document.getElementById('atom-name-form');
    this.atomNameInput = document.getElementById('atom-name-input');
    this.atomNameCancelBtn = document.getElementById('atom-name-cancel');
    this.atomNameCancelXBtn = document.getElementById('atom-name-cancel-x');
    this.pendingAtomNameResolver = null;

    this.init();
  }

  async init() {
    this.imageList = new ImageList(document.getElementById('image-list-container'));
    this.imageViewer = new ImageViewer(document.getElementById('main-canvas'));
    this.annotationPanel = new AnnotationPanel(document.getElementById('annotation-panel-body'));
    this.annotationPanel.setAtomLibrary(this.atomLibrary);

    this.setupCallbacks();
    this.setupUIEvents();
    this.setupShortcuts();
    this.updateEditControls();
    await this.setupMoleculeEvents();
    await this.openVoynich();
  }

  setupCallbacks() {
    this.imageList.onImageSelected((imageId) => this.selectImage(imageId));

    this.imageViewer.onStrokeCreated(async (stroke) => {
      if (!this.currentImage) return;
      try {
        if (this.paintModeActive) {
          this.queuePaintStroke(stroke);
          return;
        }
        await this.createAtomStroke(stroke);
      } catch (err) {
        this.showToast(`No pude crear el atomo: ${err}`, 'error');
      }
    });

    this.imageViewer.onAtomStamped(async (stroke) => {
      if (!this.currentImage) return;
      try {
        if (this.paintModeActive) {
          this.queuePaintStroke(stroke);
          return;
        }
        await this.createAtomStroke(stroke);
      } catch (err) {
        this.showToast(`No pude estampar el atomo: ${err}`, 'error');
      }
    });

    this.imageViewer.onRegionSelected((regionId) => {
      if (this.deleteModeActive && regionId) {
        this.toggleDeleteRegion(regionId);
        return;
      }
      this.selectRegion(regionId);
    });

    this.imageViewer.onMoleculeSelected((moleculeId) => {
      if (this.moleculeEditMode && String(moleculeId || '') !== String(this.selectedMoleculeId || '') && !this.canSwitchMoleculeDuringEdit()) {
        this.imageViewer.setSelectedMolecule(this.selectedMoleculeId);
        this.showToast('Guarda o descarta la edicion de molecula antes de cambiar de seleccion', 'warning');
        return;
      }
      this.selectedMoleculeId = moleculeId || null;
      if (this.canSwitchMoleculeDuringEdit() && this.selectedMoleculeId) {
        this.moleculeEditMode = true;
        this.ensureMoleculeEditSnapshot(this.selectedMoleculeId);
      }
      this.renderClusterDebugPanel();
    });

    this.imageViewer.onRowGuideAdjusted(async (rowIndex, edge, deltaY) => {
      if (!this.currentImage) return;
      if (this.rowEditModeActive) {
        this.queueRowGuideEdit(rowIndex);
        return;
      }
      try {
        const packet = await api.adjustParticleRowGuide(this.currentImage.id, rowIndex, deltaY, edge);
        this.applyAtomPagePacket(packet);
      } catch (err) {
        this.showToast(`No pude ajustar renglon: ${err}`, 'error');
      }
    });

    this.imageViewer.onMoleculeGapAction(async (gap) => {
      await this.handleCanvasGapAction(gap);
    });

    this.annotationPanel.infoContainer.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-gap-action]');
      const rowButton = event.target.closest('[data-particle-row-action]');
      if (!button && !rowButton) return;
      event.preventDefault();
      if (button) {
        await this.handleGapAction(button);
      } else {
        await this.handleParticleRowAction(rowButton);
      }
    });

    this.imageViewer.onRegionChanged(async (regionId, geometry) => {
      try {
        const before = await this.snapshotRegion(regionId);
        await api.updateRegion(regionId, {
          geometryJson: JSON.stringify(geometry),
        });
        await this.autoClassifyCurrentImageVariants();
        await this.syncAtomEngine(regionId);
        const after = await this.snapshotRegion(regionId);
        this.pushHistory({ type: 'update', before, after });
        this.redoStack = [];
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(regionId);
        this.scheduleMoleculeRecalculate();
      } catch (err) {
        this.showToast(`No pude ajustar el atomo: ${err}`, 'error');
      }
    });

    this.annotationPanel.onDrawAtomRequested(async (color) => {
      if (this.pendingNewAtomColor) {
        await this.cancelNewAtomCreation({ deletePendingRegion: Boolean(this.pendingNewAtomRegionId) });
        return;
      }
      this.startNewAtomCreation(color);
    });

    this.annotationPanel.onSaveAtomRequested(async () => {
      try {
        await this.saveSelectedAtomDefinition();
      } catch (err) {
        this.showToast(`No pude guardar el atomo patron: ${err}`, 'error');
      }
    });

    this.annotationPanel.onAtomPicked(async (atomId) => {
      if (this.pendingNewAtomColor) {
        try {
          await this.cancelNewAtomCreation({ deletePendingRegion: Boolean(this.pendingNewAtomRegionId), silent: true });
        } catch (err) {
          this.showToast(`No pude cancelar el atomo nuevo: ${err}`, 'error');
          return;
        }
      }

      if (String(this.activeAtomId || '') === String(atomId || '')) {
        this.activeAtomId = null;
        this.activeAtomKey = null;
        this.pendingNewAtomColor = null;
        this.pendingNewAtomRegionId = null;
        this.annotationPanel.setActiveAtom(null);
        this.imageViewer.setAtomPreview(null);
        this.imageViewer.setDrawMode('select', { forceDraw: false });
        this.showToast('Atomo desactivado', 'info');
        return;
      }

      this.activeAtomId = atomId;
      this.pendingNewAtomColor = null;
      this.pendingNewAtomRegionId = null;
      const atom = this.atomLibrary.find((item) => String(item.id) === String(atomId));
      this.activeAtomKey = this.atomGroupKey(atom);
      this.activeStructuralConfig = this.atomConfigKey(atom);
      this.annotationPanel.setActiveAtom(atomId);
      this.updateAtomPreview();
      this.imageViewer.setDrawMode('stroke', { color: this.atomColor(atomId), forceDraw: true });
      this.showToast('Atomo activo: pinta su aparicion real', 'info');
    });

    this.annotationPanel.onConfigPicked((config) => {
      this.applyConfigChoice(config);
    });

    this.annotationPanel.onDeleteRequested(async () => {
      if (!this.currentRegion) return;
      try {
        await this.deleteRegion(this.currentRegion.id);
      } catch (err) {
        this.showToast(`No pude borrar: ${err}`, 'error');
      }
    });

  }

  setupUIEvents() {
    this.zoomInBtn?.addEventListener('click', () => {
      this.imageViewer.zoomIn();
      this.updateZoomDisplay();
    });

    this.zoomOutBtn?.addEventListener('click', () => {
      this.imageViewer.zoomOut();
      this.updateZoomDisplay();
    });

    this.zoomLevelLabel?.addEventListener('click', () => {
      this.imageViewer.resetZoom();
      this.updateZoomDisplay();
    });

    this.sidebarCollapseBtn?.addEventListener('click', () => {
      document.getElementById('app')?.classList.toggle('app--sidebar-collapsed');
      setTimeout(() => this.imageViewer?._handleResize(), 220);
    });

    this.sidebarFilterBtn?.addEventListener('click', () => {
      this.showOnlyImagesWithAtoms = !this.showOnlyImagesWithAtoms;
      this.sidebarFilterBtn.classList.toggle('sidebar__filter-btn--active', this.showOnlyImagesWithAtoms);
      this.imageList.setShowOnlyWithAtoms(this.showOnlyImagesWithAtoms);
    });

    this.sidebarLabelsBtn?.addEventListener('click', () => {
      this.annotationsVisible = !this.annotationsVisible;
      this.imageViewer.setAnnotationsVisible(this.annotationsVisible);
      this.sidebarLabelsBtn.classList.toggle('sidebar__labels-btn--hidden', !this.annotationsVisible);
    });

    this.editModeBtn?.addEventListener('click', () => this.toggleEditMode());
    for (const button of this.editToolButtons) {
      button.addEventListener('click', () => this.setEditTool(button.dataset.editTool || null));
    }
    this.editCommitBtn?.addEventListener('click', () => {
      this.commitEditSession().catch((err) => this.showToast(`No pude guardar edicion: ${err}`, 'error'));
    });
    this.editCancelBtn?.addEventListener('click', () => this.cancelEditSession());

    this.locatorForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.locateCurrentPageTarget(this.locatorSearchInput?.value || '')
        .catch((err) => this.showToast(`No pude localizar: ${err}`, 'error'));
    });

    this.atomNameForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.resolveAtomNameModal(this.atomNameInput?.value || '');
    });

    this.atomNameCancelBtn?.addEventListener('click', () => this.resolveAtomNameModal(null));
    this.atomNameCancelXBtn?.addEventListener('click', () => this.resolveAtomNameModal(null));
    this.atomNameModal?.addEventListener('click', (event) => {
      if (event.target === this.atomNameModal) this.resolveAtomNameModal(null);
    });

    setInterval(() => {
      if (this.currentImage) this.updateZoomDisplay();
    }, 250);
  }

  setupShortcuts() {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.pendingAtomNameResolver) {
          event.preventDefault();
          this.resolveAtomNameModal(null);
          return;
        }

        if (this.pendingNewAtomColor) {
          event.preventDefault();
          this.cancelNewAtomCreation({ deletePendingRegion: Boolean(this.pendingNewAtomRegionId) })
            .catch((err) => this.showToast(`No pude cancelar el atomo nuevo: ${err}`, 'error'));
          return;
        }

        if (this.editModeActive) {
          event.preventDefault();
          if (this.editPendingCount() > 0) {
            this.cancelEditSession();
          } else {
            this.toggleEditMode(false);
          }
          return;
        }

        this.clearActiveAtomTool();
        return;
      }

      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        this.redo();
        return;
      }

      if (event.ctrlKey && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        this.undo();
        return;
      }

      if (/^[1-9]$/.test(event.key)) {
        event.preventDefault();
        this.applyConfigChoice(event.key);
        return;
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && this.currentRegion) {
        event.preventDefault();
        if (this.deleteModeActive) {
          this.toggleDeleteRegion(this.currentRegion.id);
          return;
        }
        this.deleteRegion(this.currentRegion.id).catch((err) => this.showToast(`No pude borrar: ${err}`, 'error'));
      }
    });
  }

  startNewAtomCreation(color) {
    this.pendingNewAtomColor = this.normalizeColor(color);
    this.pendingNewAtomRegionId = null;
    this.activeAtomId = null;
    this.activeAtomKey = null;
    this.activeStructuralConfig = '1';
    this.annotationPanel.setActiveAtom(null);
    this.imageViewer.setAtomPreview(null);
    this.imageViewer.setDrawMode('stroke', { color, forceDraw: true });
    this.selectRegion(null);
    this.showToast('Dibuja el atomo', 'info');
  }

  async cancelNewAtomCreation({ deletePendingRegion = false, silent = false } = {}) {
    const regionId = this.pendingNewAtomRegionId;
    this.pendingNewAtomColor = null;
    this.pendingNewAtomRegionId = null;
    this.clearActiveAtomTool();

    if (deletePendingRegion && regionId) {
      await api.deleteRegion(regionId);
      if (this.currentImage) {
        await this.loadRegions(this.currentImage.id);
      }
      await this.selectRegion(null);
      this.scheduleMoleculeRecalculate();
    }

    if (!silent) {
      this.showToast('Creacion de atomo cancelada', 'info');
    }
  }

  clearActiveAtomTool() {
    this.activeAtomId = null;
    this.activeAtomKey = null;
    this.activeStructuralConfig = '1';
    this.annotationPanel.setActiveAtom(null);
    this.imageViewer.setAtomPreview(null);
    this.imageViewer.setDrawMode('select', { forceDraw: false });
    this.selectRegion(null);
  }

  toggleEditMode(force = null) {
    const next = force === null ? !this.editModeActive : Boolean(force);
    if (next === this.editModeActive) return;

    this.editModeActive = next;
    if (next) {
      this.setEditTool(this.editTool || 'paint', { silent: true });
      this.showToast('Edicion activada: acumula cambios y guarda al final', 'info');
    } else {
      this.setEditTool(null, { silent: true });
      if (this.editPendingCount() > 0) {
        this.cancelEditSession({ silent: true });
      }
      this.showToast('Edicion desactivada', 'info');
    }
    this.updateEditControls();
  }

  setEditTool(tool, options = {}) {
    const { silent = false } = options;
    const cleanTool = this.editModeActive && ['paint', 'delete', 'rows', 'molecule'].includes(tool) ? tool : null;
    this.editTool = cleanTool;
    this.paintModeActive = cleanTool === 'paint';
    this.deleteModeActive = cleanTool === 'delete';
    this.rowEditModeActive = cleanTool === 'rows';

    this.imageViewer?.setBatchDeleteMode(this.deleteModeActive);
    this.imageViewer?.setRowEditMode(this.rowEditModeActive);

    if (this.rowEditModeActive && !this.rowEditSnapshot.length) {
      this.rowEditSnapshot = this.imageViewer?.getParticleRowGuides() || [];
    }

    if (this.paintModeActive) {
      this.updateAtomPreview();
      if (this.activeAtomId) {
        this.imageViewer?.setDrawMode('stroke', { color: this.atomColor(this.activeAtomId), forceDraw: true });
      }
    } else if (!this.pendingNewAtomColor) {
      this.imageViewer?.setDrawMode('select', { forceDraw: false });
    }

    if (this.deleteModeActive || this.rowEditModeActive || cleanTool === 'molecule') {
      this.clearActiveAtomTool();
    }

    if (cleanTool === 'molecule' && !this.moleculeEditMode) {
      const molecule = this.selectedMoleculeAudit();
      if (molecule) {
        this.moleculeEditMode = true;
        this.ensureMoleculeEditSnapshot(molecule.molecule_id ?? molecule.moleculeId);
        this.renderClusterDebugPanel({ lightweight: true });
      }
    }

    this.updateEditControls();
    if (!silent && cleanTool) {
      const labels = { paint: 'Pintar', delete: 'Borrar', rows: 'Renglones', molecule: 'Molecula' };
      this.showToast(`Herramienta: ${labels[cleanTool]}`, 'info');
    }
  }

  editPendingCount() {
    return this.paintStrokeBuffer.length
      + this.deleteRegionIds.size
      + this.rowEditChangedRows.size
      + this.pendingMoleculeGapOverrides.size
      + this.pendingParticleRowOverrides.size
      + this.pendingParticleAtomOrders.size
      + this.pendingMoleculeParticleOrders.size;
  }

  async commitEditSession() {
    if (!this.currentImage || this.editPendingCount() === 0) return;
    this.editCommitBtn.disabled = true;
    try {
      if (this.paintStrokeBuffer.length) {
        await this.commitPaintBuffer({ keepEditSession: true });
      }
      if (this.deleteRegionIds.size) {
        await this.commitDeleteBuffer({ keepEditSession: true });
      }
      if (this.pendingMoleculeGapOverrides.size) {
        await this.commitMoleculeGapEdits({ keepEditSession: true });
      }
      if (this.pendingParticleRowOverrides.size) {
        await this.commitParticleRowOverrideEdits({ keepEditSession: true });
      }
      if (this.rowEditChangedRows.size) {
        await this.commitRowGuideEdits({ keepEditSession: true });
      }
      if (this.pendingParticleAtomOrders.size || this.pendingMoleculeParticleOrders.size) {
        await this.flushPendingOrderDrafts();
      }
      this.updateEditControls();
      this.showToast('Edicion guardada', 'success');
    } finally {
      this.updateEditControls();
    }
  }

  cancelEditSession(options = {}) {
    const { silent = false } = options;
    if (this.paintStrokeBuffer.length) this.clearPaintBuffer({ silent: true });
    if (this.deleteRegionIds.size) this.clearDeleteBuffer({ silent: true });
    if (this.rowEditChangedRows.size) this.clearRowGuideEdits({ silent: true });
    if (this.pendingMoleculeGapOverrides.size) this.clearMoleculeGapEdits({ silent: true });
    if (this.pendingParticleRowOverrides.size) this.clearParticleRowOverrideEdits({ silent: true });
    if (this.moleculeEditMode || this.hasPendingOrderDrafts()) {
      this.discardMoleculeOrderDrafts({ render: true });
    }
    this.updateEditControls();
    if (!silent) this.showToast('Edicion pendiente cancelada', 'info');
  }

  togglePaintMode(force = null) {
    const next = force === null ? !this.paintModeActive : Boolean(force);
    if (next && !this.activeAtomId) {
      this.showToast('Selecciona un atomo guardado para pintar en bloque', 'error');
      return;
    }
    if (next && this.deleteModeActive) {
      this.toggleDeleteMode(false);
    }
    if (next && this.rowEditModeActive) {
      this.toggleRowEditMode(false);
    }
    this.paintModeActive = next;
    this.updatePaintControls();
    this.showToast(next ? 'Pintura activada: aplicar recalcula todo junto' : 'Pintura desactivada', 'info');
  }

  toggleDeleteMode(force = null) {
    const next = force === null ? !this.deleteModeActive : Boolean(force);
    if (next && this.paintModeActive) {
      this.togglePaintMode(false);
    }
    if (next && this.rowEditModeActive) {
      this.toggleRowEditMode(false);
    }
    this.deleteModeActive = next;
    this.imageViewer?.setBatchDeleteMode(next);
    if (!next) {
      this.clearDeleteBuffer({ silent: true });
    } else {
      this.clearActiveAtomTool();
    }
    this.updateDeleteControls();
    this.showToast(next ? 'Borrado activado: marca trazos y borra todo junto' : 'Borrado desactivado', 'info');
  }

  toggleDeleteRegion(regionId) {
    if (!regionId) return;
    const key = String(regionId);
    if (this.deleteRegionIds.has(key)) {
      this.deleteRegionIds.delete(key);
    } else {
      this.deleteRegionIds.add(key);
    }
    this.currentRegion = null;
    this.labels = [];
    this.imageViewer.setSelectedRegion(null);
    this.annotationPanel.setRegion(null, []);
    this.imageViewer.setPendingDeleteRegionIds([...this.deleteRegionIds]);
    this.updateDeleteControls();
  }

  queuePaintStroke(stroke) {
    if (!this.activeAtomId) {
      this.showToast('Selecciona un atomo guardado para pintar en bloque', 'error');
      this.togglePaintMode(false);
      return;
    }
    const labelSnapshot = this.paintLabelsForActiveAtom();
    if (!labelSnapshot.family) {
      this.showToast('El atomo activo no tiene familia base', 'error');
      return;
    }
    const color = this.normalizeColor(stroke.color) || stroke.color || this.atomColor(this.activeAtomId);
    this.paintStrokeBuffer.push({
      ...stroke,
      color,
      closed: false,
      labels: labelSnapshot.labels.map((label) => ({ ...label })),
      family: labelSnapshot.family,
      structuralConfig: labelSnapshot.structuralConfig,
      orderIndex: this.nextAtomOrder() + this.paintStrokeBuffer.length,
    });
    this.imageViewer.setPendingPaintStrokes(this.paintStrokeBuffer);
    this.updatePaintControls();
  }

  paintLabelsForActiveAtom() {
    const atom = this.atomLibrary.find((item) => String(item.id) === String(this.activeAtomId));
    if (!atom) return { labels: [], family: '', structuralConfig: this.activeStructuralConfig || '1' };

    const labels = [];
    const seen = new Set();
    for (const label of atom.labels || []) {
      if (this.isComputedAtomLabel(label)) continue;
      const labelType = String(label.label_type || label.labelType || '').trim();
      const value = String(label.value || '').trim();
      if (!labelType || !value) continue;
      const key = `${labelType}\u0000${value}`;
      if (seen.has(key)) continue;
      seen.add(key);
      labels.push({ label_type: labelType, value });
    }

    const family = this.labelValue(labels, ['base_family']) || this.atomGroupKey(atom);
    if (family && !labels.some((label) => (label.label_type || label.labelType) === 'base_family')) {
      labels.push({ label_type: 'base_family', value: family });
    }

    const structuralConfig = String(this.activeStructuralConfig || this.atomConfigKey(atom) || '1').trim() || '1';
    labels.push({ label_type: 'structural_config', value: structuralConfig });
    return { labels, family, structuralConfig };
  }

  async commitPaintBuffer(options = {}) {
    if (!this.currentImage || !this.paintStrokeBuffer.length) return;
    const invalidStroke = this.paintStrokeBuffer.find((stroke) => !stroke.family);
    if (invalidStroke) {
      this.showToast('Hay trazos sin etiqueta en el buffer de pintura', 'error');
      return;
    }

    if (this.editCommitBtn) this.editCommitBtn.disabled = true;
    const strokes = this.paintStrokeBuffer.map((stroke) => ({
      geometry_json: JSON.stringify({
        points: stroke.points,
        color: stroke.color,
        width: stroke.width,
        closed: false,
      }),
      order_index: stroke.orderIndex,
      labels: stroke.labels || [],
      family: stroke.family,
      structural_config: stroke.structuralConfig || '1',
    }));
    const packet = await api.createAtomStrokesBatch(this.currentImage.id, strokes);
    const createdCount = this.paintStrokeBuffer.length;
    this.clearPaintBuffer({ silent: true });
    await this.loadRegions(this.currentImage.id);
    this.applyAtomPagePacket(packet);
    if (!options.keepEditSession) this.showToast(`${createdCount} trazos aplicados`, 'success');
  }

  clearPaintBuffer({ silent = false } = {}) {
    this.paintStrokeBuffer = [];
    this.imageViewer?.setPendingPaintStrokes([]);
    this.updatePaintControls();
    this.updateEditControls();
    if (!silent) this.showToast('Pintura pendiente cancelada', 'info');
  }

  async commitDeleteBuffer(options = {}) {
    if (!this.currentImage || !this.deleteRegionIds.size) return;
    const regionIds = [...this.deleteRegionIds].map((id) => Number(id)).filter(Number.isFinite);
    if (!regionIds.length) return;

    if (this.editCommitBtn) this.editCommitBtn.disabled = true;
    try {
      const snapshots = (await Promise.all(regionIds.map((regionId) => this.snapshotRegion(regionId)))).filter(Boolean);
      await api.deleteRegionsBatch(regionIds);
      this.pushHistory({ type: 'delete-batch', snapshots, restoredIds: [] });
      this.redoStack = [];
      const deletedCount = regionIds.length;
      this.clearDeleteBuffer({ silent: true });
      await this.loadRegions(this.currentImage.id);
      await this.selectRegion(null);
      const packet = await this.recalculateCurrentImageMolecules();
      this.applyAtomPagePacket(packet);
      if (!options.keepEditSession) this.showToast(`${deletedCount} trazos borrados`, 'success');
    } finally {
      this.updateDeleteControls();
    }
  }

  clearDeleteBuffer({ silent = false } = {}) {
    this.deleteRegionIds.clear();
    this.imageViewer?.setPendingDeleteRegionIds([]);
    this.updateDeleteControls();
    this.updateEditControls();
    if (!silent) this.showToast('Borrado pendiente cancelado', 'info');
  }

  toggleRowEditMode(force = null) {
    const next = force === null ? !this.rowEditModeActive : Boolean(force);
    if (next && this.paintModeActive) {
      this.togglePaintMode(false);
    }
    if (next && this.deleteModeActive) {
      this.toggleDeleteMode(false);
    }

    this.rowEditModeActive = next;
    this.imageViewer?.setRowEditMode(next);
    if (next) {
      this.clearActiveAtomTool();
      this.rowEditSnapshot = this.imageViewer?.getParticleRowGuides() || [];
      this.captureMoleculeGapEditSnapshot();
      this.rowEditChangedRows.clear();
    } else if (this.rowEditChangedRows.size) {
      this.clearRowGuideEdits({ silent: true });
    } else if (this.pendingMoleculeGapOverrides.size) {
      this.clearMoleculeGapEdits({ silent: true });
    }
    this.updateRowEditControls();
    this.showToast(next ? 'Edicion de renglones activada: guardar recalcula una vez' : 'Edicion de renglones desactivada', 'info');
  }

  queueRowGuideEdit(rowIndex) {
    const clean = Number(rowIndex);
    if (Number.isFinite(clean)) {
      this.rowEditChangedRows.add(clean);
    }
    this.updateRowEditControls();
  }

  async commitRowGuideEdits(options = {}) {
    if (!this.currentImage || !this.rowEditChangedRows.size) return;
    const guides = this.imageViewer?.getParticleRowGuides() || [];
    if (!guides.length) return;

    if (this.editCommitBtn) this.editCommitBtn.disabled = true;
    const packet = await api.setParticleRowGuides(this.currentImage.id, guides);
    const changedCount = this.rowEditChangedRows.size;
    this.rowEditChangedRows.clear();
    this.applyAtomPagePacket(packet);
    this.rowEditSnapshot = this.imageViewer?.getParticleRowGuides() || [];
    this.updateRowEditControls();
    if (!options.keepEditSession) this.showToast(`${changedCount} renglones guardados`, 'success');
  }

  clearRowGuideEdits({ silent = false } = {}) {
    if (this.rowEditSnapshot.length) {
      this.imageViewer?.setParticleRowGuides(this.rowEditSnapshot);
    }
    this.rowEditChangedRows.clear();
    this.updateRowEditControls();
    this.updateEditControls();
    if (!silent) this.showToast('Edicion de renglones cancelada', 'info');
  }

  captureMoleculeGapEditSnapshot() {
    this.gapEditSnapshot.clear();
    const gaps = this.currentMoleculeGaps();
    for (const gap of gaps) {
      const key = this.moleculeGapKey(gap.left_particle_index ?? gap.leftParticleIndex, gap.right_particle_index ?? gap.rightParticleIndex);
      if (!key) continue;
      this.gapEditSnapshot.set(key, {
        cut: Boolean(gap.cut),
        overrideDecision: gap.override_decision ?? gap.overrideDecision ?? null,
        reason: gap.reason || '',
      });
    }
  }

  currentMoleculeGaps() {
    const explanation = this.atomPagePacket?.cluster_explanation || this.atomPagePacket?.clusterExplanation || {};
    return explanation.molecule_gaps || explanation.moleculeGaps || [];
  }

  moleculeGapKey(leftParticleIndex, rightParticleIndex) {
    const left = Number(leftParticleIndex || 0);
    const right = Number(rightParticleIndex || 0);
    return left && right ? `${left}:${right}` : '';
  }

  queueMoleculeGapEdit(gap, action) {
    const left = Number(gap.leftParticleIndex || gap.left_particle_index || 0);
    const right = Number(gap.rightParticleIndex || gap.right_particle_index || 0);
    const key = this.moleculeGapKey(left, right);
    if (!key || !['cut', 'join', 'auto'].includes(action)) return;

    if (!this.gapEditSnapshot.size) this.captureMoleculeGapEditSnapshot();
    const existing = this.pendingMoleculeGapOverrides.get(key);
    if (existing) {
      const snapshot = this.gapEditSnapshot.get(key);
      if (snapshot?.overrideDecision) {
        this.pendingMoleculeGapOverrides.set(key, { leftParticleIndex: left, rightParticleIndex: right, decision: 'auto' });
        this.restoreMoleculeGapSnapshot(left, right, { ...snapshot, overrideDecision: null, reason: 'auto pendiente' });
      } else {
        this.pendingMoleculeGapOverrides.delete(key);
        if (snapshot) {
          this.restoreMoleculeGapSnapshot(left, right, snapshot);
        }
      }
      if (!this.pendingMoleculeGapOverrides.size) this.gapEditSnapshot.clear();
      this.updateRowEditControls();
      return;
    }
    if (action === 'auto') {
      const snapshot = this.gapEditSnapshot.get(key);
      if (snapshot?.overrideDecision) {
        this.pendingMoleculeGapOverrides.set(key, { leftParticleIndex: left, rightParticleIndex: right, decision: 'auto' });
        this.restoreMoleculeGapSnapshot(left, right, { ...snapshot, overrideDecision: null, reason: 'auto pendiente' });
      } else if (snapshot) {
        this.restoreMoleculeGapSnapshot(left, right, snapshot);
      }
      if (!this.pendingMoleculeGapOverrides.size) this.gapEditSnapshot.clear();
      this.updateRowEditControls();
      return;
    }
    this.pendingMoleculeGapOverrides.set(key, { leftParticleIndex: left, rightParticleIndex: right, decision: action });
    this.applyMoleculeGapDraft(left, right, action);
    this.updateRowEditControls();
  }

  restoreMoleculeGapSnapshot(leftParticleIndex, rightParticleIndex, snapshot = {}) {
    const key = this.moleculeGapKey(leftParticleIndex, rightParticleIndex);
    const gaps = this.currentMoleculeGaps();
    const gap = gaps.find((item) => this.moleculeGapKey(item.left_particle_index ?? item.leftParticleIndex, item.right_particle_index ?? item.rightParticleIndex) === key);
    if (gap) {
      gap.cut = Boolean(snapshot.cut);
      gap.override_decision = snapshot.overrideDecision;
      gap.overrideDecision = snapshot.overrideDecision;
      gap.reason = snapshot.reason || '';
    }
    this.imageViewer?.setMoleculeGapState(leftParticleIndex, rightParticleIndex, {
      cut: Boolean(snapshot.cut),
      overrideDecision: snapshot.overrideDecision,
      reason: snapshot.reason || '',
    });
    this.renderClusterDebugPanel({ lightweight: true });
  }

  applyMoleculeGapDraft(leftParticleIndex, rightParticleIndex, decision) {
    const key = this.moleculeGapKey(leftParticleIndex, rightParticleIndex);
    const gaps = this.currentMoleculeGaps();
    const gap = gaps.find((item) => this.moleculeGapKey(item.left_particle_index ?? item.leftParticleIndex, item.right_particle_index ?? item.rightParticleIndex) === key);
    if (gap) {
      gap.cut = decision === 'cut';
      gap.override_decision = decision;
      gap.overrideDecision = decision;
      gap.reason = 'manual';
    }
    this.imageViewer?.setMoleculeGapDraft(leftParticleIndex, rightParticleIndex, decision);
    this.renderClusterDebugPanel({ lightweight: true });
  }

  async commitMoleculeGapEdits(options = {}) {
    if (!this.currentImage || !this.pendingMoleculeGapOverrides.size) return;
    if (this.editCommitBtn) this.editCommitBtn.disabled = true;
    const overrides = [...this.pendingMoleculeGapOverrides.values()];
    const packet = await api.setMoleculeGapOverridesBatch(this.currentImage.id, overrides);
    const changedCount = overrides.length;
    this.pendingMoleculeGapOverrides.clear();
    this.gapEditSnapshot.clear();
    this.applyAtomPagePacket(packet);
    this.updateRowEditControls();
    if (!options.keepEditSession) this.showToast(`${changedCount} cortes/uniones guardados`, 'success');
  }

  clearMoleculeGapEdits({ silent = false } = {}) {
    for (const [key, snapshot] of this.gapEditSnapshot.entries()) {
      const draft = this.pendingMoleculeGapOverrides.get(key);
      if (!draft) continue;
      this.restoreMoleculeGapSnapshot(draft.leftParticleIndex, draft.rightParticleIndex, snapshot);
    }
    this.pendingMoleculeGapOverrides.clear();
    this.gapEditSnapshot.clear();
    this.renderClusterDebugPanel({ lightweight: true });
    this.updateEditControls();
    if (!silent) this.showToast('Edicion de cortes cancelada', 'info');
  }

  queueParticleRowOverrideEdit(sourceIndex, rowIndex) {
    const particleIndex = Number(sourceIndex || 0);
    const cleanRow = rowIndex === null ? null : Number(rowIndex || 0);
    if (!particleIndex || (cleanRow !== null && !cleanRow)) return;
    if (!this.particleRowOverrideSnapshot.has(String(particleIndex))) {
      this.particleRowOverrideSnapshot.set(String(particleIndex), this.currentParticleRowOverrideValue(particleIndex));
    }
    this.pendingParticleRowOverrides.set(String(particleIndex), { particleIndex, rowIndex: cleanRow });
    this.applyLocalParticleRowOverride(particleIndex, cleanRow);
    this.updateEditControls();
  }

  currentParticleRowOverrideValue(sourceIndex) {
    const explanation = this.atomPagePacket?.cluster_explanation || this.atomPagePacket?.clusterExplanation || {};
    const particleRows = explanation.particle_rows || explanation.particleRows || [];
    for (const row of particleRows) {
      for (const particle of row.particles || []) {
        if (Number(particle.source_index ?? particle.sourceIndex ?? 0) === Number(sourceIndex)) {
          return particle.row_override ?? particle.rowOverride ?? null;
        }
      }
    }
    return null;
  }

  applyLocalParticleRowOverride(sourceIndex, rowIndex) {
    const explanation = this.atomPagePacket?.cluster_explanation || this.atomPagePacket?.clusterExplanation || {};
    const particleRows = explanation.particle_rows || explanation.particleRows || [];
    for (const row of particleRows) {
      for (const particle of row.particles || []) {
        if (Number(particle.source_index ?? particle.sourceIndex ?? 0) !== Number(sourceIndex)) continue;
        particle.row_override = rowIndex;
        particle.rowOverride = rowIndex;
      }
    }
    this.renderClusterDebugPanel({ lightweight: true });
  }

  async commitParticleRowOverrideEdits(options = {}) {
    if (!this.currentImage || !this.pendingParticleRowOverrides.size) return;
    if (this.editCommitBtn) this.editCommitBtn.disabled = true;
    const overrides = [...this.pendingParticleRowOverrides.values()];
    const packet = await api.setParticleRowOverridesBatch(this.currentImage.id, overrides);
    const changedCount = overrides.length;
    this.pendingParticleRowOverrides.clear();
    this.particleRowOverrideSnapshot.clear();
    this.applyAtomPagePacket(packet);
    this.updateEditControls();
    if (!options.keepEditSession) this.showToast(`${changedCount} cambios de renglon guardados`, 'success');
  }

  clearParticleRowOverrideEdits({ silent = false } = {}) {
    for (const [sourceIndex, rowIndex] of this.particleRowOverrideSnapshot.entries()) {
      this.applyLocalParticleRowOverride(Number(sourceIndex), rowIndex);
    }
    this.pendingParticleRowOverrides.clear();
    this.particleRowOverrideSnapshot.clear();
    this.updateEditControls();
    if (!silent) this.showToast('Edicion de renglones de particula cancelada', 'info');
  }

  updatePaintControls() {
    this.updateEditControls();
  }

  updateDeleteControls() {
    this.updateEditControls();
  }

  updateRowEditControls() {
    this.updateEditControls();
  }

  updateEditControls() {
    const pendingCount = this.editPendingCount();
    this.editModeBtn?.classList.toggle('edit-controls__toggle--active', this.editModeActive);
    this.editToolsEl?.classList.toggle('hidden', !this.editModeActive);
    for (const button of this.editToolButtons || []) {
      const tool = button.dataset.editTool || '';
      button.disabled = !this.editModeActive;
      button.classList.toggle('edit-controls__tool--active', this.editModeActive && this.editTool === tool);
    }
    if (this.editCountEl) {
      this.editCountEl.textContent = String(pendingCount);
      this.editCountEl.classList.toggle('edit-controls__count--active', pendingCount > 0);
    }
    if (this.editCommitBtn) {
      this.editCommitBtn.disabled = pendingCount === 0;
      this.editCommitBtn.classList.toggle('hidden', pendingCount === 0);
    }
    if (this.editCancelBtn) {
      this.editCancelBtn.disabled = pendingCount === 0;
      this.editCancelBtn.classList.toggle('hidden', pendingCount === 0);
    }
  }

  async setupMoleculeEvents() {
    await api.listenMoleculesUpdated(async (packet) => {
      if (!this.currentImage) return;
      if (Number(packet?.image_id ?? packet?.imageId) !== Number(this.currentImage.id)) return;
      this.applyAtomPagePacket(packet);
    });
  }

  async openVoynich() {
    try {
      const existingImages = await api.listImages();
      if (existingImages.length === 0) {
        await api.syncDefaultManuscriptPages();
      }
      await this.loadImages();
    } catch (err) {
      this.showToast(`No pude abrir paginas: ${err}`, 'error');
    }
  }

  async loadImages() {
    this.images = await api.listImages();
    this.atomCounts = {};
    for (const image of this.images) {
      const regions = await api.listRegions(image.id);
      this.atomCounts[image.id] = regions.length;
    }
    this.imageList.setImages(this.images);
    this.imageList.setAtomCounts(this.atomCounts);
    if (this.images.length > 0 && !this.currentImage) {
      await this.selectImage(this.images[0].id);
    }
  }

  async selectImage(imageId) {
    if (this.hasPendingOrderDrafts()) {
      await this.flushPendingOrderDrafts();
    } else if (this.moleculeEditMode) {
      this.discardMoleculeOrderDrafts({ render: false });
    }
    if (this.paintStrokeBuffer.length) {
      this.clearPaintBuffer({ silent: true });
    }
    if (this.deleteModeActive || this.deleteRegionIds.size) {
      this.deleteModeActive = false;
      this.imageViewer?.setBatchDeleteMode(false);
      this.clearDeleteBuffer({ silent: true });
      this.updateDeleteControls();
    }
    if (this.rowEditModeActive || this.rowEditChangedRows.size) {
      this.rowEditModeActive = false;
      this.imageViewer?.setRowEditMode(false);
      this.rowEditSnapshot = [];
      this.rowEditChangedRows.clear();
      this.updateRowEditControls();
    }
    if (this.pendingMoleculeGapOverrides.size) {
      this.pendingMoleculeGapOverrides.clear();
      this.gapEditSnapshot.clear();
      this.updateEditControls();
    }
    if (this.pendingParticleRowOverrides.size) {
      this.pendingParticleRowOverrides.clear();
      this.particleRowOverrideSnapshot.clear();
      this.updateEditControls();
    }
    if (this.editModeActive || this.editTool) {
      this.editModeActive = false;
      this.editTool = null;
      this.paintModeActive = false;
      this.deleteModeActive = false;
      this.rowEditModeActive = false;
      this.imageViewer?.setBatchDeleteMode(false);
      this.imageViewer?.setRowEditMode(false);
      this.updateEditControls();
    }
    const image = await api.getImage(imageId);
    this.currentImage = image;
    this.currentRegion = null;
    this.annotationPanel.clear();
    this.canvasEmptyEl.classList.add('hidden');

    const base64 = await api.getImageBase64(imageId);
    await this.imageViewer.loadImage(base64);
    this.imageList.setSelectedImage(imageId);
    await this.loadRegions(imageId);
    await this.autoClassifyCurrentImageVariants();
    const packet = await this.recalculateCurrentImageMolecules();
    this.applyAtomPagePacket(packet);
  }

  async loadRegions(imageId) {
    const allRegions = await api.listRegions(imageId);
    this.regions = allRegions;
    this.imageViewer.setRegions(this.regions);
    this.atomCounts[imageId] = this.regions.length;
    this.imageList.setAtomCounts(this.atomCounts);
  }

  async selectRegion(regionId) {
    if (!regionId) {
      this.currentRegion = null;
      this.labels = [];
      this.imageViewer.setSelectedRegion(null);
      this.annotationPanel.setRegion(null, []);
      return;
    }

    const region = this.regions.find((item) => Number(item.id) === Number(regionId));
    if (!region) return;

    this.currentRegion = region;
    this.imageViewer.setSelectedRegion(region.id);
    await this.loadLabels(region.id);
  }

  async loadLabels(regionId) {
    this.labels = await api.listLabels(regionId);
    this.annotationPanel.setRegion(this.currentRegion, this.labels);
  }

  async upsertLabel(regionId, aliases, labelType, value) {
    const clean = String(value || '').trim();
    const existing = (await api.listLabels(regionId)).find((label) => aliases.includes(label.label_type));
    if (existing && clean) {
      await api.updateLabel(existing.id, { value: clean });
      return;
    }
    if (existing && !clean) {
      await api.deleteLabel(existing.id);
      return;
    }
    if (clean) {
      await api.createLabel(regionId, labelType, clean);
    }
  }

  async applyActiveAtomLabels(regionId) {
    const atom = this.atomLibrary.find((item) => String(item.id) === String(this.activeAtomId));
    if (!atom) return;
    for (const label of atom.labels || []) {
      if (this.isComputedAtomLabel(label)) continue;
      await api.createLabel(regionId, label.label_type, label.value);
    }
  }

  async applyActiveStructuralConfig(regionId) {
    if (!this.activeAtomId) return;
    const labels = await api.listLabels(regionId);
    await this.setAutoLabel(regionId, labels, 'structural_config', this.activeStructuralConfig || '1');
  }

  async createAtomStroke(stroke) {
    const color = !this.activeAtomId && this.pendingNewAtomColor
      ? this.pendingNewAtomColor
      : this.normalizeColor(stroke.color) || stroke.color;
    const region = await api.createRegion(
      this.currentImage.id,
      JSON.stringify({ ...stroke, color, closed: false }),
      this.nextAtomOrder()
    );
    await this.applyActiveAtomLabels(region.id);
    await this.applyActiveStructuralConfig(region.id);
    await this.autoClassifyCurrentImageVariants();
    await this.syncAtomEngine(region.id);
    await this.recordCreateAction(region.id);
    if (!this.activeAtomId && this.pendingNewAtomColor) {
      this.pendingNewAtomRegionId = Number(region.id);
    }
    await this.loadRegions(this.currentImage.id);
    await this.selectRegion(region.id);
    this.scheduleMoleculeRecalculate();
  }

  async saveSelectedAtomDefinition() {
    if (!this.currentRegion) {
      this.showToast('Selecciona un atomo primero', 'error');
      return;
    }
    const labels = await api.listLabels(this.currentRegion.id);
    const family = this.labelValue(labels, ['base_family']);
    const defaultName = this.friendlyAtomKey(family || 'atomo');
    const name = await this.requestAtomName(defaultName);
    if (name === null) {
      if (
        this.pendingNewAtomColor &&
        Number(this.currentRegion.id) === Number(this.pendingNewAtomRegionId)
      ) {
        await this.cancelNewAtomCreation({ deletePendingRegion: true });
      }
      return;
    }
    const atomKey = this.friendlyAtomKey(name.trim());
    if (!atomKey) return;
    const color = this.regionColor(this.currentRegion);
    if (
      this.pendingNewAtomColor &&
      Number(this.currentRegion.id) !== Number(this.pendingNewAtomRegionId)
    ) {
      this.showToast('Dibuja o selecciona el trazo nuevo antes de guardarlo', 'error');
      return;
    }
    if (this.pendingNewAtomColor && color !== this.pendingNewAtomColor) {
      await this.updateRegionColor(this.currentRegion.id, this.pendingNewAtomColor);
      const refreshed = await this.snapshotRegion(this.currentRegion.id);
      this.currentRegion = refreshed?.region || this.currentRegion;
    }
    const finalColor = this.regionColor(this.currentRegion);
    const colorOwner = this.atomColorOwner(finalColor);
    if (colorOwner && colorOwner !== atomKey) {
      this.showToast(`Ese color ya pertenece a ${colorOwner}`, 'error');
      return;
    }
    await this.upsertLabel(this.currentRegion.id, ['base_family'], 'base_family', atomKey);
    await this.setStructuralConfig(this.currentRegion.id, this.activeStructuralConfig || '1', { silent: true });
    await this.autoClassifyCurrentImageVariants();
    const updatedLabels = await api.listLabels(this.currentRegion.id);
    const updatedVariant = this.atomVariantKeyFromLabels(updatedLabels);
    const configKey = this.atomConfigKeyFromLabels(updatedLabels);

    const atom = {
      id: `${this.safeFilePart(`${atomKey}-${configKey}`)}-${Date.now()}`,
      name: atomKey,
      atomKey,
      configKey,
      variantKey: updatedVariant,
      region: { ...this.currentRegion },
      bounds: this.regionBounds(this.currentRegion),
      labels: updatedLabels,
      createdAt: new Date().toISOString(),
    };

    this.atomLibrary = [
      atom,
      ...this.atomLibrary.filter((item) => (
        this.atomGroupKey(item) !== atomKey || this.atomConfigKey(item) !== configKey
      )),
    ].slice(0, 300);
    this.saveAtomLibrary();
    this.activeAtomId = atom.id;
    this.activeAtomKey = atomKey;
    this.pendingNewAtomColor = null;
    this.pendingNewAtomRegionId = null;
    this.activeStructuralConfig = configKey;
    this.annotationPanel.setAtomLibrary(this.atomLibrary);
    this.annotationPanel.setActiveAtom(atom.id);
    this.updateAtomPreview();
    this.showToast(`${atomKey} / config ${configKey} guardado`, 'success');
  }

  requestAtomName(defaultName = '') {
    if (!this.atomNameModal || !this.atomNameInput) {
      return Promise.resolve(defaultName);
    }

    this.atomNameInput.value = '';
    this.atomNameModal.classList.add('modal-overlay--visible');
    this.atomNameModal.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => {
      this.atomNameInput.focus();
      this.atomNameInput.select();
    }, 0);

    return new Promise((resolve) => {
      this.pendingAtomNameResolver = resolve;
    });
  }

  resolveAtomNameModal(value) {
    if (!this.pendingAtomNameResolver) return;
    const resolve = this.pendingAtomNameResolver;
    this.pendingAtomNameResolver = null;
    this.atomNameModal?.classList.remove('modal-overlay--visible');
    this.atomNameModal?.setAttribute('aria-hidden', 'true');
    resolve(value);
  }

  async deleteRegion(regionId) {
    const snapshot = await this.snapshotRegion(regionId);
    await api.deleteRegion(regionId);
    this.pushHistory({ type: 'delete', snapshot, restoredId: null });
    this.redoStack = [];
    this.currentRegion = null;
    await this.loadRegions(this.currentImage.id);
    await this.selectRegion(null);
    this.scheduleMoleculeRecalculate();
  }

  async snapshotRegion(regionId) {
    const region = (await api.listRegions(this.currentImage.id)).find((item) => Number(item.id) === Number(regionId));
    if (!region) return null;
    return {
      imageId: this.currentImage.id,
      region,
      labels: await api.listLabels(region.id),
    };
  }

  async restoreSnapshot(snapshot) {
    const restored = await api.createRegion(
      snapshot.imageId,
      snapshot.region.geometry_json,
      snapshot.region.order_index
    );
    for (const label of snapshot.labels || []) {
      await api.createLabel(restored.id, label.label_type, label.value);
    }
    return restored.id;
  }

  async applySnapshot(snapshot) {
    await api.updateRegion(snapshot.region.id, {
      geometryJson: snapshot.region.geometry_json,
      orderIndex: snapshot.region.order_index,
    });
  }

  async recordCreateAction(regionId) {
    const snapshot = await this.snapshotRegion(regionId);
    this.pushHistory({ type: 'create', snapshot, currentId: Number(regionId) });
    this.redoStack = [];
  }

  pushHistory(action) {
    if (!action?.snapshot && !action?.before && !action?.snapshots?.length) return;
    this.undoStack.push(action);
    if (this.undoStack.length > this.historyLimit) this.undoStack.shift();
  }

  async undo() {
    const action = this.undoStack.pop();
    if (!action) return;
    try {
      if (action.type === 'create') {
        await api.deleteRegion(action.currentId || action.snapshot.region.id);
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(null);
      } else if (action.type === 'delete') {
        action.restoredId = await this.restoreSnapshot(action.snapshot);
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(action.restoredId);
      } else if (action.type === 'delete-batch') {
        action.restoredIds = [];
        for (const snapshot of action.snapshots || []) {
          const restoredId = await this.restoreSnapshot(snapshot);
          action.restoredIds.push(restoredId);
        }
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(null);
      } else if (action.type === 'update') {
        await this.applySnapshot(action.before);
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(action.before.region.id);
      }
      this.redoStack.push(action);
      this.scheduleMoleculeRecalculate();
    } catch (err) {
      this.showToast(`No pude deshacer: ${err}`, 'error');
    }
  }

  async redo() {
    const action = this.redoStack.pop();
    if (!action) return;
    try {
      if (action.type === 'create') {
        const restoredId = await this.restoreSnapshot(action.snapshot);
        action.currentId = restoredId;
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(restoredId);
      } else if (action.type === 'delete') {
        await api.deleteRegion(action.restoredId || action.snapshot.region.id);
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(null);
      } else if (action.type === 'delete-batch') {
        const ids = (action.restoredIds || []).filter(Boolean);
        if (ids.length) {
          await api.deleteRegionsBatch(ids);
        } else {
          await api.deleteRegionsBatch((action.snapshots || []).map((snapshot) => snapshot.region.id));
        }
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(null);
      } else if (action.type === 'update') {
        await this.applySnapshot(action.after);
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(action.after.region.id);
      }
      this.undoStack.push(action);
      this.scheduleMoleculeRecalculate();
    } catch (err) {
      this.showToast(`No pude rehacer: ${err}`, 'error');
    }
  }

  nextAtomOrder() {
    const orders = this.regions.map((region) => Number(region.order_index ?? region.orderIndex)).filter(Number.isFinite);
    return orders.length ? Math.max(...orders) + 1 : 1;
  }

  loadAtomLibrary() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(ATOM_LIBRARY_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  saveAtomLibrary() {
    window.localStorage.setItem(ATOM_LIBRARY_KEY, JSON.stringify(this.atomLibrary));
  }

  async autoClassifyCurrentImageVariants() {
    if (!this.currentImage) return;
    const allRegions = await api.listRegions(this.currentImage.id);
    const rows = await Promise.all(allRegions.map(async (region) => {
      const labels = await api.listLabels(region.id);
      return {
        region,
        labels,
        key: this.friendlyAtomKey(this.labelValue(labels, ['base_family'])),
        bounds: this.regionBounds(region),
      };
    }));

    for (const target of rows) {
      if (!target.key) continue;
      const targetRadius = this.classificationRadius(target.bounds);
      const hasNearbyDifferentAtom = rows.some((other) => {
        if (Number(other.region.id) === Number(target.region.id)) return false;
        if (!other.key || other.key === target.key) return false;
        return this.boundsDistance(target.bounds, other.bounds) <= targetRadius;
      });
      await this.setVariantLabel(target.region.id, target.labels, hasNearbyDifferentAtom ? 'incrustada' : 'aislada');
    }
  }

  async setVariantLabel(regionId, labels, value) {
    const existing = labels.find((label) => (label.label_type || label.labelType) === 'visual_variant');
    if (existing) {
      if (existing.value !== value) {
        await api.updateLabel(existing.id, { value });
      }
      return;
    }
    await api.createLabel(regionId, 'visual_variant', value);
  }

  async setStructuralConfig(regionId, value, options = {}) {
    const labels = await api.listLabels(regionId);
    await this.setAutoLabel(regionId, labels, 'structural_config', value);
    await this.loadLabels(regionId);
    if (!options.silent) this.showToast(`Configuracion ${value}`, 'success');
  }

  applyConfigChoice(value) {
    this.activeStructuralConfig = String(value || '1');
    this.annotationPanel.setActiveConfig(this.activeStructuralConfig);
    this.selectActiveAtomPattern();
    this.updateAtomPreview();
    if (this.currentRegion) {
      this.setStructuralConfig(this.currentRegion.id, this.activeStructuralConfig)
        .catch((err) => this.showToast(`No pude marcar configuracion: ${err}`, 'error'));
    } else if (this.activeAtomId) {
      this.showToast(`Preview ${this.activeStructuralConfig}`, 'info');
    }
  }

  async syncAtomEngine(regionId) {
    const labels = await api.listLabels(regionId);
    const family = this.friendlyAtomKey(this.labelValue(labels, ['base_family']));
    const structuralConfig = this.labelValue(labels, ['structural_config']) || this.activeStructuralConfig || '1';
    await api.syncAtomForRegion(regionId, family, structuralConfig);
  }

  async recalculateCurrentImageMolecules() {
    if (!this.currentImage) return null;
    return api.recalculateMolecules(this.currentImage.id);
  }

  scheduleMoleculeRecalculate() {
    if (!this.currentImage) return;
    window.clearTimeout(this.moleculeRecalculateTimer);
    this.moleculeRecalculateTimer = window.setTimeout(async () => {
      try {
        const packet = await this.recalculateCurrentImageMolecules();
        this.applyAtomPagePacket(packet);
      } catch (err) {
        this.showToast(`No pude recalcular moleculas: ${err}`, 'error');
      }
    }, 300);
  }

  applyAtomPagePacket(packet, options = {}) {
    this.atomPagePacket = packet || null;
    const preserveOrderDrafts = options.preserveOrderDrafts
      || (this.editModeActive && this.hasPendingOrderDrafts() && !options.clearOrderDrafts);
    if (!preserveOrderDrafts) {
      this.pendingParticleAtomOrders.clear();
      this.pendingMoleculeParticleOrders.clear();
      this.moleculeEditMode = false;
      this.moleculeEditSnapshot = null;
      this.moleculeEditSnapshots.clear();
    }
    this.imageViewer.setHierarchy(packet || { molecules: [], particles: [] });
    if (this.pendingMoleculeGapOverrides.size) {
      for (const draft of this.pendingMoleculeGapOverrides.values()) {
        this.applyMoleculeGapDraft(draft.leftParticleIndex, draft.rightParticleIndex, draft.decision);
      }
    }
    if (this.pendingParticleRowOverrides.size) {
      for (const draft of this.pendingParticleRowOverrides.values()) {
        this.applyLocalParticleRowOverride(draft.particleIndex, draft.rowIndex);
      }
    }
    this.imageViewer.setSelectedMolecule(this.selectedMoleculeId);
    const lightweight = options.lightweight ?? (this.canSwitchMoleculeDuringEdit() && this.hasPendingOrderDrafts());
    this.renderClusterDebugPanel({ lightweight });
  }

  async locateCurrentPageTarget(rawQuery) {
    const query = String(rawQuery || '').trim();
    if (!query || !this.currentImage || !this.atomPagePacket) return;

    const normalized = query.toLowerCase().replace(/\s+/g, '');
    const atomIdMatch = normalized.match(/^(?:atom|atomo|a|id)[:#-]?(\d+)$/) || normalized.match(/^(\d+)$/);
    if (atomIdMatch) {
      const atom = this.findAtomById(Number(atomIdMatch[1]));
      if (atom) {
        await this.focusAtom(atom);
        return;
      }
    }

    const molecule = this.findMoleculeByQuery(normalized);
    if (molecule) {
      this.focusMolecule(molecule);
      return;
    }

    const particle = this.findParticleByQuery(normalized);
    if (particle) {
      this.focusParticle(particle);
      return;
    }

    this.showToast(`No encontre "${query}" en esta pagina`, 'warning');
  }

  findAtomById(atomId) {
    const atoms = this.atomPagePacket?.atoms || [];
    return atoms.find((atom) => Number(atom.id) === Number(atomId));
  }

  findMoleculeByQuery(normalizedQuery) {
    const molecules = this.atomPagePacket?.molecules || [];
    const moleculeIds = this.moleculeQueryCandidates(normalizedQuery);
    return molecules.find((molecule) => {
      const id = String(molecule.molecule_id ?? molecule.moleculeId ?? '').toLowerCase();
      return moleculeIds.includes(id);
    });
  }

  findParticleByQuery(normalizedQuery) {
    const particles = this.atomPagePacket?.particles || [];
    return particles.find((particle) => {
      const id = String(particle.particle_id ?? particle.particleId ?? '').toLowerCase();
      return id === normalizedQuery;
    });
  }

  moleculeQueryCandidates(normalizedQuery) {
    const imageId = Number(this.currentImage?.id || 0);
    const candidates = new Set([normalizedQuery]);
    const short = normalizedQuery.match(/^m(\d+)$/);
    const bareNumber = normalizedQuery.match(/^(\d+)$/);
    if (short && imageId) candidates.add(`img${imageId}-m${short[1]}`);
    if (bareNumber && imageId) candidates.add(`img${imageId}-m${bareNumber[1]}`);
    return [...candidates];
  }

  async focusAtom(atom) {
    const moleculeId = atom.molecule_id ?? atom.moleculeId ?? null;
    if (moleculeId) {
      this.selectedMoleculeId = moleculeId;
      this.imageViewer.setSelectedMolecule(moleculeId);
    }
    await this.selectRegion(atom.region_id ?? atom.regionId);
    this.imageViewer.focusBox(this.atomBounds(atom), { minZoom: 1.35, maxZoom: 4.5, padding: 120 });
    this.renderClusterDebugPanel();
    this.showToast(`Atomo ${atom.id} localizado${moleculeId ? ` en ${moleculeId}` : ''}`, 'success');
  }

  focusMolecule(molecule) {
    const moleculeId = molecule.molecule_id ?? molecule.moleculeId;
    this.selectedMoleculeId = moleculeId;
    this.imageViewer.setSelectedMolecule(moleculeId);
    this.imageViewer.focusBox(this.boxFromEntity(molecule), { minZoom: 0.9, maxZoom: 2.6, padding: 120 });
    this.renderClusterDebugPanel();
    this.showToast(`Molecula ${moleculeId} localizada`, 'success');
  }

  focusParticle(particle) {
    const moleculeId = particle.molecule_id ?? particle.moleculeId ?? null;
    if (moleculeId) {
      this.selectedMoleculeId = moleculeId;
      this.imageViewer.setSelectedMolecule(moleculeId);
    }
    this.imageViewer.setHoveredParticle(particle.particle_id ?? particle.particleId ?? null, particle.source_index ?? particle.sourceIndex ?? 0);
    this.imageViewer.focusBox(this.boxFromEntity(particle), { minZoom: 1.1, maxZoom: 3.2, padding: 120 });
    this.renderClusterDebugPanel();
    this.showToast(`Particula ${particle.particle_id ?? particle.particleId} localizada`, 'success');
  }

  atomBounds(atom) {
    return {
      x: Number(atom.bounds_x ?? atom.boundsX ?? 0),
      y: Number(atom.bounds_y ?? atom.boundsY ?? 0),
      w: Number(atom.bounds_w ?? atom.boundsW ?? 0),
      h: Number(atom.bounds_h ?? atom.boundsH ?? 0),
    };
  }

  boxFromEntity(entity) {
    return {
      x: Number(entity.bounds_x ?? entity.boundsX ?? 0),
      y: Number(entity.bounds_y ?? entity.boundsY ?? 0),
      w: Number(entity.bounds_w ?? entity.boundsW ?? 0),
      h: Number(entity.bounds_h ?? entity.boundsH ?? 0),
    };
  }

  renderClusterDebugPanel(options = {}) {
    const packet = this.atomPagePacket || {};
    const lightweight = Boolean(options.lightweight);
    const explanation = packet.cluster_explanation || packet.clusterExplanation || {};
    const links = explanation.links || [];
    const particleLinks = links.filter((link) => (link.stage || '') === 'particle' && link.accepted);
    const centers = (explanation.gap_centers || explanation.gapCenters || [])
      .map((value) => this.formatMetric(value))
      .join(' / ');
    const moleculeGaps = explanation.molecule_gaps || explanation.moleculeGaps || [];
    const particleRows = explanation.particle_rows || explanation.particleRows || [];
    const moleculeAudits = packet.molecule_audits || packet.moleculeAudits || [];
    const suspiciousMolecules = moleculeAudits.filter((molecule) => {
      const particles = molecule.particles || [];
      return Number(molecule.particle_count ?? molecule.particleCount ?? particles.length) === 1;
    });

    this.annotationPanel.setClusterDebugHtml(`
      <section class="cluster-debug-panel">
        <div class="cluster-debug__summary">
          ${this.renderClusterMetric('Atomos', (packet.atoms || []).length)}
          ${this.renderClusterMetric('Particulas', (packet.particles || []).length)}
          ${this.renderClusterMetric('Moleculas', (packet.molecules || []).length)}
          ${this.renderClusterMetric('Revisar', suspiciousMolecules.length)}
          ${this.renderClusterMetric('Contactos', particleLinks.length)}
          ${this.renderClusterMetric('Micro gap', this.formatMetric(explanation.micro_threshold ?? explanation.microThreshold))}
          ${this.renderClusterMetric('Macro gap', this.formatMetric(explanation.macro_threshold ?? explanation.macroThreshold))}
        </div>
        <div class="cluster-debug__legend">
          <span class="cluster-debug__key"><i class="cluster-debug__line cluster-debug__line--particle"></i>particula</span>
          <span class="cluster-debug__key"><i class="cluster-debug__line cluster-debug__line--join"></i>une</span>
          <span class="cluster-debug__key"><i class="cluster-debug__line cluster-debug__line--cut"></i>corte</span>
        </div>
        <div class="cluster-debug__notes">
          <span>${particleLinks.length} contactos aceptados forman ${(packet.particles || []).length} particula${(packet.particles || []).length !== 1 ? 's' : ''}.</span>
          <span>${(packet.molecules || []).length} molecula${(packet.molecules || []).length !== 1 ? 's' : ''} por renglon y gap horizontal.</span>
          ${suspiciousMolecules.length ? `<span>${suspiciousMolecules.length} molecula${suspiciousMolecules.length !== 1 ? 's' : ''} de una sola particula: revisar posible corte sobrante.</span>` : ''}
          <span>Centros: ${this.escapeHtml(centers || '15 / 57 / 96')}.</span>
          <button class="cluster-debug__undo-btn" type="button" data-clear-latest-particle-merge>deshacer ultima fusion</button>
        </div>
        ${this.renderSelectedMoleculeAudit(moleculeAudits, packet, moleculeGaps, particleRows)}
        ${lightweight ? '<div class="cluster-debug__notes"><span>Edicion de molecula: auditoria global pausada hasta guardar.</span></div>' : ''}
        ${lightweight ? '' : this.renderRowBoundaryAudit(particleRows, moleculeGaps)}
        ${lightweight ? '' : this.renderMoleculeGapAudit(moleculeGaps)}
        ${lightweight ? '' : this.renderMoleculeAudit(moleculeAudits)}
      </section>
    `);
    this.attachClusterDebugEvents();
  }

  attachClusterDebugEvents() {
    document.querySelectorAll('[data-select-molecule]').forEach((button) => {
      button.addEventListener('click', () => {
        const nextMoleculeId = button.dataset.selectMolecule || null;
        if (this.moleculeEditMode && String(nextMoleculeId || '') !== String(this.selectedMoleculeId || '') && !this.canSwitchMoleculeDuringEdit()) {
          this.showToast('Guarda o descarta la edicion de molecula antes de cambiar de seleccion', 'warning');
          return;
        }
        this.selectedMoleculeId = nextMoleculeId;
        if (this.canSwitchMoleculeDuringEdit() && this.selectedMoleculeId) {
          this.moleculeEditMode = true;
          this.ensureMoleculeEditSnapshot(this.selectedMoleculeId);
        }
        this.imageViewer.setSelectedMolecule(this.selectedMoleculeId);
        this.renderClusterDebugPanel();
      });
    });

    document.querySelectorAll('[data-clear-latest-particle-merge]').forEach((button) => {
      button.addEventListener('click', async () => {
        if (!this.currentImage) return;
        try {
          const packet = await api.clearLatestParticleMergePattern(this.currentImage.id);
          this.applyAtomPagePacket(packet);
          this.showToast('Ultima fusion aprendida deshecha', 'success');
        } catch (err) {
          this.showToast(`No pude deshacer fusion: ${err}`, 'error');
        }
      });
    });

    document.querySelectorAll('[data-molecule-edit-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const action = button.dataset.moleculeEditAction || '';
        try {
          button.disabled = true;
          if (action === 'start') {
            this.startMoleculeEdit();
          } else if (action === 'save') {
            await this.flushPendingOrderDrafts();
          } else if (action === 'cancel') {
            this.discardMoleculeOrderDrafts();
          }
        } catch (err) {
          this.showToast(`No pude editar la molecula: ${err}`, 'error');
        } finally {
          button.disabled = false;
        }
      });
    });

    document.querySelectorAll('[data-atom-order-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const particleId = button.dataset.particleId || '';
        const atomId = Number(button.dataset.atomId || 0);
        const direction = button.dataset.atomOrderAction || '';
        if (!particleId || !atomId || !this.currentImage) return;
        try {
          button.disabled = true;
          await this.reorderParticleAtom(particleId, atomId, direction);
        } catch (err) {
          this.showToast(`No pude guardar el orden: ${err}`, 'error');
        } finally {
          button.disabled = false;
        }
      });
    });

    document.querySelectorAll('[data-particle-order-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const particleId = button.dataset.particleId || '';
        const direction = button.dataset.particleOrderAction || '';
        if (!particleId || !this.currentImage) return;
        try {
          button.disabled = true;
          await this.reorderMoleculeParticle(particleId, direction);
        } catch (err) {
          this.showToast(`No pude guardar el orden de particulas: ${err}`, 'error');
        } finally {
          button.disabled = false;
        }
      });
    });

    document.querySelectorAll('[data-particle-merge-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const particleId = button.dataset.particleId || '';
        const direction = button.dataset.particleMergeAction || '';
        if (!particleId || !this.currentImage) return;
        try {
          await this.learnParticleMerge(particleId, direction);
        } catch (err) {
          this.showToast(`No pude ensenar fusion de particulas: ${err}`, 'error');
        }
      });
    });

    document.querySelectorAll('[data-hover-particle-id]').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        this.imageViewer.setHoveredParticle(item.dataset.hoverParticleId || null, item.dataset.hoverParticleSourceIndex || 0);
      });
      item.addEventListener('mouseleave', () => {
        this.imageViewer.setHoveredParticle(null, 0);
      });
    });
  }

  async handleGapAction(button) {
    if (!this.currentImage || !button) return;
    if (!this.rowEditModeActive) return;
    const left = Number(button.dataset.leftParticleIndex || 0);
    const right = Number(button.dataset.rightParticleIndex || 0);
    const action = button.dataset.gapAction || '';
    if (!left || !right || !['cut', 'join', 'auto'].includes(action)) return;

    this.queueMoleculeGapEdit({ leftParticleIndex: left, rightParticleIndex: right }, action);
    this.showToast(
      action === 'auto'
        ? 'Correccion marcada para auto'
        : action === 'join' ? 'Corte marcado como union pendiente' : 'Union marcada como corte pendiente',
      'info'
    );
  }

  async handleCanvasGapAction(gap) {
    if (!this.currentImage || !gap) return;
    if (!this.rowEditModeActive) return;
    const left = Number(gap.leftParticleIndex || gap.left_particle_index || 0);
    const right = Number(gap.rightParticleIndex || gap.right_particle_index || 0);
    if (!left || !right) return;

    const action = gap.cut ? 'join' : 'cut';
    const hadPending = this.pendingMoleculeGapOverrides.has(this.moleculeGapKey(left, right));
    this.queueMoleculeGapEdit(gap, action);
    this.showToast(
      hadPending
        ? 'Correccion pendiente restaurada a auto'
        : action === 'join' ? 'Corte marcado como union pendiente' : 'Union marcada como corte pendiente',
      'info'
    );
  }

  async handleParticleRowAction(button) {
    if (!this.currentImage || !button) return;
    if (!this.canSwitchMoleculeDuringEdit()) return;
    const sourceIndex = Number(button.dataset.particleSourceIndex || 0);
    const rowIndex = Number(button.dataset.rowIndex || 0);
    const action = button.dataset.particleRowAction || '';
    if (!sourceIndex || !rowIndex || !['up', 'down', 'auto'].includes(action)) return;

    const targetRow = action === 'auto' ? null : action === 'up' ? rowIndex - 1 : rowIndex + 1;
    this.queueParticleRowOverrideEdit(sourceIndex, targetRow);
    this.showToast(
      action === 'auto'
        ? 'Particula marcada para renglon automatico'
        : `Particula marcada para R${targetRow}`,
      'info'
    );
  }

  async reorderParticleAtom(particleId, atomId, direction) {
    if (!this.moleculeEditMode) return;
    const molecule = this.selectedMoleculeAudit();
    const particle = (molecule?.particles || []).find((item) => String(item.particle_id ?? item.particleId) === String(particleId));
    if (!particle) return;

    const atomIds = (particle.atoms || []).map((atom) => Number(atom.atom_id ?? atom.atomId ?? 0)).filter(Boolean);
    const index = atomIds.indexOf(Number(atomId));
    const target = this.orderTargetIndex(atomIds.length, index, direction);
    if (index < 0 || target < 0 || target >= atomIds.length || target === index) return;

    const nextAtomIds = atomIds.slice();
    const [moved] = nextAtomIds.splice(index, 1);
    nextAtomIds.splice(target, 0, moved);
    this.applyLocalParticleAtomOrder(particleId, nextAtomIds);
    this.pendingParticleAtomOrders.set(String(particleId), nextAtomIds);
    this.markOrderDraftChanged();
  }

  async reorderMoleculeParticle(particleId, direction) {
    if (!this.moleculeEditMode) return;
    const molecule = this.selectedMoleculeAudit();
    if (!molecule) return;

    const particles = molecule.particles || [];
    const particleIds = particles
      .map((particle) => String(particle.particle_id ?? particle.particleId ?? ''))
      .filter(Boolean);
    const index = particleIds.indexOf(String(particleId));
    const target = this.particleOrderTargetIndex(particles, index, direction);
    if (index < 0 || target < 0 || target >= particleIds.length || target === index) return;

    const nextParticleIds = particleIds.slice();
    const [moved] = nextParticleIds.splice(index, 1);
    nextParticleIds.splice(target, 0, moved);
    const moleculeId = molecule.molecule_id ?? molecule.moleculeId;
    this.applyLocalMoleculeParticleOrder(moleculeId, nextParticleIds);
    this.pendingMoleculeParticleOrders.set(String(moleculeId), nextParticleIds);
    this.markOrderDraftChanged();
  }

  applyLocalParticleAtomOrder(particleId, nextAtomIds) {
    const molecule = this.selectedMoleculeAudit();
    const particle = (molecule?.particles || []).find((item) => String(item.particle_id ?? item.particleId) === String(particleId));
    if (!particle) return;
    const order = new Map(nextAtomIds.map((atomId, index) => [Number(atomId), index]));
    particle.atoms = (particle.atoms || [])
      .slice()
      .sort((a, b) => {
        const aId = Number(a.atom_id ?? a.atomId ?? 0);
        const bId = Number(b.atom_id ?? b.atomId ?? 0);
        return (order.get(aId) ?? Number.MAX_SAFE_INTEGER) - (order.get(bId) ?? Number.MAX_SAFE_INTEGER);
      })
      .map((atom, index) => ({
        ...atom,
        atom_order: index + 1,
        atomOrder: index + 1,
    }));
    particle.signature = this.particleSignatureFromAtoms(particle.atoms);
  }

  applyLocalMoleculeParticleOrder(moleculeId, nextParticleIds) {
    const molecule = this.selectedMoleculeAudit();
    if (!molecule || String(molecule.molecule_id ?? molecule.moleculeId) !== String(moleculeId)) return;
    const order = new Map(nextParticleIds.map((particleId, index) => [String(particleId), index]));
    molecule.particles = (molecule.particles || [])
      .slice()
      .sort((a, b) => {
        const aId = String(a.particle_id ?? a.particleId ?? '');
        const bId = String(b.particle_id ?? b.particleId ?? '');
        return (order.get(aId) ?? Number.MAX_SAFE_INTEGER) - (order.get(bId) ?? Number.MAX_SAFE_INTEGER);
      })
      .map((particle, index) => ({
        ...particle,
        particle_order: index + 1,
        particleOrder: index + 1,
        slot: this.particleSlot(index, nextParticleIds.length),
    }));
    molecule.signature = molecule.particles.map((particle) => particle.signature || '').filter(Boolean).join(' | ');
  }

  markOrderDraftChanged() {
    this.updateEditControls();
    this.renderClusterDebugPanel({ lightweight: true });
  }

  startMoleculeEdit() {
    const molecule = this.selectedMoleculeAudit();
    if (!molecule || this.moleculeEditMode) return;
    if (!this.editModeActive) {
      this.toggleEditMode(true);
    }
    this.setEditTool('molecule', { silent: true });
    this.moleculeEditMode = true;
    this.ensureMoleculeEditSnapshot(molecule.molecule_id ?? molecule.moleculeId);
    this.updateEditControls();
    this.renderClusterDebugPanel({ lightweight: true });
  }

  canSwitchMoleculeDuringEdit() {
    return this.editModeActive && this.editTool === 'molecule';
  }

  ensureMoleculeEditSnapshot(moleculeId) {
    const key = String(moleculeId || '');
    if (!key || this.moleculeEditSnapshots.has(key)) return;
    const packet = this.atomPagePacket || {};
    const audits = packet.molecule_audits || packet.moleculeAudits || [];
    const molecule = audits.find((item) => String(item.molecule_id ?? item.moleculeId) === key);
    if (!molecule) return;
    const snapshot = this.cloneOrderDraftValue(molecule);
    this.moleculeEditSnapshots.set(key, snapshot);
    if (!this.moleculeEditSnapshot || String(moleculeId || '') === String(this.selectedMoleculeId || '')) {
      this.moleculeEditSnapshot = snapshot;
    }
  }

  discardMoleculeOrderDrafts(options = {}) {
    const { render = true } = options;
    this.pendingParticleAtomOrders.clear();
    this.pendingMoleculeParticleOrders.clear();

    if (this.atomPagePacket && this.moleculeEditSnapshots.size) {
      const audits = this.atomPagePacket.molecule_audits || this.atomPagePacket.moleculeAudits || [];
      for (const [moleculeId, snapshot] of this.moleculeEditSnapshots.entries()) {
        const index = audits.findIndex((item) => String(item.molecule_id ?? item.moleculeId) === String(moleculeId));
        if (index >= 0) {
          audits[index] = this.cloneOrderDraftValue(snapshot);
        }
      }
    } else if (this.moleculeEditSnapshot && this.atomPagePacket) {
      const audits = this.atomPagePacket.molecule_audits || this.atomPagePacket.moleculeAudits || [];
      const index = audits.findIndex((item) => String(item.molecule_id ?? item.moleculeId) === String(this.selectedMoleculeId));
      if (index >= 0) audits[index] = this.cloneOrderDraftValue(this.moleculeEditSnapshot);
    }

    this.moleculeEditMode = false;
    this.moleculeEditSnapshot = null;
    this.moleculeEditSnapshots.clear();
    this.updateEditControls();
    if (render) this.renderClusterDebugPanel();
  }

  cloneOrderDraftValue(value) {
    return value ? JSON.parse(JSON.stringify(value)) : value;
  }

  async flushPendingOrderDrafts() {
    if (!this.currentImage || this.orderDraftSaving) return;
    if (!this.pendingParticleAtomOrders.size && !this.pendingMoleculeParticleOrders.size) {
      this.moleculeEditMode = false;
      this.moleculeEditSnapshot = null;
      this.renderClusterDebugPanel();
      return;
    }

    const particleAtomOrders = [...this.pendingParticleAtomOrders.entries()];
    const moleculeParticleOrders = [...this.pendingMoleculeParticleOrders.entries()];
    this.pendingParticleAtomOrders.clear();
    this.pendingMoleculeParticleOrders.clear();
    this.orderDraftSaving = true;
    this.renderClusterDebugPanel({ lightweight: true });

    try {
      const latestPacket = await api.setOrderDraftsBatch(
        this.currentImage.id,
        particleAtomOrders.map(([particleId, atomIds]) => ({ particleId, atomIds })),
        moleculeParticleOrders.map(([moleculeId, particleIds]) => ({ moleculeId, particleIds })),
      );
      if (latestPacket) {
        this.applyAtomPagePacket(latestPacket, { clearOrderDrafts: true });
        this.moleculeEditSnapshots.clear();
        this.showToast(this.editModeActive ? 'Orden guardado' : 'Orden aprendido', 'success');
      } else {
        this.moleculeEditMode = false;
        this.moleculeEditSnapshot = null;
        this.moleculeEditSnapshots.clear();
      }
    } catch (err) {
      for (const [particleId, atomIds] of particleAtomOrders) {
        this.pendingParticleAtomOrders.set(particleId, atomIds);
      }
      for (const [moleculeId, particleIds] of moleculeParticleOrders) {
        this.pendingMoleculeParticleOrders.set(moleculeId, particleIds);
      }
      throw err;
    } finally {
      this.orderDraftSaving = false;
      this.updateEditControls();
      this.renderClusterDebugPanel({ lightweight: this.hasPendingOrderDrafts() });
    }
  }

  hasPendingOrderDrafts() {
    return this.pendingParticleAtomOrders.size > 0 || this.pendingMoleculeParticleOrders.size > 0 || this.orderDraftSaving;
  }

  particleSignatureFromAtoms(atoms = []) {
    return atoms.map((atom) => {
      const family = atom.family || '?';
      const config = atom.structural_config ?? atom.structuralConfig ?? '';
      return config ? `${family}:${config}` : family;
    }).join(' ');
  }

  particleSlot(index, count) {
    if (count <= 1) return 'singleton';
    if (index <= 0) return 'initial';
    if (index >= count - 1) return 'final';
    return 'medial';
  }

  orderTargetIndex(length, index, direction) {
    if (index < 0) return index;
    if (direction === 'first') return 0;
    if (direction === 'last') return length - 1;
    if (direction === 'up') return index - 1;
    if (direction === 'down') return index + 1;
    return index;
  }

  particleOrderTargetIndex(particles = [], index = -1, direction = '') {
    if (index < 0) return index;
    if (direction === 'first') return 0;
    if (direction === 'last') return particles.length - 1;
    const step = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
    if (!step) return index;
    const currentSignature = this.particleOrderSignature(particles[index]);
    let target = index + step;
    while (
      target >= 0
      && target < particles.length
      && this.particleOrderSignature(particles[target]) === currentSignature
    ) {
      target += step;
    }
    return target;
  }

  particleOrderSignature(particle = {}) {
    return String(particle.signature_key ?? particle.signatureKey ?? particle.signature ?? '');
  }

  async learnParticleMerge(particleId, direction) {
    const molecule = this.selectedMoleculeAudit();
    const particles = molecule?.particles || [];
    const particleIds = particles
      .map((particle) => String(particle.particle_id ?? particle.particleId ?? ''))
      .filter(Boolean);
    const index = particleIds.indexOf(String(particleId));
    const target = direction === 'previous' ? index - 1 : direction === 'next' ? index + 1 : index;
    if (index < 0 || target < 0 || target >= particleIds.length || target === index) return;

    const packet = await api.setParticleMergePattern(
      this.currentImage.id,
      particleIds[index],
      particleIds[target],
    );
    this.applyAtomPagePacket(packet);
    this.showToast('Excepcion de particula aprendida', 'success');
  }

  selectedMoleculeAudit() {
    const packet = this.atomPagePacket || {};
    const audits = packet.molecule_audits || packet.moleculeAudits || [];
    return audits.find((item) => String(item.molecule_id ?? item.moleculeId) === String(this.selectedMoleculeId));
  }

  renderMoleculeGapAudit(gaps = []) {
    if (!gaps.length) {
      return '';
    }
    return `
      <div class="gap-audit">
        ${gaps.map((gap) => this.renderMoleculeGapAuditItem(gap)).join('')}
      </div>
    `;
  }

  renderMoleculeGapAuditItem(gap) {
    const cut = Boolean(gap.cut);
    const row = Number(gap.row_index ?? gap.rowIndex ?? 0);
    const left = Number(gap.left_particle_index ?? gap.leftParticleIndex ?? 0);
    const right = Number(gap.right_particle_index ?? gap.rightParticleIndex ?? 0);
    const gapValue = this.formatMetric(gap.gap);
    const threshold = this.formatMetric(gap.threshold);
    const reason = gap.reason || (cut ? 'corte' : 'une');
    const override = gap.override_decision ?? gap.overrideDecision ?? '';
    const showActions = this.rowEditModeActive;
    return `
      <div class="gap-audit__item gap-audit__item--${cut ? 'cut' : 'join'} ${override ? 'gap-audit__item--manual' : ''}">
        <span class="gap-audit__decision">${cut ? 'corte' : 'une'}</span>
        <code>R${row} P${left}->P${right}</code>
        <span>${gapValue}/${threshold}</span>
        <small>${this.escapeHtml(reason)}${override ? ' · manual' : ''}</small>
        ${showActions ? `<div class="gap-audit__actions">
          <button class="gap-audit__btn" type="button" data-gap-action="cut" data-left-particle-index="${left}" data-right-particle-index="${right}">cortar</button>
          <button class="gap-audit__btn" type="button" data-gap-action="join" data-left-particle-index="${left}" data-right-particle-index="${right}">unir</button>
          <button class="gap-audit__btn" type="button" data-gap-action="auto" data-left-particle-index="${left}" data-right-particle-index="${right}">auto</button>
        </div>` : ''}
      </div>
    `;
  }

  renderSelectedMoleculeAudit(audits = [], packet = {}, gaps = [], particleRows = []) {
    if (!this.selectedMoleculeId) return '';
    const molecule = audits.find((item) => String(item.molecule_id ?? item.moleculeId) === String(this.selectedMoleculeId));
    if (!molecule) return '';
    const particles = molecule.particles || [];
    const isSuspicious = Number(molecule.particle_count ?? molecule.particleCount ?? particles.length) === 1;
    const fixGaps = isSuspicious ? this.suspiciousMoleculeGapCandidates(molecule, packet, gaps) : [];
    const rowInfo = isSuspicious ? this.selectedMoleculeRowInfo(molecule, packet, particleRows) : null;
    const editStatus = this.orderDraftSaving ? 'guardando...' : this.hasPendingOrderDrafts() ? 'cambios sin guardar' : 'editando';
    return `
      <section class="molecule-detail ${isSuspicious ? 'molecule-detail--warning' : ''}">
        <div class="molecule-detail__head">
          <strong>${this.escapeHtml(this.selectedMoleculeId)}</strong>
          <span>${Number(molecule.particle_count ?? molecule.particleCount ?? particles.length)} particulas / ${Number(molecule.atom_count ?? molecule.atomCount ?? 0)} atomos</span>
          ${this.canSwitchMoleculeDuringEdit() ? `<small>${editStatus}</small>` : ''}
        </div>
        ${isSuspicious ? '<div class="molecule-detail__warning">Revisar: molecula de una sola particula.</div>' : ''}
        ${fixGaps.length ? this.renderSuspiciousMoleculeFixes(fixGaps) : ''}
        ${isSuspicious && !fixGaps.length ? '<div class="molecule-detail__warning">Sin gap exacto para corregir: revisar asignacion de renglon.</div>' : ''}
        ${rowInfo ? this.renderSelectedMoleculeRowInfo(rowInfo) : ''}
        <code class="molecule-detail__signature">${this.escapeHtml(molecule.signature || '')}</code>
        <div class="molecule-detail__particles">
          ${particles.map((particle, index) => this.renderParticleDetailItem(particle, index, particles.length)).join('')}
        </div>
      </section>
    `;
  }

  suspiciousMoleculeGapCandidates(molecule, packet = {}, gaps = []) {
    const moleculeId = molecule.molecule_id ?? molecule.moleculeId;
    const singleton = (packet.particles || []).find((particle) => (
      String(particle.molecule_id ?? particle.moleculeId) === String(moleculeId)
    ));
    if (!singleton) return [];

    const x = Number(singleton.bounds_x ?? singleton.boundsX ?? 0);
    const sourceIndex = Number(singleton.source_index ?? singleton.sourceIndex ?? 0);
    if (!sourceIndex) return [];

    let previous = (gaps || []).find((gap) => Number(gap.right_particle_index ?? gap.rightParticleIndex ?? 0) === sourceIndex);
    let next = (gaps || []).find((gap) => Number(gap.left_particle_index ?? gap.leftParticleIndex ?? 0) === sourceIndex);
    if (previous) previous = { ...previous, side: 'molecula anterior', exact: true };
    if (next) next = { ...next, side: 'molecula siguiente', exact: true };

    return [previous, next].filter(Boolean);
  }

  selectedMoleculeRowInfo(molecule, packet = {}, particleRows = []) {
    const moleculeId = molecule.molecule_id ?? molecule.moleculeId;
    const singleton = (packet.particles || []).find((particle) => (
      String(particle.molecule_id ?? particle.moleculeId) === String(moleculeId)
    ));
    const sourceIndex = Number(singleton?.source_index ?? singleton?.sourceIndex ?? 0);
    if (!sourceIndex) return null;
    for (const row of particleRows || []) {
      const match = (row.particles || []).find((particle) => Number(particle.source_index ?? particle.sourceIndex ?? 0) === sourceIndex);
      if (match) {
        return {
          rowIndex: Number(row.row_index ?? row.rowIndex ?? 0),
          baselineY: Number(row.baseline_y ?? row.baselineY ?? 0),
          sourceIndex,
          particleY: Number(match.y ?? 0),
          particleBottomY: Number(match.bottom_y ?? match.bottomY ?? (Number(match.y ?? 0) + Number(match.h ?? 0))),
          particleBodyY: Number(match.body_y ?? match.bodyY ?? match.baseline_y ?? match.baselineY ?? 0),
          particleHeight: Number(match.h ?? 0),
        };
      }
    }
    return null;
  }

  particleRowInfoForSource(sourceIndex) {
    const packet = this.atomPagePacket || {};
    const explanation = packet.cluster_explanation || packet.clusterExplanation || {};
    const particleRows = explanation.particle_rows || explanation.particleRows || [];
    const rowCount = particleRows.length;
    const pendingRow = this.pendingParticleRowOverrides.get(String(sourceIndex));
    for (const row of particleRows || []) {
      const match = (row.particles || []).find((particle) => Number(particle.source_index ?? particle.sourceIndex ?? 0) === sourceIndex);
      if (match) {
        const baseRowIndex = Number(row.row_index ?? row.rowIndex ?? 0);
        const displayRowIndex = pendingRow && pendingRow.rowIndex !== null ? Number(pendingRow.rowIndex) : baseRowIndex;
        return {
          rowIndex: displayRowIndex,
          rowCount,
          rowOverride: pendingRow ? pendingRow.rowIndex : match.row_override ?? match.rowOverride ?? null,
        };
      }
    }
    return { rowIndex: 0, rowCount, rowOverride: null };
  }

  renderParticleRowControls(sourceIndex, rowInfo) {
    if (!this.canSwitchMoleculeDuringEdit()) return '';
    if (!sourceIndex || !rowInfo?.rowIndex) return '';
    const rowIndex = Number(rowInfo.rowIndex || 0);
    const rowCount = Number(rowInfo.rowCount || 0);
    const hasOverride = rowInfo.rowOverride !== null && rowInfo.rowOverride !== undefined;
    return `
      <span class="particle-detail__row-controls">
        <span>R${rowIndex}${hasOverride ? ' manual' : ''}</span>
        <button class="particle-detail__move-btn" type="button" data-particle-row-action="up" data-particle-source-index="${sourceIndex}" data-row-index="${rowIndex}" ${rowIndex <= 1 ? 'disabled' : ''}>part. arriba</button>
        <button class="particle-detail__move-btn" type="button" data-particle-row-action="down" data-particle-source-index="${sourceIndex}" data-row-index="${rowIndex}" ${rowCount && rowIndex >= rowCount ? 'disabled' : ''}>part. abajo</button>
        <button class="particle-detail__move-btn" type="button" data-particle-row-action="auto" data-particle-source-index="${sourceIndex}" data-row-index="${rowIndex}" ${!hasOverride ? 'disabled' : ''}>part. auto</button>
      </span>
    `;
  }

  renderSelectedMoleculeRowInfo(rowInfo) {
    return `
      <div class="molecule-detail__row">
        <span>R${rowInfo.rowIndex} · P${rowInfo.sourceIndex}</span>
        <span>row ${this.formatMetric(rowInfo.baselineY)} · anchor ${this.formatMetric(rowInfo.particleBodyY)}</span>
        <span>y ${this.formatMetric(rowInfo.particleY)} · bottom ${this.formatMetric(rowInfo.particleBottomY)} · h ${this.formatMetric(rowInfo.particleHeight)}</span>
      </div>
    `;
  }

  renderRowBoundaryAudit(particleRows = [], gaps = []) {
    if (!particleRows.length) return '';
    const rows = new Map();
    for (const row of particleRows) {
      rows.set(Number(row.row_index ?? row.rowIndex ?? 0), row);
    }
    const gapByPair = new Map((gaps || []).map((gap) => [
      `${Number(gap.left_particle_index ?? gap.leftParticleIndex ?? 0)}:${Number(gap.right_particle_index ?? gap.rightParticleIndex ?? 0)}`,
      gap,
    ]));

    return `
      <div class="row-audit">
        ${Array.from(rows.entries()).sort((a, b) => a[0] - b[0]).map(([row, rowAudit]) => {
          const ordered = (rowAudit.particles || []).slice().sort((a, b) => Number(a.x ?? 0) - Number(b.x ?? 0));
          const tokens = [];
          for (let index = 0; index < ordered.length; index += 1) {
            const current = ordered[index];
            tokens.push(`P${Number(current.source_index ?? current.sourceIndex ?? 0)}`);
            const next = ordered[index + 1];
            if (!next) continue;
            const key = `${Number(current.source_index ?? current.sourceIndex ?? 0)}:${Number(next.source_index ?? next.sourceIndex ?? 0)}`;
            const gap = gapByPair.get(key);
            if (!gap) {
              tokens.push('<span class="row-audit__boundary row-audit__boundary--missing">sin gap</span>');
              continue;
            }
            const cut = Boolean(gap.cut);
            const override = gap.override_decision ?? gap.overrideDecision ?? '';
            tokens.push(`<span class="row-audit__boundary row-audit__boundary--${cut ? 'cut' : 'join'} ${override ? 'row-audit__boundary--manual' : ''}">${cut ? 'corte' : 'une'}</span>`);
          }
          return `
            <div class="row-audit__row">
              <strong>R${row} · baseline ${this.formatMetric(rowAudit.baseline_y ?? rowAudit.baselineY)}</strong>
              <small>techo ${this.formatMetric(rowAudit.top_y ?? rowAudit.topY)} · piso ${this.formatMetric(rowAudit.bottom_y ?? rowAudit.bottomY)}</small>
              <div class="row-audit__chain">${tokens.join(' ')}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderSuspiciousMoleculeFixes(gaps = []) {
    if (!this.rowEditModeActive) return '';
    return `
      <div class="molecule-detail__fixes">
        ${gaps.map((gap) => {
          const row = Number(gap.row_index ?? gap.rowIndex ?? 0);
          const left = Number(gap.left_particle_index ?? gap.leftParticleIndex ?? 0);
          const right = Number(gap.right_particle_index ?? gap.rightParticleIndex ?? 0);
          return `
            <div class="molecule-detail__fix">
              <span>Unir con ${this.escapeHtml(gap.side)}: R${row} P${left}->P${right}</span>
              <button class="gap-audit__btn" type="button" data-gap-action="join" data-left-particle-index="${left}" data-right-particle-index="${right}">unir</button>
              <button class="gap-audit__btn" type="button" data-gap-action="auto" data-left-particle-index="${left}" data-right-particle-index="${right}">auto</button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderParticleDetailItem(particle, particleIndex = 0, particleCount = 0) {
    const atoms = particle.atoms || [];
    const particleId = particle.particle_id ?? particle.particleId ?? '';
    const sourceIndex = Number(particle.source_index ?? particle.sourceIndex ?? 0);
    const bounds = {
      x: Number(particle.bounds_x ?? particle.boundsX ?? 0),
      y: Number(particle.bounds_y ?? particle.boundsY ?? 0),
      w: Number(particle.bounds_w ?? particle.boundsW ?? 0),
      h: Number(particle.bounds_h ?? particle.boundsH ?? 0),
    };
    const centroid = {
      x: Number(particle.centroid_x ?? particle.centroidX ?? 0),
      y: Number(particle.centroid_y ?? particle.centroidY ?? 0),
    };
    const contactCount = Number(particle.internal_contact_count ?? particle.internalContactCount ?? 0);
    const rowInfo = this.particleRowInfoForSource(sourceIndex);
    const showOrderControls = this.canSwitchMoleculeDuringEdit();
    const orderDisabled = !showOrderControls || this.orderDraftSaving;
    return `
      <section class="particle-detail" data-hover-particle-id="${this.escapeHtml(particleId)}" data-hover-particle-source-index="${sourceIndex}">
        <div class="particle-detail__head">
          <span>${this.escapeHtml(particle.slot || '?')} #${Number(particle.particle_order ?? particle.particleOrder ?? 0)} / P${Number(particle.source_index ?? particle.sourceIndex ?? 0)}</span>
          ${showOrderControls ? `<span class="particle-detail__order-controls">
            <button class="particle-detail__move-btn" type="button" data-particle-order-action="first" data-particle-id="${this.escapeHtml(particleId)}" ${orderDisabled || particleIndex === 0 ? 'disabled' : ''}>inicio</button>
            <button class="particle-detail__move-btn" type="button" data-particle-order-action="up" data-particle-id="${this.escapeHtml(particleId)}" ${orderDisabled || particleIndex === 0 ? 'disabled' : ''}>subir</button>
            <button class="particle-detail__move-btn" type="button" data-particle-order-action="down" data-particle-id="${this.escapeHtml(particleId)}" ${orderDisabled || particleIndex >= particleCount - 1 ? 'disabled' : ''}>bajar</button>
            <button class="particle-detail__move-btn" type="button" data-particle-order-action="last" data-particle-id="${this.escapeHtml(particleId)}" ${orderDisabled || particleIndex >= particleCount - 1 ? 'disabled' : ''}>final</button>
            <button class="particle-detail__move-btn particle-detail__move-btn--merge" type="button" data-particle-merge-action="previous" data-particle-id="${this.escapeHtml(particleId)}" ${particleIndex === 0 ? 'disabled' : ''}>fusionar ant.</button>
            <button class="particle-detail__move-btn particle-detail__move-btn--merge" type="button" data-particle-merge-action="next" data-particle-id="${this.escapeHtml(particleId)}" ${particleIndex >= particleCount - 1 ? 'disabled' : ''}>fusionar sig.</button>
          </span>` : ''}
          ${this.renderParticleRowControls(sourceIndex, rowInfo)}
          <code>${this.escapeHtml(particle.signature || '?')}</code>
        </div>
        <div class="particle-detail__metrics">
          <span>id <code>${this.escapeHtml(particleId)}</code></span>
          <span>firma <code>${this.escapeHtml(particle.signature_key ?? particle.signatureKey ?? particle.signature ?? '?')}</code></span>
          <span>${atoms.length} atomos</span>
          <span>${contactCount} contactos internos</span>
          <span>box ${this.formatMetric(bounds.x)},${this.formatMetric(bounds.y)} ${this.formatMetric(bounds.w)}x${this.formatMetric(bounds.h)}</span>
          <span>centro ${this.formatMetric(centroid.x)},${this.formatMetric(centroid.y)}</span>
        </div>
        <div class="particle-detail__atoms">
          ${atoms.map((atom, index) => `
            <span class="particle-detail__atom">
              ${showOrderControls ? `
                <button class="particle-detail__atom-btn" type="button" data-atom-order-action="first" data-particle-id="${this.escapeHtml(particleId)}" data-atom-id="${Number(atom.atom_id ?? atom.atomId ?? 0)}" ${orderDisabled || index === 0 ? 'disabled' : ''}>inicio</button>
                <button class="particle-detail__atom-btn" type="button" data-atom-order-action="up" data-particle-id="${this.escapeHtml(particleId)}" data-atom-id="${Number(atom.atom_id ?? atom.atomId ?? 0)}" ${orderDisabled || index === 0 ? 'disabled' : ''}>subir</button>
                <button class="particle-detail__atom-btn" type="button" data-atom-order-action="down" data-particle-id="${this.escapeHtml(particleId)}" data-atom-id="${Number(atom.atom_id ?? atom.atomId ?? 0)}" ${orderDisabled || index === atoms.length - 1 ? 'disabled' : ''}>bajar</button>
                <button class="particle-detail__atom-btn" type="button" data-atom-order-action="last" data-particle-id="${this.escapeHtml(particleId)}" data-atom-id="${Number(atom.atom_id ?? atom.atomId ?? 0)}" ${orderDisabled || index === atoms.length - 1 ? 'disabled' : ''}>final</button>
              ` : ''}
              <code>${Number(atom.atom_order ?? atom.atomOrder ?? 0)}:${this.escapeHtml(atom.family || '?')}${atom.structural_config || atom.structuralConfig ? `:${this.escapeHtml(atom.structural_config ?? atom.structuralConfig)}` : ''}</code>
              <small>#${Number(atom.atom_id ?? atom.atomId ?? 0)} a:${this.formatMetric(atom.anchor_x ?? atom.anchorX)},${this.formatMetric(atom.anchor_y ?? atom.anchorY)} box:${this.formatMetric(atom.bounds_x ?? atom.boundsX)},${this.formatMetric(atom.bounds_y ?? atom.boundsY)} ${this.formatMetric(atom.bounds_w ?? atom.boundsW)}x${this.formatMetric(atom.bounds_h ?? atom.boundsH)} ang:${this.formatMetric(atom.angle)}</small>
            </span>
          `).join('')}
        </div>
      </section>
    `;
  }

  renderMoleculeAudit(audits = []) {
    if (!audits.length) {
      return '';
    }
    return `
      <div class="molecule-audit">
        ${audits.map((molecule, index) => this.renderMoleculeAuditItem(molecule, index)).join('')}
      </div>
    `;
  }

  renderMoleculeAuditItem(molecule, index) {
    const particles = molecule.particles || [];
    const isSuspicious = Number(molecule.particle_count ?? molecule.particleCount ?? particles.length) === 1;
    return `
      <section class="molecule-audit__item ${isSuspicious ? 'molecule-audit__item--warning' : ''}">
        <div class="molecule-audit__head">
          <button class="molecule-audit__select" type="button" data-select-molecule="${this.escapeHtml(molecule.molecule_id ?? molecule.moleculeId ?? '')}">M${index + 1}</button>
          <span>${isSuspicious ? 'revisar - ' : ''}${Number(molecule.particle_count ?? molecule.particleCount ?? particles.length)}p / ${Number(molecule.atom_count ?? molecule.atomCount ?? 0)}a</span>
        </div>
        <div class="molecule-audit__particles">
          ${particles.map((particle) => this.renderParticleAuditItem(particle)).join('')}
        </div>
      </section>
    `;
  }

  renderParticleAuditItem(particle) {
    const slot = particle.slot || '?';
    const signature = particle.signature || '?';
    const atomCount = Number(particle.atom_count ?? particle.atomCount ?? 0);
    return `
      <div class="molecule-audit__particle">
        <span class="molecule-audit__slot">${this.escapeHtml(slot)}</span>
        <code>${this.escapeHtml(signature)}</code>
        <span>${atomCount}a</span>
      </div>
    `;
  }

  renderClusterMetric(label, value) {
    return `
      <div class="cluster-debug__metric">
        <span>${this.escapeHtml(label)}</span>
        <strong>${this.escapeHtml(String(value ?? '0'))}</strong>
      </div>
    `;
  }

  formatMetric(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return '0';
    return number.toFixed(number >= 100 ? 0 : 1);
  }

  async setAutoLabel(regionId, labels, labelType, value) {
    const matches = labels.filter((label) => (label.label_type || label.labelType) === labelType);
    const existing = matches[0];
    if (existing) {
      if (existing.value !== value) await api.updateLabel(existing.id, { value });
      for (const duplicate of matches.slice(1)) {
        await api.deleteLabel(duplicate.id);
      }
      return;
    }
    await api.createLabel(regionId, labelType, value);
    labels.push({ label_type: labelType, value });
  }

  isComputedAtomLabel(label) {
    return [
      'visual_variant',
      'geometry_length',
      'geometry_angle',
      'geometry_points',
      'molecule_id',
      'molecule_size',
      'atom_order',
      'structural_config',
    ].includes(label.label_type || label.labelType);
  }

  atomColor(atomId) {
    const atom = this.atomLibrary.find((item) => String(item.id) === String(atomId));
    return this.atomDefinitionColor(atom) || '#64b4dc';
  }

  atomDefinitionColor(atom) {
    return this.regionColor(atom?.region);
  }

  regionColor(region) {
    const geometry = this.parseGeometry(region?.geometry_json || region?.geometryJson || '{}');
    return this.normalizeColor(geometry.color);
  }

  async updateRegionColor(regionId, color) {
    const region = this.regions.find((item) => Number(item.id) === Number(regionId)) || this.currentRegion;
    const geometry = this.parseGeometry(region?.geometry_json || region?.geometryJson || '{}');
    const nextGeometry = {
      ...geometry,
      color,
    };
    await api.updateRegion(regionId, {
      geometryJson: JSON.stringify(nextGeometry),
    });
    await this.loadRegions(this.currentImage.id);
  }

  normalizeColor(value) {
    const clean = String(value || '').trim().toLowerCase();
    return /^#[0-9a-f]{6}$/.test(clean) ? clean : '';
  }

  atomColorOwner(color) {
    const clean = this.normalizeColor(color);
    if (!clean) return null;
    const owner = this.atomLibrary.find((item) => this.atomDefinitionColor(item) === clean);
    return owner ? this.atomGroupKey(owner) : null;
  }

  selectActiveAtomPattern() {
    if (!this.activeAtomKey) return;
    const exact = this.atomForConfig(this.activeAtomKey, this.activeStructuralConfig);
    const fallback = this.atomForConfig(this.activeAtomKey, '1') || this.atomLibrary.find((item) => this.atomGroupKey(item) === this.activeAtomKey);
    const next = exact || fallback;
    if (!next) return;
    this.activeAtomId = next.id;
    this.annotationPanel.setActiveAtom(next.id);
    this.imageViewer.setDrawMode('stroke', { color: this.atomColor(next.id), forceDraw: true });
  }

  atomForConfig(atomKey, configKey) {
    return this.atomLibrary.find((item) => (
      this.atomGroupKey(item) === atomKey &&
      this.atomConfigKey(item) === String(configKey || '1')
    ));
  }

  updateAtomPreview() {
    if (!this.activeAtomId && !this.activeAtomKey) {
      this.imageViewer.setAtomPreview(null);
      return;
    }
    const atom = this.atomForConfig(this.activeAtomKey, this.activeStructuralConfig) ||
      this.atomLibrary.find((item) => String(item.id) === String(this.activeAtomId));
    if (!atom?.region) {
      this.imageViewer.setAtomPreview(null);
      return;
    }
    const geometry = this.parseGeometry(atom.region.geometry_json || atom.region.geometryJson || '{}');
    if (!Array.isArray(geometry.points) || geometry.points.length < 2) {
      this.imageViewer.setAtomPreview(null);
      return;
    }
    this.imageViewer.setAtomPreview({
      points: geometry.points,
      bounds: this.boundsFromGeometry(geometry),
      color: geometry.color || '#64b4dc',
      config: this.activeStructuralConfig,
      exact: this.atomConfigKey(atom) === String(this.activeStructuralConfig || '1'),
    });
  }

  classificationRadius(bounds) {
    const biggestSide = Math.max(Number(bounds.w || 0), Number(bounds.h || 0));
    return Math.max(8, Math.min(28, biggestSide * 0.45));
  }

  boundsDistance(a, b) {
    const ax2 = a.x + a.w;
    const ay2 = a.y + a.h;
    const bx2 = b.x + b.w;
    const by2 = b.y + b.h;
    const dx = Math.max(b.x - ax2, a.x - bx2, 0);
    const dy = Math.max(b.y - ay2, a.y - by2, 0);
    return Math.hypot(dx, dy);
  }

  labelValue(labels, types) {
    const label = labels.find((item) => types.includes(item.label_type || item.labelType || ''));
    return label?.value || '';
  }

  labelValueFromAtom(atom, types) {
    const labels = Array.isArray(atom?.labels) ? atom.labels : [];
    return String(this.labelValue(labels, types) || '').trim();
  }

  atomGroupKey(atom) {
    const explicit = String(atom?.atomKey || '').trim();
    if (explicit) return this.friendlyAtomKey(explicit);
    const family = this.labelValueFromAtom(atom, ['base_family']);
    const name = String(atom?.name || '').trim();
    return this.friendlyAtomKey(name || family || 'atomo');
  }

  atomVariantKeyFromLabels(labels) {
    return String(this.labelValue(labels, ['visual_variant']) || 'base').trim() || 'base';
  }

  atomConfigKey(atom) {
    const explicit = String(atom?.configKey || '').trim();
    if (explicit) return explicit;
    return this.labelValueFromAtom(atom, ['structural_config']) || '1';
  }

  atomConfigKeyFromLabels(labels) {
    return String(this.labelValue(labels, ['structural_config']) || '1').trim() || '1';
  }

  friendlyAtomKey(value) {
    const clean = String(value || '').trim();
    const normalized = clean.endsWith('_base') ? clean.slice(0, -5) : clean;
    return normalized.toLowerCase();
  }

  parseGeometry(value) {
    try {
      return typeof value === 'string' ? JSON.parse(value || '{}') : value || {};
    } catch {
      return {};
    }
  }

  regionBounds(region) {
    return this.boundsFromGeometry(this.parseGeometry(region.geometry_json || region.geometryJson || '{}'));
  }

  boundsFromGeometry(geometry) {
    if (Array.isArray(geometry.points) && geometry.points.length) {
      const xs = geometry.points.map((point) => Number(point.x || 0));
      const ys = geometry.points.map((point) => Number(point.y || 0));
      const x = Math.min(...xs);
      const y = Math.min(...ys);
      return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
    }
    return { x: 0, y: 0, w: 0, h: 0 };
  }

  safeFilePart(value) {
    return String(value || 'atom')
      .replace(/[^a-z0-9_-]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
  }

  updateZoomDisplay() {
    this.zoomLevelLabel.textContent = `${Math.round(this.imageViewer.getZoomLevel() * 100)}%`;
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<span class="toast__message">${this.escapeHtml(message)}</span><span class="toast__close">x</span>`;
    toast.querySelector('.toast__close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value || '');
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
