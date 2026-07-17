import api from './tauri-bridge.js';
import ImageList from './image-list.js';
import ImageViewer from './image-viewer.js';
import AnnotationPanel from './annotation-panel.js';

const ATOM_LIBRARY_KEY = 'datasetcreator.particleLibrary';

class App {
  constructor() {
    this.currentImage = null;
    this.currentRegion = null;
    this.images = [];
    this.regions = [];
    this.labels = [];
    this.particleCounts = {};
    this.particleLibrary = this.loadParticleLibrary();
    this.activeParticleId = null;
    this.activeParticleKey = null;
    this.activeStructuralConfig = '1';
    this.pendingNewParticleColor = null;
    this.pendingNewParticleRegionId = null;
    this.undoStack = [];
    this.redoStack = [];
    this.historyLimit = 80;
    this.annotationsVisible = true;
    this.showOnlyImagesWithParticles = false;
    this.particlePagePacket = null;
    this.selectedMoleculeId = null;
    this.moleculeRecalculateTimer = null;
    this.moleculeEditMode = false;
    this.moleculeEditSnapshot = null;
    this.moleculeEditSnapshots = new Map();
    this.pendingAtomParticleOrders = new Map();
    this.pendingMoleculeAtomOrders = new Map();
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
    this.atomRowOverrideSnapshot = new Map();
    this.pendingAtomRowOverrides = new Map();

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
    this.particleNameModal = document.getElementById('particle-name-modal');
    this.particleNameForm = document.getElementById('particle-name-form');
    this.particleNameInput = document.getElementById('particle-name-input');
    this.particleNameCancelBtn = document.getElementById('particle-name-cancel');
    this.particleNameCancelXBtn = document.getElementById('particle-name-cancel-x');
    this.pendingParticleNameResolver = null;

    this.init();
  }

  async init() {
    this.imageList = new ImageList(document.getElementById('image-list-container'));
    this.imageViewer = new ImageViewer(document.getElementById('main-canvas'));
    this.annotationPanel = new AnnotationPanel(document.getElementById('annotation-panel-body'));
    this.annotationPanel.setParticleLibrary(this.particleLibrary);

    this.setupCallbacks();
    this.setupUIEvents();
    this.updateAnnotationsVisibilityButton();
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
        await this.createParticleStroke(stroke);
      } catch (err) {
        this.showToast(`No pude crear la particula: ${err}`, 'error');
      }
    });

    this.imageViewer.onParticleStamped(async (stroke) => {
      if (!this.currentImage) return;
      try {
        if (this.paintModeActive) {
          this.queuePaintStroke(stroke);
          return;
        }
        await this.createParticleStroke(stroke);
      } catch (err) {
        this.showToast(`No pude estampar la particula: ${err}`, 'error');
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
        const packet = await api.adjustAtomRowGuide(this.currentImage.id, rowIndex, deltaY, edge);
        this.applyParticlePagePacket(packet);
      } catch (err) {
        this.showToast(`No pude ajustar renglon: ${err}`, 'error');
      }
    });

    this.imageViewer.onMoleculeGapAction(async (gap) => {
      await this.handleCanvasGapAction(gap);
    });

    this.annotationPanel.infoContainer.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-gap-action]');
      const rowButton = event.target.closest('[data-atom-row-action]');
      if (!button && !rowButton) return;
      event.preventDefault();
      if (button) {
        await this.handleGapAction(button);
      } else {
        await this.handleAtomRowAction(rowButton);
      }
    });

    this.imageViewer.onRegionChanged(async (regionId, geometry) => {
      try {
        const before = await this.snapshotRegion(regionId);
        await api.updateRegion(regionId, {
          geometryJson: JSON.stringify(geometry),
        });
        await this.autoClassifyCurrentImageVariants();
        await this.syncParticleEngine(regionId);
        const after = await this.snapshotRegion(regionId);
        this.pushHistory({ type: 'update', before, after });
        this.redoStack = [];
        await this.loadRegions(this.currentImage.id);
        await this.selectRegion(regionId);
        this.scheduleMoleculeRecalculate();
      } catch (err) {
        this.showToast(`No pude ajustar la particula: ${err}`, 'error');
      }
    });

    this.annotationPanel.onDrawParticleRequested(async (color) => {
      if (this.pendingNewParticleColor) {
        await this.cancelNewParticleCreation({ deletePendingRegion: Boolean(this.pendingNewParticleRegionId) });
        return;
      }
      this.startNewParticleCreation(color);
    });

    this.annotationPanel.onSaveParticleRequested(async () => {
      try {
        await this.saveSelectedParticleDefinition();
      } catch (err) {
        this.showToast(`No pude guardar la particula patron: ${err}`, 'error');
      }
    });

    this.annotationPanel.onParticlePicked(async (particleId) => {
      if (this.pendingNewParticleColor) {
        try {
          await this.cancelNewParticleCreation({ deletePendingRegion: Boolean(this.pendingNewParticleRegionId), silent: true });
        } catch (err) {
          this.showToast(`No pude cancelar la particula nueva: ${err}`, 'error');
          return;
        }
      }

      if (String(this.activeParticleId || '') === String(particleId || '')) {
        this.activeParticleId = null;
        this.activeParticleKey = null;
        this.pendingNewParticleColor = null;
        this.pendingNewParticleRegionId = null;
        this.annotationPanel.setActiveParticle(null);
        this.imageViewer.setParticlePreview(null);
        this.imageViewer.setDrawMode('select', { forceDraw: false });
        this.showToast('Particula desactivado', 'info');
        return;
      }

      this.activeParticleId = particleId;
      this.pendingNewParticleColor = null;
      this.pendingNewParticleRegionId = null;
      const particle = this.particleLibrary.find((item) => String(item.id) === String(particleId));
      this.activeParticleKey = this.particleGroupKey(particle);
      this.activeStructuralConfig = this.particleConfigKey(particle);
      this.annotationPanel.setActiveParticle(particleId);
      this.updateParticlePreview();
      this.imageViewer.setDrawMode('stroke', { color: this.particleColor(particleId), forceDraw: true });
      this.showToast('Particula activo: pinta su aparicion real', 'info');
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
      this.showOnlyImagesWithParticles = !this.showOnlyImagesWithParticles;
      this.sidebarFilterBtn.classList.toggle('sidebar__filter-btn--active', this.showOnlyImagesWithParticles);
      this.imageList.setShowOnlyWithParticles(this.showOnlyImagesWithParticles);
    });

    this.sidebarLabelsBtn?.addEventListener('click', () => {
      this.annotationsVisible = !this.annotationsVisible;
      this.imageViewer.setAnnotationsVisible(this.annotationsVisible);
      this.updateAnnotationsVisibilityButton();
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

    this.particleNameForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      this.resolveParticleNameModal(this.particleNameInput?.value || '');
    });

    this.particleNameCancelBtn?.addEventListener('click', () => this.resolveParticleNameModal(null));
    this.particleNameCancelXBtn?.addEventListener('click', () => this.resolveParticleNameModal(null));
    this.particleNameModal?.addEventListener('click', (event) => {
      if (event.target === this.particleNameModal) this.resolveParticleNameModal(null);
    });

    setInterval(() => {
      if (this.currentImage) this.updateZoomDisplay();
    }, 250);
  }

  setupShortcuts() {
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.pendingParticleNameResolver) {
          event.preventDefault();
          this.resolveParticleNameModal(null);
          return;
        }

        if (this.pendingNewParticleColor) {
          event.preventDefault();
          this.cancelNewParticleCreation({ deletePendingRegion: Boolean(this.pendingNewParticleRegionId) })
            .catch((err) => this.showToast(`No pude cancelar la particula nueva: ${err}`, 'error'));
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

        this.clearActiveParticleTool();
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

  startNewParticleCreation(color) {
    this.pendingNewParticleColor = this.normalizeColor(color);
    this.pendingNewParticleRegionId = null;
    this.activeParticleId = null;
    this.activeParticleKey = null;
    this.activeStructuralConfig = '1';
    this.annotationPanel.setActiveParticle(null);
    this.imageViewer.setParticlePreview(null);
    this.imageViewer.setDrawMode('stroke', { color, forceDraw: true });
    this.selectRegion(null);
    this.showToast('Dibuja la particula', 'info');
  }

  async cancelNewParticleCreation({ deletePendingRegion = false, silent = false } = {}) {
    const regionId = this.pendingNewParticleRegionId;
    this.pendingNewParticleColor = null;
    this.pendingNewParticleRegionId = null;
    this.clearActiveParticleTool();

    if (deletePendingRegion && regionId) {
      await api.deleteRegion(regionId);
      if (this.currentImage) {
        await this.loadRegions(this.currentImage.id);
      }
      await this.selectRegion(null);
      this.scheduleMoleculeRecalculate();
    }

    if (!silent) {
      this.showToast('Creacion de particula cancelada', 'info');
    }
  }

  clearActiveParticleTool() {
    this.activeParticleId = null;
    this.activeParticleKey = null;
    this.activeStructuralConfig = '1';
    this.annotationPanel.setActiveParticle(null);
    this.imageViewer.setParticlePreview(null);
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
      this.rowEditSnapshot = this.imageViewer?.getAtomRowGuides() || [];
    }

    if (this.paintModeActive) {
      this.updateParticlePreview();
      if (this.activeParticleId) {
        this.imageViewer?.setDrawMode('stroke', { color: this.particleColor(this.activeParticleId), forceDraw: true });
      }
    } else if (!this.pendingNewParticleColor) {
      this.imageViewer?.setDrawMode('select', { forceDraw: false });
    }

    if (this.deleteModeActive || this.rowEditModeActive || cleanTool === 'molecule') {
      this.clearActiveParticleTool();
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
      + this.pendingAtomRowOverrides.size
      + this.pendingAtomParticleOrders.size
      + this.pendingMoleculeAtomOrders.size;
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
      if (this.pendingAtomRowOverrides.size) {
        await this.commitAtomRowOverrideEdits({ keepEditSession: true });
      }
      if (this.rowEditChangedRows.size) {
        await this.commitRowGuideEdits({ keepEditSession: true });
      }
      if (this.pendingAtomParticleOrders.size || this.pendingMoleculeAtomOrders.size) {
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
    if (this.pendingAtomRowOverrides.size) this.clearAtomRowOverrideEdits({ silent: true });
    if (this.moleculeEditMode || this.hasPendingOrderDrafts()) {
      this.discardMoleculeOrderDrafts({ render: true });
    }
    this.updateEditControls();
    if (!silent) this.showToast('Edicion pendiente cancelada', 'info');
  }

  togglePaintMode(force = null) {
    const next = force === null ? !this.paintModeActive : Boolean(force);
    if (next && !this.activeParticleId) {
      this.showToast('Selecciona una particula guardada para pintar en bloque', 'error');
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
      this.clearActiveParticleTool();
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
    if (!this.activeParticleId) {
      this.showToast('Selecciona una particula guardada para pintar en bloque', 'error');
      this.togglePaintMode(false);
      return;
    }
    const labelSnapshot = this.paintLabelsForActiveParticle();
    if (!labelSnapshot.family) {
      this.showToast('La particula activa no tiene familia base', 'error');
      return;
    }
    const color = this.normalizeColor(stroke.color) || stroke.color || this.particleColor(this.activeParticleId);
    this.paintStrokeBuffer.push({
      ...stroke,
      color,
      closed: false,
      labels: labelSnapshot.labels.map((label) => ({ ...label })),
      family: labelSnapshot.family,
      structuralConfig: labelSnapshot.structuralConfig,
      orderIndex: this.nextParticleOrder() + this.paintStrokeBuffer.length,
    });
    this.imageViewer.setPendingPaintStrokes(this.paintStrokeBuffer);
    this.updatePaintControls();
  }

  paintLabelsForActiveParticle() {
    const particle = this.particleLibrary.find((item) => String(item.id) === String(this.activeParticleId));
    if (!particle) return { labels: [], family: '', structuralConfig: this.activeStructuralConfig || '1' };

    const labels = [];
    const seen = new Set();
    for (const label of particle.labels || []) {
      if (this.isComputedParticleLabel(label)) continue;
      const labelType = String(label.label_type || label.labelType || '').trim();
      const value = String(label.value || '').trim();
      if (!labelType || !value) continue;
      const key = `${labelType}\u0000${value}`;
      if (seen.has(key)) continue;
      seen.add(key);
      labels.push({ label_type: labelType, value });
    }

    const family = this.labelValue(labels, ['base_family']) || this.particleGroupKey(particle);
    if (family && !labels.some((label) => (label.label_type || label.labelType) === 'base_family')) {
      labels.push({ label_type: 'base_family', value: family });
    }

    const structuralConfig = String(this.activeStructuralConfig || this.particleConfigKey(particle) || '1').trim() || '1';
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
    const packet = await api.createParticleStrokesBatch(this.currentImage.id, strokes);
    const createdCount = this.paintStrokeBuffer.length;
    this.clearPaintBuffer({ silent: true });
    await this.loadRegions(this.currentImage.id);
    this.applyParticlePagePacket(packet);
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
      this.applyParticlePagePacket(packet);
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
      this.clearActiveParticleTool();
      this.rowEditSnapshot = this.imageViewer?.getAtomRowGuides() || [];
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
    const guides = this.imageViewer?.getAtomRowGuides() || [];
    if (!guides.length) return;

    if (this.editCommitBtn) this.editCommitBtn.disabled = true;
    const packet = await api.setAtomRowGuides(this.currentImage.id, guides);
    const changedCount = this.rowEditChangedRows.size;
    this.rowEditChangedRows.clear();
    this.applyParticlePagePacket(packet);
    this.rowEditSnapshot = this.imageViewer?.getAtomRowGuides() || [];
    this.updateRowEditControls();
    if (!options.keepEditSession) this.showToast(`${changedCount} renglones guardados`, 'success');
  }

  clearRowGuideEdits({ silent = false } = {}) {
    if (this.rowEditSnapshot.length) {
      this.imageViewer?.setAtomRowGuides(this.rowEditSnapshot);
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
      const key = this.moleculeGapKey(gap.left_atom_index ?? gap.leftAtomIndex, gap.right_atom_index ?? gap.rightAtomIndex);
      if (!key) continue;
      this.gapEditSnapshot.set(key, {
        cut: Boolean(gap.cut),
        overrideDecision: gap.override_decision ?? gap.overrideDecision ?? null,
        reason: gap.reason || '',
      });
    }
  }

  currentMoleculeGaps() {
    const explanation = this.particlePagePacket?.cluster_explanation || this.particlePagePacket?.clusterExplanation || {};
    return explanation.molecule_gaps || explanation.moleculeGaps || [];
  }

  moleculeGapKey(leftAtomIndex, rightAtomIndex) {
    const left = Number(leftAtomIndex || 0);
    const right = Number(rightAtomIndex || 0);
    return left && right ? `${left}:${right}` : '';
  }

  queueMoleculeGapEdit(gap, action) {
    const left = Number(gap.leftAtomIndex || gap.left_atom_index || 0);
    const right = Number(gap.rightAtomIndex || gap.right_atom_index || 0);
    const key = this.moleculeGapKey(left, right);
    if (!key || !['cut', 'join', 'auto'].includes(action)) return;

    if (!this.gapEditSnapshot.size) this.captureMoleculeGapEditSnapshot();
    const existing = this.pendingMoleculeGapOverrides.get(key);
    if (existing) {
      const snapshot = this.gapEditSnapshot.get(key);
      if (snapshot?.overrideDecision) {
        this.pendingMoleculeGapOverrides.set(key, { leftAtomIndex: left, rightAtomIndex: right, decision: 'auto' });
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
        this.pendingMoleculeGapOverrides.set(key, { leftAtomIndex: left, rightAtomIndex: right, decision: 'auto' });
        this.restoreMoleculeGapSnapshot(left, right, { ...snapshot, overrideDecision: null, reason: 'auto pendiente' });
      } else if (snapshot) {
        this.restoreMoleculeGapSnapshot(left, right, snapshot);
      }
      if (!this.pendingMoleculeGapOverrides.size) this.gapEditSnapshot.clear();
      this.updateRowEditControls();
      return;
    }
    this.pendingMoleculeGapOverrides.set(key, { leftAtomIndex: left, rightAtomIndex: right, decision: action });
    this.applyMoleculeGapDraft(left, right, action);
    this.updateRowEditControls();
  }

  restoreMoleculeGapSnapshot(leftAtomIndex, rightAtomIndex, snapshot = {}) {
    const key = this.moleculeGapKey(leftAtomIndex, rightAtomIndex);
    const gaps = this.currentMoleculeGaps();
    const gap = gaps.find((item) => this.moleculeGapKey(item.left_atom_index ?? item.leftAtomIndex, item.right_atom_index ?? item.rightAtomIndex) === key);
    if (gap) {
      gap.cut = Boolean(snapshot.cut);
      gap.override_decision = snapshot.overrideDecision;
      gap.overrideDecision = snapshot.overrideDecision;
      gap.reason = snapshot.reason || '';
    }
    this.imageViewer?.setMoleculeGapState(leftAtomIndex, rightAtomIndex, {
      cut: Boolean(snapshot.cut),
      overrideDecision: snapshot.overrideDecision,
      reason: snapshot.reason || '',
    });
    this.renderClusterDebugPanel({ lightweight: true });
  }

  applyMoleculeGapDraft(leftAtomIndex, rightAtomIndex, decision) {
    const key = this.moleculeGapKey(leftAtomIndex, rightAtomIndex);
    const gaps = this.currentMoleculeGaps();
    const gap = gaps.find((item) => this.moleculeGapKey(item.left_atom_index ?? item.leftAtomIndex, item.right_atom_index ?? item.rightAtomIndex) === key);
    if (gap) {
      gap.cut = decision === 'cut';
      gap.override_decision = decision;
      gap.overrideDecision = decision;
      gap.reason = 'manual';
    }
    this.imageViewer?.setMoleculeGapDraft(leftAtomIndex, rightAtomIndex, decision);
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
    this.applyParticlePagePacket(packet);
    this.updateRowEditControls();
    if (!options.keepEditSession) this.showToast(`${changedCount} cortes/uniones guardados`, 'success');
  }

  clearMoleculeGapEdits({ silent = false } = {}) {
    for (const [key, snapshot] of this.gapEditSnapshot.entries()) {
      const draft = this.pendingMoleculeGapOverrides.get(key);
      if (!draft) continue;
      this.restoreMoleculeGapSnapshot(draft.leftAtomIndex, draft.rightAtomIndex, snapshot);
    }
    this.pendingMoleculeGapOverrides.clear();
    this.gapEditSnapshot.clear();
    this.renderClusterDebugPanel({ lightweight: true });
    this.updateEditControls();
    if (!silent) this.showToast('Edicion de cortes cancelada', 'info');
  }

  atomRowDraftKey(sourceIndex, atomKey = null) {
    const cleanKey = String(atomKey || '').trim();
    return cleanKey ? `key:${cleanKey}` : `source:${Number(sourceIndex || 0)}`;
  }

  queueAtomRowOverrideEdit(sourceIndex, rowIndex, atomKey = null) {
    const atomIndex = Number(sourceIndex || 0);
    const cleanAtomKey = String(atomKey || '').trim() || null;
    const draftKey = this.atomRowDraftKey(atomIndex, cleanAtomKey);
    const cleanRow = rowIndex === null ? null : Number(rowIndex || 0);
    if (!atomIndex || (cleanRow !== null && !cleanRow)) return;
    if (!this.atomRowOverrideSnapshot.has(draftKey)) {
      this.atomRowOverrideSnapshot.set(draftKey, {
        sourceIndex: atomIndex,
        atomKey: cleanAtomKey,
        rowIndex: this.currentAtomRowOverrideValue(atomIndex, cleanAtomKey),
      });
    }
    this.pendingAtomRowOverrides.set(draftKey, { atomIndex, atomKey: cleanAtomKey, rowIndex: cleanRow });
    this.applyLocalAtomRowOverride(atomIndex, cleanRow, cleanAtomKey);
    this.updateEditControls();
  }

  currentAtomRowOverrideValue(sourceIndex, atomKey = null) {
    const explanation = this.particlePagePacket?.cluster_explanation || this.particlePagePacket?.clusterExplanation || {};
    const atomRows = explanation.atom_rows || explanation.atomRows || [];
    const cleanAtomKey = String(atomKey || '').trim();
    for (const row of atomRows) {
      for (const atom of row.atoms || []) {
        const matchKey = String(atom.atom_key ?? atom.atomKey ?? '').trim();
        const matches = cleanAtomKey
          ? matchKey === cleanAtomKey
          : Number(atom.source_index ?? atom.sourceIndex ?? 0) === Number(sourceIndex);
        if (matches) {
          return atom.row_override ?? atom.rowOverride ?? null;
        }
      }
    }
    return null;
  }

  applyLocalAtomRowOverride(sourceIndex, rowIndex, atomKey = null) {
    const explanation = this.particlePagePacket?.cluster_explanation || this.particlePagePacket?.clusterExplanation || {};
    const atomRows = explanation.atom_rows || explanation.atomRows || [];
    const cleanAtomKey = String(atomKey || '').trim();
    for (const row of atomRows) {
      for (const atom of row.atoms || []) {
        const matchKey = String(atom.atom_key ?? atom.atomKey ?? '').trim();
        const matches = cleanAtomKey
          ? matchKey === cleanAtomKey
          : Number(atom.source_index ?? atom.sourceIndex ?? 0) === Number(sourceIndex);
        if (!matches) continue;
        atom.row_override = rowIndex;
        atom.rowOverride = rowIndex;
      }
    }
    this.renderClusterDebugPanel({ lightweight: true });
  }

  async commitAtomRowOverrideEdits(options = {}) {
    if (!this.currentImage || !this.pendingAtomRowOverrides.size) return;
    if (this.editCommitBtn) this.editCommitBtn.disabled = true;
    const overrides = [...this.pendingAtomRowOverrides.values()];
    const packet = await api.setAtomRowOverridesBatch(this.currentImage.id, overrides);
    const changedCount = overrides.length;
    this.pendingAtomRowOverrides.clear();
    this.atomRowOverrideSnapshot.clear();
    this.applyParticlePagePacket(packet);
    this.updateEditControls();
    if (!options.keepEditSession) this.showToast(`${changedCount} cambios de renglon guardados`, 'success');
  }

  clearAtomRowOverrideEdits({ silent = false } = {}) {
    for (const snapshot of this.atomRowOverrideSnapshot.values()) {
      this.applyLocalAtomRowOverride(snapshot.sourceIndex, snapshot.rowIndex, snapshot.atomKey);
    }
    this.pendingAtomRowOverrides.clear();
    this.atomRowOverrideSnapshot.clear();
    this.updateEditControls();
    if (!silent) this.showToast('Edicion de renglones de atomo cancelada', 'info');
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
      this.applyParticlePagePacket(packet);
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
    this.particleCounts = {};
    for (const image of this.images) {
      const regions = await api.listRegions(image.id);
      this.particleCounts[image.id] = regions.length;
    }
    this.imageList.setImages(this.images);
    this.imageList.setParticleCounts(this.particleCounts);
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
    if (this.pendingAtomRowOverrides.size) {
      this.pendingAtomRowOverrides.clear();
      this.atomRowOverrideSnapshot.clear();
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
    this.applyParticlePagePacket(packet);
  }

  async loadRegions(imageId) {
    const allRegions = await api.listRegions(imageId);
    this.regions = allRegions;
    this.imageViewer.setRegions(this.regions);
    this.particleCounts[imageId] = this.regions.length;
    this.imageList.setParticleCounts(this.particleCounts);
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

  async applyActiveParticleLabels(regionId) {
    const particle = this.particleLibrary.find((item) => String(item.id) === String(this.activeParticleId));
    if (!particle) return;
    for (const label of particle.labels || []) {
      if (this.isComputedParticleLabel(label)) continue;
      await api.createLabel(regionId, label.label_type, label.value);
    }
  }

  async applyActiveStructuralConfig(regionId) {
    if (!this.activeParticleId) return;
    const labels = await api.listLabels(regionId);
    await this.setAutoLabel(regionId, labels, 'structural_config', this.activeStructuralConfig || '1');
  }

  async createParticleStroke(stroke) {
    const color = !this.activeParticleId && this.pendingNewParticleColor
      ? this.pendingNewParticleColor
      : this.normalizeColor(stroke.color) || stroke.color;
    const region = await api.createRegion(
      this.currentImage.id,
      JSON.stringify({ ...stroke, color, closed: false }),
      this.nextParticleOrder()
    );
    await this.applyActiveParticleLabels(region.id);
    await this.applyActiveStructuralConfig(region.id);
    await this.autoClassifyCurrentImageVariants();
    await this.syncParticleEngine(region.id);
    await this.recordCreateAction(region.id);
    if (!this.activeParticleId && this.pendingNewParticleColor) {
      this.pendingNewParticleRegionId = Number(region.id);
    }
    await this.loadRegions(this.currentImage.id);
    await this.selectRegion(region.id);
    this.scheduleMoleculeRecalculate();
  }

  async saveSelectedParticleDefinition() {
    if (!this.currentRegion) {
      this.showToast('Selecciona una particula primero', 'error');
      return;
    }
    const labels = await api.listLabels(this.currentRegion.id);
    const family = this.labelValue(labels, ['base_family']);
    const defaultName = this.friendlyParticleKey(family || 'particula');
    const name = await this.requestParticleName(defaultName);
    if (name === null) {
      if (
        this.pendingNewParticleColor &&
        Number(this.currentRegion.id) === Number(this.pendingNewParticleRegionId)
      ) {
        await this.cancelNewParticleCreation({ deletePendingRegion: true });
      }
      return;
    }
    const particleKey = this.friendlyParticleKey(name.trim());
    if (!particleKey) return;
    const color = this.regionColor(this.currentRegion);
    if (
      this.pendingNewParticleColor &&
      Number(this.currentRegion.id) !== Number(this.pendingNewParticleRegionId)
    ) {
      this.showToast('Dibuja o selecciona el trazo nuevo antes de guardarlo', 'error');
      return;
    }
    if (this.pendingNewParticleColor && color !== this.pendingNewParticleColor) {
      await this.updateRegionColor(this.currentRegion.id, this.pendingNewParticleColor);
      const refreshed = await this.snapshotRegion(this.currentRegion.id);
      this.currentRegion = refreshed?.region || this.currentRegion;
    }
    const finalColor = this.regionColor(this.currentRegion);
    const colorOwner = this.particleColorOwner(finalColor);
    if (colorOwner && colorOwner !== particleKey) {
      this.showToast(`Ese color ya pertenece a ${colorOwner}`, 'error');
      return;
    }
    await this.upsertLabel(this.currentRegion.id, ['base_family'], 'base_family', particleKey);
    await this.setStructuralConfig(this.currentRegion.id, this.activeStructuralConfig || '1', { silent: true });
    await this.autoClassifyCurrentImageVariants();
    const updatedLabels = await api.listLabels(this.currentRegion.id);
    const updatedVariant = this.particleVariantKeyFromLabels(updatedLabels);
    const configKey = this.particleConfigKeyFromLabels(updatedLabels);

    const particle = {
      id: `${this.safeFilePart(`${particleKey}-${configKey}`)}-${Date.now()}`,
      name: particleKey,
      particleKey,
      configKey,
      variantKey: updatedVariant,
      region: { ...this.currentRegion },
      bounds: this.regionBounds(this.currentRegion),
      labels: updatedLabels,
      createdAt: new Date().toISOString(),
    };

    this.particleLibrary = [
      particle,
      ...this.particleLibrary.filter((item) => (
        this.particleGroupKey(item) !== particleKey || this.particleConfigKey(item) !== configKey
      )),
    ].slice(0, 300);
    this.saveParticleLibrary();
    this.activeParticleId = particle.id;
    this.activeParticleKey = particleKey;
    this.pendingNewParticleColor = null;
    this.pendingNewParticleRegionId = null;
    this.activeStructuralConfig = configKey;
    this.annotationPanel.setParticleLibrary(this.particleLibrary);
    this.annotationPanel.setActiveParticle(particle.id);
    this.updateParticlePreview();
    this.showToast(`${particleKey} / config ${configKey} guardado`, 'success');
  }

  requestParticleName(defaultName = '') {
    if (!this.particleNameModal || !this.particleNameInput) {
      return Promise.resolve(defaultName);
    }

    this.particleNameInput.value = '';
    this.particleNameModal.classList.add('modal-overlay--visible');
    this.particleNameModal.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => {
      this.particleNameInput.focus();
      this.particleNameInput.select();
    }, 0);

    return new Promise((resolve) => {
      this.pendingParticleNameResolver = resolve;
    });
  }

  resolveParticleNameModal(value) {
    if (!this.pendingParticleNameResolver) return;
    const resolve = this.pendingParticleNameResolver;
    this.pendingParticleNameResolver = null;
    this.particleNameModal?.classList.remove('modal-overlay--visible');
    this.particleNameModal?.setAttribute('aria-hidden', 'true');
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

  nextParticleOrder() {
    const orders = this.regions.map((region) => Number(region.order_index ?? region.orderIndex)).filter(Number.isFinite);
    return orders.length ? Math.max(...orders) + 1 : 1;
  }

  loadParticleLibrary() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(ATOM_LIBRARY_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  saveParticleLibrary() {
    window.localStorage.setItem(ATOM_LIBRARY_KEY, JSON.stringify(this.particleLibrary));
  }

  async autoClassifyCurrentImageVariants() {
    if (!this.currentImage) return;
    const allRegions = await api.listRegions(this.currentImage.id);
    const rows = await Promise.all(allRegions.map(async (region) => {
      const labels = await api.listLabels(region.id);
      return {
        region,
        labels,
        key: this.friendlyParticleKey(this.labelValue(labels, ['base_family'])),
        bounds: this.regionBounds(region),
      };
    }));

    for (const target of rows) {
      if (!target.key) continue;
      const targetRadius = this.classificationRadius(target.bounds);
      const hasNearbyDifferentParticle = rows.some((other) => {
        if (Number(other.region.id) === Number(target.region.id)) return false;
        if (!other.key || other.key === target.key) return false;
        return this.boundsDistance(target.bounds, other.bounds) <= targetRadius;
      });
      await this.setVariantLabel(target.region.id, target.labels, hasNearbyDifferentParticle ? 'incrustada' : 'aislada');
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
    this.selectActiveParticlePattern();
    this.updateParticlePreview();
    if (this.currentRegion) {
      this.setStructuralConfig(this.currentRegion.id, this.activeStructuralConfig)
        .catch((err) => this.showToast(`No pude marcar configuracion: ${err}`, 'error'));
    } else if (this.activeParticleId) {
      this.showToast(`Preview ${this.activeStructuralConfig}`, 'info');
    }
  }

  async syncParticleEngine(regionId) {
    const labels = await api.listLabels(regionId);
    const family = this.friendlyParticleKey(this.labelValue(labels, ['base_family']));
    const structuralConfig = this.labelValue(labels, ['structural_config']) || this.activeStructuralConfig || '1';
    await api.syncParticleForRegion(regionId, family, structuralConfig);
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
        this.applyParticlePagePacket(packet);
      } catch (err) {
        this.showToast(`No pude recalcular moleculas: ${err}`, 'error');
      }
    }, 300);
  }

  applyParticlePagePacket(packet, options = {}) {
    this.particlePagePacket = packet || null;
    const preserveOrderDrafts = options.preserveOrderDrafts
      || (this.editModeActive && this.hasPendingOrderDrafts() && !options.clearOrderDrafts);
    if (!preserveOrderDrafts) {
      this.pendingAtomParticleOrders.clear();
      this.pendingMoleculeAtomOrders.clear();
      this.moleculeEditMode = false;
      this.moleculeEditSnapshot = null;
      this.moleculeEditSnapshots.clear();
    }
    this.imageViewer.setHierarchy(packet || { molecules: [], atoms: [] });
    if (this.pendingMoleculeGapOverrides.size) {
      for (const draft of this.pendingMoleculeGapOverrides.values()) {
        this.applyMoleculeGapDraft(draft.leftAtomIndex, draft.rightAtomIndex, draft.decision);
      }
    }
    if (this.pendingAtomRowOverrides.size) {
      for (const draft of this.pendingAtomRowOverrides.values()) {
        this.applyLocalAtomRowOverride(draft.atomIndex, draft.rowIndex, draft.atomKey);
      }
    }
    this.imageViewer.setSelectedMolecule(this.selectedMoleculeId);
    const lightweight = options.lightweight ?? (this.canSwitchMoleculeDuringEdit() && this.hasPendingOrderDrafts());
    this.renderClusterDebugPanel({ lightweight });
  }

  async locateCurrentPageTarget(rawQuery) {
    const query = String(rawQuery || '').trim();
    if (!query || !this.currentImage || !this.particlePagePacket) return;

    const normalized = query.toLowerCase().replace(/\s+/g, '');
    const particleIdMatch = normalized.match(/^(?:particle|particula|a|id)[:#-]?(\d+)$/) || normalized.match(/^(\d+)$/);
    if (particleIdMatch) {
      const particle = this.findParticleById(Number(particleIdMatch[1]));
      if (particle) {
        await this.focusParticle(particle);
        return;
      }
    }

    const molecule = this.findMoleculeByQuery(normalized);
    if (molecule) {
      this.focusMolecule(molecule);
      return;
    }

    const atom = this.findAtomByQuery(normalized);
    if (atom) {
      this.focusAtom(atom);
      return;
    }

    this.showToast(`No encontre "${query}" en esta pagina`, 'warning');
  }

  findParticleById(particleId) {
    const particles = this.particlePagePacket?.particles || [];
    return particles.find((particle) => Number(particle.id) === Number(particleId));
  }

  findMoleculeByQuery(normalizedQuery) {
    const molecules = this.particlePagePacket?.molecules || [];
    const moleculeIds = this.moleculeQueryCandidates(normalizedQuery);
    return molecules.find((molecule) => {
      const id = String(molecule.molecule_id ?? molecule.moleculeId ?? '').toLowerCase();
      return moleculeIds.includes(id);
    });
  }

  findAtomByQuery(normalizedQuery) {
    const atoms = this.particlePagePacket?.atoms || [];
    return atoms.find((atom) => {
      const id = String(atom.atom_id ?? atom.atomId ?? '').toLowerCase();
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

  async focusParticle(particle) {
    const moleculeId = particle.molecule_id ?? particle.moleculeId ?? null;
    if (moleculeId) {
      this.selectedMoleculeId = moleculeId;
      this.imageViewer.setSelectedMolecule(moleculeId);
    }
    await this.selectRegion(particle.region_id ?? particle.regionId);
    this.imageViewer.focusBox(this.particleBounds(particle), { minZoom: 1.35, maxZoom: 4.5, padding: 120 });
    this.renderClusterDebugPanel();
    this.showToast(`Particula ${particle.id} localizado${moleculeId ? ` en ${moleculeId}` : ''}`, 'success');
  }

  focusMolecule(molecule) {
    const moleculeId = molecule.molecule_id ?? molecule.moleculeId;
    this.selectedMoleculeId = moleculeId;
    this.imageViewer.setSelectedMolecule(moleculeId);
    this.imageViewer.focusBox(this.boxFromEntity(molecule), { minZoom: 0.9, maxZoom: 2.6, padding: 120 });
    this.renderClusterDebugPanel();
    this.showToast(`Molecula ${moleculeId} localizada`, 'success');
  }

  focusAtom(atom) {
    const moleculeId = atom.molecule_id ?? atom.moleculeId ?? null;
    if (moleculeId) {
      this.selectedMoleculeId = moleculeId;
      this.imageViewer.setSelectedMolecule(moleculeId);
    }
    this.imageViewer.setHoveredAtom(atom.atom_id ?? atom.atomId ?? null, atom.source_index ?? atom.sourceIndex ?? 0);
    this.imageViewer.focusBox(this.boxFromEntity(atom), { minZoom: 1.1, maxZoom: 3.2, padding: 120 });
    this.renderClusterDebugPanel();
    this.showToast(`Atomo ${atom.atom_id ?? atom.atomId} localizada`, 'success');
  }

  particleBounds(particle) {
    return {
      x: Number(particle.bounds_x ?? particle.boundsX ?? 0),
      y: Number(particle.bounds_y ?? particle.boundsY ?? 0),
      w: Number(particle.bounds_w ?? particle.boundsW ?? 0),
      h: Number(particle.bounds_h ?? particle.boundsH ?? 0),
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
    const packet = this.particlePagePacket || {};
    const lightweight = Boolean(options.lightweight);
    const explanation = packet.cluster_explanation || packet.clusterExplanation || {};
    const atoms = packet.atoms || [];
    const molecules = packet.molecules || [];
    const links = explanation.links || [];
    const atomLinks = links.filter((link) => (link.stage || '') === 'atom' && link.accepted);
    const gapCount = Number(explanation.gap_count ?? explanation.gapCount ?? 0);
    const centers = gapCount >= 12 ? (explanation.gap_centers || explanation.gapCenters || [])
      .map((value) => this.formatMetric(value))
      .join(' / ') : '';
    const microThreshold = explanation.micro_threshold ?? explanation.microThreshold;
    const macroThreshold = explanation.macro_threshold ?? explanation.macroThreshold;
    const moleculeGaps = explanation.molecule_gaps || explanation.moleculeGaps || [];
    const atomRows = explanation.atom_rows || explanation.atomRows || [];
    const moleculeAudits = packet.molecule_audits || packet.moleculeAudits || [];
    const hasSegmentation = atoms.length > 0 || molecules.length > 0 || atomRows.length > 0 || moleculeAudits.length > 0;
    const hasCalibratedGaps = gapCount >= 12;
    if (!hasSegmentation) {
      this.annotationPanel.setClusterDebugHtml('');
      return;
    }
    const suspiciousMolecules = moleculeAudits.filter((molecule) => {
      const atoms = molecule.atoms || [];
      return Number(molecule.atom_count ?? molecule.atomCount ?? atoms.length) === 1;
    });

    this.annotationPanel.setClusterDebugHtml(`
      <section class="cluster-debug-panel">
        <div class="cluster-debug__summary">
          ${this.renderClusterMetric('Particulas', (packet.particles || []).length)}
          ${this.renderClusterMetric('Atomos', atoms.length)}
          ${this.renderClusterMetric('Moleculas', molecules.length)}
          ${this.renderClusterMetric('Revisar', suspiciousMolecules.length)}
          ${this.renderClusterMetric('Contactos', atomLinks.length)}
          ${hasCalibratedGaps ? this.renderOptionalClusterMetric('Micro gap', microThreshold) : ''}
          ${hasCalibratedGaps ? this.renderOptionalClusterMetric('Macro gap', macroThreshold) : ''}
        </div>
        <div class="cluster-debug__legend">
          <span class="cluster-debug__key"><i class="cluster-debug__line cluster-debug__line--atom"></i>atomo</span>
          <span class="cluster-debug__key"><i class="cluster-debug__line cluster-debug__line--join"></i>une</span>
          <span class="cluster-debug__key"><i class="cluster-debug__line cluster-debug__line--cut"></i>corte</span>
        </div>
        <div class="cluster-debug__notes">
          <span>${atomLinks.length} contactos aceptados forman ${atoms.length} atomo${atoms.length !== 1 ? 's' : ''}.</span>
          <span>${molecules.length} molecula${molecules.length !== 1 ? 's' : ''} por renglon y gap horizontal.</span>
          ${suspiciousMolecules.length ? `<span>${suspiciousMolecules.length} molecula${suspiciousMolecules.length !== 1 ? 's' : ''} de un solo atomo: revisar posible corte sobrante.</span>` : ''}
          ${centers ? `<span>Centros: ${this.escapeHtml(centers)}.</span>` : ''}
          <button class="cluster-debug__undo-btn" type="button" data-clear-latest-atom-merge>deshacer ultima fusion</button>
        </div>
        ${this.renderSelectedMoleculeAudit(moleculeAudits, packet, moleculeGaps, atomRows)}
        ${lightweight ? '<div class="cluster-debug__notes"><span>Edicion de molecula: auditoria global pausada hasta guardar.</span></div>' : ''}
        ${lightweight ? '' : this.renderRowBoundaryAudit(atomRows, moleculeGaps)}
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

    document.querySelectorAll('[data-clear-latest-atom-merge]').forEach((button) => {
      button.addEventListener('click', async () => {
        if (!this.currentImage) return;
        try {
          const packet = await api.clearLatestAtomMergePattern(this.currentImage.id);
          this.applyParticlePagePacket(packet);
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

    document.querySelectorAll('[data-particle-order-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const atomId = button.dataset.atomId || '';
        const particleId = Number(button.dataset.particleId || 0);
        const direction = button.dataset.particleOrderAction || '';
        if (!atomId || !particleId || !this.currentImage) return;
        try {
          button.disabled = true;
          await this.reorderAtomParticle(atomId, particleId, direction);
        } catch (err) {
          this.showToast(`No pude guardar el orden: ${err}`, 'error');
        } finally {
          button.disabled = false;
        }
      });
    });

    document.querySelectorAll('[data-atom-order-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const atomId = button.dataset.atomId || '';
        const direction = button.dataset.atomOrderAction || '';
        if (!atomId || !this.currentImage) return;
        try {
          button.disabled = true;
          await this.reorderMoleculeAtom(atomId, direction);
        } catch (err) {
          this.showToast(`No pude guardar el orden de atomos: ${err}`, 'error');
        } finally {
          button.disabled = false;
        }
      });
    });

    document.querySelectorAll('[data-atom-merge-action]').forEach((button) => {
      button.addEventListener('click', async () => {
        const atomId = button.dataset.atomId || '';
        const direction = button.dataset.atomMergeAction || '';
        if (!atomId || !this.currentImage) return;
        try {
          await this.learnAtomMerge(atomId, direction);
        } catch (err) {
          this.showToast(`No pude ensenar fusion de atomos: ${err}`, 'error');
        }
      });
    });

    document.querySelectorAll('[data-hover-atom-id]').forEach((item) => {
      item.addEventListener('mouseenter', () => {
        this.imageViewer.setHoveredAtom(item.dataset.hoverAtomId || null, item.dataset.hoverAtomSourceIndex || 0);
      });
      item.addEventListener('mouseleave', () => {
        this.imageViewer.setHoveredAtom(null, 0);
      });
    });
  }

  async handleGapAction(button) {
    if (!this.currentImage || !button) return;
    if (!this.rowEditModeActive) return;
    const left = Number(button.dataset.leftAtomIndex || 0);
    const right = Number(button.dataset.rightAtomIndex || 0);
    const action = button.dataset.gapAction || '';
    if (!left || !right || !['cut', 'join', 'auto'].includes(action)) return;

    this.queueMoleculeGapEdit({ leftAtomIndex: left, rightAtomIndex: right }, action);
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
    const left = Number(gap.leftAtomIndex || gap.left_atom_index || 0);
    const right = Number(gap.rightAtomIndex || gap.right_atom_index || 0);
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

  async handleAtomRowAction(button) {
    if (!this.currentImage || !button) return;
    if (!this.canSwitchMoleculeDuringEdit()) return;
    const sourceIndex = Number(button.dataset.atomSourceIndex || 0);
    const atomKey = String(button.dataset.atomKey || '').trim() || null;
    const rowIndex = Number(button.dataset.rowIndex || 0);
    const action = button.dataset.atomRowAction || '';
    if (!sourceIndex || !rowIndex || !['up', 'down', 'auto'].includes(action)) return;

    const targetRow = action === 'auto' ? null : action === 'up' ? rowIndex - 1 : rowIndex + 1;
    this.queueAtomRowOverrideEdit(sourceIndex, targetRow, atomKey);
    this.showToast(
      action === 'auto'
        ? 'Atomo marcada para renglon automatico'
        : `Atomo marcada para R${targetRow}`,
      'info'
    );
  }

  async reorderAtomParticle(atomId, particleId, direction) {
    if (!this.moleculeEditMode) return;
    const molecule = this.selectedMoleculeAudit();
    const atom = (molecule?.atoms || []).find((item) => String(item.atom_id ?? item.atomId) === String(atomId));
    if (!atom) return;

    const particleIds = (atom.particles || []).map((particle) => Number(particle.particle_id ?? particle.particleId ?? 0)).filter(Boolean);
    const index = particleIds.indexOf(Number(particleId));
    const target = this.orderTargetIndex(particleIds.length, index, direction);
    if (index < 0 || target < 0 || target >= particleIds.length || target === index) return;

    const nextParticleIds = particleIds.slice();
    const [moved] = nextParticleIds.splice(index, 1);
    nextParticleIds.splice(target, 0, moved);
    this.applyLocalAtomParticleOrder(atomId, nextParticleIds);
    this.pendingAtomParticleOrders.set(String(atomId), nextParticleIds);
    this.markOrderDraftChanged();
  }

  async reorderMoleculeAtom(atomId, direction) {
    if (!this.moleculeEditMode) return;
    const molecule = this.selectedMoleculeAudit();
    if (!molecule) return;

    const atoms = molecule.atoms || [];
    const atomIds = atoms
      .map((atom) => String(atom.atom_id ?? atom.atomId ?? ''))
      .filter(Boolean);
    const index = atomIds.indexOf(String(atomId));
    const target = this.atomOrderTargetIndex(atoms, index, direction);
    if (index < 0 || target < 0 || target >= atomIds.length || target === index) return;

    const nextAtomIds = atomIds.slice();
    const [moved] = nextAtomIds.splice(index, 1);
    nextAtomIds.splice(target, 0, moved);
    const moleculeId = molecule.molecule_id ?? molecule.moleculeId;
    this.applyLocalMoleculeAtomOrder(moleculeId, nextAtomIds);
    this.pendingMoleculeAtomOrders.set(String(moleculeId), nextAtomIds);
    this.markOrderDraftChanged();
  }

  applyLocalAtomParticleOrder(atomId, nextParticleIds) {
    const molecule = this.selectedMoleculeAudit();
    const atom = (molecule?.atoms || []).find((item) => String(item.atom_id ?? item.atomId) === String(atomId));
    if (!atom) return;
    const order = new Map(nextParticleIds.map((particleId, index) => [Number(particleId), index]));
    atom.particles = (atom.particles || [])
      .slice()
      .sort((a, b) => {
        const aId = Number(a.particle_id ?? a.particleId ?? 0);
        const bId = Number(b.particle_id ?? b.particleId ?? 0);
        return (order.get(aId) ?? Number.MAX_SAFE_INTEGER) - (order.get(bId) ?? Number.MAX_SAFE_INTEGER);
      })
      .map((particle, index) => ({
        ...particle,
        particle_order: index + 1,
        particleOrder: index + 1,
    }));
    atom.signature = this.atomSignatureFromParticles(atom.particles);
  }

  applyLocalMoleculeAtomOrder(moleculeId, nextAtomIds) {
    const molecule = this.selectedMoleculeAudit();
    if (!molecule || String(molecule.molecule_id ?? molecule.moleculeId) !== String(moleculeId)) return;
    const order = new Map(nextAtomIds.map((atomId, index) => [String(atomId), index]));
    molecule.atoms = (molecule.atoms || [])
      .slice()
      .sort((a, b) => {
        const aId = String(a.atom_id ?? a.atomId ?? '');
        const bId = String(b.atom_id ?? b.atomId ?? '');
        return (order.get(aId) ?? Number.MAX_SAFE_INTEGER) - (order.get(bId) ?? Number.MAX_SAFE_INTEGER);
      })
      .map((atom, index) => ({
        ...atom,
        atom_order: index + 1,
        atomOrder: index + 1,
        slot: this.atomSlot(index, nextAtomIds.length),
    }));
    molecule.signature = molecule.atoms.map((atom) => atom.signature || '').filter(Boolean).join(' | ');
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
    const packet = this.particlePagePacket || {};
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
    this.pendingAtomParticleOrders.clear();
    this.pendingMoleculeAtomOrders.clear();

    if (this.particlePagePacket && this.moleculeEditSnapshots.size) {
      const audits = this.particlePagePacket.molecule_audits || this.particlePagePacket.moleculeAudits || [];
      for (const [moleculeId, snapshot] of this.moleculeEditSnapshots.entries()) {
        const index = audits.findIndex((item) => String(item.molecule_id ?? item.moleculeId) === String(moleculeId));
        if (index >= 0) {
          audits[index] = this.cloneOrderDraftValue(snapshot);
        }
      }
    } else if (this.moleculeEditSnapshot && this.particlePagePacket) {
      const audits = this.particlePagePacket.molecule_audits || this.particlePagePacket.moleculeAudits || [];
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
    if (!this.pendingAtomParticleOrders.size && !this.pendingMoleculeAtomOrders.size) {
      this.moleculeEditMode = false;
      this.moleculeEditSnapshot = null;
      this.renderClusterDebugPanel();
      return;
    }

    const atomParticleOrders = [...this.pendingAtomParticleOrders.entries()];
    const moleculeAtomOrders = [...this.pendingMoleculeAtomOrders.entries()];
    this.pendingAtomParticleOrders.clear();
    this.pendingMoleculeAtomOrders.clear();
    this.orderDraftSaving = true;
    this.renderClusterDebugPanel({ lightweight: true });

    try {
      const latestPacket = await api.setOrderDraftsBatch(
        this.currentImage.id,
        atomParticleOrders.map(([atomId, particleIds]) => ({ atomId, particleIds })),
        moleculeAtomOrders.map(([moleculeId, atomIds]) => ({ moleculeId, atomIds })),
      );
      if (latestPacket) {
        this.applyParticlePagePacket(latestPacket, { clearOrderDrafts: true });
        this.moleculeEditSnapshots.clear();
        this.showToast(this.editModeActive ? 'Orden guardado' : 'Orden aprendido', 'success');
      } else {
        this.moleculeEditMode = false;
        this.moleculeEditSnapshot = null;
        this.moleculeEditSnapshots.clear();
      }
    } catch (err) {
      for (const [atomId, particleIds] of atomParticleOrders) {
        this.pendingAtomParticleOrders.set(atomId, particleIds);
      }
      for (const [moleculeId, atomIds] of moleculeAtomOrders) {
        this.pendingMoleculeAtomOrders.set(moleculeId, atomIds);
      }
      throw err;
    } finally {
      this.orderDraftSaving = false;
      this.updateEditControls();
      this.renderClusterDebugPanel({ lightweight: this.hasPendingOrderDrafts() });
    }
  }

  hasPendingOrderDrafts() {
    return this.pendingAtomParticleOrders.size > 0 || this.pendingMoleculeAtomOrders.size > 0 || this.orderDraftSaving;
  }

  atomSignatureFromParticles(particles = []) {
    return particles.map((particle) => {
      const family = particle.family || '?';
      const config = particle.structural_config ?? particle.structuralConfig ?? '';
      return config ? `${family}:${config}` : family;
    }).join(' ');
  }

  atomSlot(index, count) {
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

  atomOrderTargetIndex(atoms = [], index = -1, direction = '') {
    if (index < 0) return index;
    if (direction === 'first') return 0;
    if (direction === 'last') return atoms.length - 1;
    const step = direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
    if (!step) return index;
    const currentSignature = this.atomOrderSignature(atoms[index]);
    let target = index + step;
    while (
      target >= 0
      && target < atoms.length
      && this.atomOrderSignature(atoms[target]) === currentSignature
    ) {
      target += step;
    }
    return target;
  }

  atomOrderSignature(atom = {}) {
    return String(atom.signature_key ?? atom.signatureKey ?? atom.signature ?? '');
  }

  async learnAtomMerge(atomId, direction) {
    const molecule = this.selectedMoleculeAudit();
    const atoms = molecule?.atoms || [];
    const atomIds = atoms
      .map((atom) => String(atom.atom_id ?? atom.atomId ?? ''))
      .filter(Boolean);
    const index = atomIds.indexOf(String(atomId));
    const target = direction === 'previous' ? index - 1 : direction === 'next' ? index + 1 : index;
    if (index < 0 || target < 0 || target >= atomIds.length || target === index) return;

    const packet = await api.setAtomMergePattern(
      this.currentImage.id,
      atomIds[index],
      atomIds[target],
    );
    this.applyParticlePagePacket(packet);
    this.showToast('Excepcion de atomo aprendida', 'success');
  }

  selectedMoleculeAudit() {
    const packet = this.particlePagePacket || {};
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
    const left = Number(gap.left_atom_index ?? gap.leftAtomIndex ?? 0);
    const right = Number(gap.right_atom_index ?? gap.rightAtomIndex ?? 0);
    const gapValue = this.formatMetric(gap.gap);
    const threshold = this.formatMetric(gap.threshold);
    const reason = gap.reason || (cut ? 'corte' : 'une');
    const override = gap.override_decision ?? gap.overrideDecision ?? '';
    const showActions = this.rowEditModeActive;
    return `
      <div class="gap-audit__item gap-audit__item--${cut ? 'cut' : 'join'} ${override ? 'gap-audit__item--manual' : ''}">
        <span class="gap-audit__decision">${cut ? 'corte' : 'une'}</span>
        <code>R${row} A${left}->A${right}</code>
        <span>${gapValue}/${threshold}</span>
        <small>${this.escapeHtml(reason)}${override ? ' · manual' : ''}</small>
        ${showActions ? `<div class="gap-audit__actions">
          <button class="gap-audit__btn" type="button" data-gap-action="cut" data-left-atom-index="${left}" data-right-atom-index="${right}">cortar</button>
          <button class="gap-audit__btn" type="button" data-gap-action="join" data-left-atom-index="${left}" data-right-atom-index="${right}">unir</button>
          <button class="gap-audit__btn" type="button" data-gap-action="auto" data-left-atom-index="${left}" data-right-atom-index="${right}">auto</button>
        </div>` : ''}
      </div>
    `;
  }

  renderSelectedMoleculeAudit(audits = [], packet = {}, gaps = [], atomRows = []) {
    if (!this.selectedMoleculeId) return '';
    const molecule = audits.find((item) => String(item.molecule_id ?? item.moleculeId) === String(this.selectedMoleculeId));
    if (!molecule) return '';
    const atoms = molecule.atoms || [];
    const isSuspicious = Number(molecule.atom_count ?? molecule.atomCount ?? atoms.length) === 1;
    const fixGaps = isSuspicious ? this.suspiciousMoleculeGapCandidates(molecule, packet, gaps) : [];
    const rowInfo = isSuspicious ? this.selectedMoleculeRowInfo(molecule, packet, atomRows) : null;
    const editStatus = this.orderDraftSaving ? 'guardando...' : this.hasPendingOrderDrafts() ? 'cambios sin guardar' : 'editando';
    return `
      <section class="molecule-detail ${isSuspicious ? 'molecule-detail--warning' : ''}">
        <div class="molecule-detail__head">
          <strong>${this.escapeHtml(this.selectedMoleculeId)}</strong>
          <span>${Number(molecule.atom_count ?? molecule.atomCount ?? atoms.length)} atomos / ${Number(molecule.particle_count ?? molecule.particleCount ?? 0)} particulas</span>
          ${this.canSwitchMoleculeDuringEdit() ? `<small>${editStatus}</small>` : ''}
        </div>
        ${isSuspicious ? '<div class="molecule-detail__warning">Revisar: molecula de un solo atomo.</div>' : ''}
        ${fixGaps.length ? this.renderSuspiciousMoleculeFixes(fixGaps) : ''}
        ${isSuspicious && !fixGaps.length ? '<div class="molecule-detail__warning">Sin gap exacto para corregir: revisar asignacion de renglon.</div>' : ''}
        ${rowInfo ? this.renderSelectedMoleculeRowInfo(rowInfo) : ''}
        <code class="molecule-detail__signature">${this.escapeHtml(molecule.signature || '')}</code>
        <div class="molecule-detail__atoms">
          ${atoms.map((atom, index) => this.renderAtomDetailItem(atom, index, atoms.length)).join('')}
        </div>
      </section>
    `;
  }

  suspiciousMoleculeGapCandidates(molecule, packet = {}, gaps = []) {
    const moleculeId = molecule.molecule_id ?? molecule.moleculeId;
    const singleton = (packet.atoms || []).find((atom) => (
      String(atom.molecule_id ?? atom.moleculeId) === String(moleculeId)
    ));
    if (!singleton) return [];

    const x = Number(singleton.bounds_x ?? singleton.boundsX ?? 0);
    const sourceIndex = Number(singleton.source_index ?? singleton.sourceIndex ?? 0);
    if (!sourceIndex) return [];

    let previous = (gaps || []).find((gap) => Number(gap.right_atom_index ?? gap.rightAtomIndex ?? 0) === sourceIndex);
    let next = (gaps || []).find((gap) => Number(gap.left_atom_index ?? gap.leftAtomIndex ?? 0) === sourceIndex);
    if (previous) previous = { ...previous, side: 'molecula anterior', exact: true };
    if (next) next = { ...next, side: 'molecula siguiente', exact: true };

    return [previous, next].filter(Boolean);
  }

  selectedMoleculeRowInfo(molecule, packet = {}, atomRows = []) {
    const moleculeId = molecule.molecule_id ?? molecule.moleculeId;
    const singleton = (packet.atoms || []).find((atom) => (
      String(atom.molecule_id ?? atom.moleculeId) === String(moleculeId)
    ));
    const sourceIndex = Number(singleton?.source_index ?? singleton?.sourceIndex ?? 0);
    if (!sourceIndex) return null;
    for (const row of atomRows || []) {
      const match = (row.atoms || []).find((atom) => Number(atom.source_index ?? atom.sourceIndex ?? 0) === sourceIndex);
      if (match) {
        return {
          rowIndex: Number(row.row_index ?? row.rowIndex ?? 0),
          baselineY: Number(row.baseline_y ?? row.baselineY ?? 0),
          sourceIndex,
          atomY: Number(match.y ?? 0),
          atomBottomY: Number(match.bottom_y ?? match.bottomY ?? (Number(match.y ?? 0) + Number(match.h ?? 0))),
          atomBodyY: Number(match.body_y ?? match.bodyY ?? match.baseline_y ?? match.baselineY ?? 0),
          atomHeight: Number(match.h ?? 0),
        };
      }
    }
    return null;
  }

  atomRowInfoForSource(sourceIndex) {
    const packet = this.particlePagePacket || {};
    const explanation = packet.cluster_explanation || packet.clusterExplanation || {};
    const atomRows = explanation.atom_rows || explanation.atomRows || [];
    const rowCount = atomRows.length;
    for (const row of atomRows || []) {
      const match = (row.atoms || []).find((atom) => Number(atom.source_index ?? atom.sourceIndex ?? 0) === sourceIndex);
      if (match) {
        const atomKey = String(match.atom_key ?? match.atomKey ?? '').trim();
        const pendingRow = this.pendingAtomRowOverrides.get(this.atomRowDraftKey(sourceIndex, atomKey))
          || this.pendingAtomRowOverrides.get(String(sourceIndex));
        const baseRowIndex = Number(row.row_index ?? row.rowIndex ?? 0);
        const displayRowIndex = pendingRow && pendingRow.rowIndex !== null ? Number(pendingRow.rowIndex) : baseRowIndex;
        return {
          rowIndex: displayRowIndex,
          rowCount,
          rowOverride: pendingRow ? pendingRow.rowIndex : match.row_override ?? match.rowOverride ?? null,
          atomKey,
        };
      }
    }
    return { rowIndex: 0, rowCount, rowOverride: null };
  }

  renderAtomRowControls(sourceIndex, rowInfo) {
    if (!this.canSwitchMoleculeDuringEdit()) return '';
    if (!sourceIndex || !rowInfo?.rowIndex) return '';
    const rowIndex = Number(rowInfo.rowIndex || 0);
    const rowCount = Number(rowInfo.rowCount || 0);
    const atomKey = String(rowInfo.atomKey || '').trim();
    const atomKeyAttr = this.escapeHtml(atomKey);
    const hasOverride = rowInfo.rowOverride !== null && rowInfo.rowOverride !== undefined;
    return `
      <span class="atom-detail__row-controls">
        <span>R${rowIndex}${hasOverride ? ' manual' : ''}</span>
        <button class="atom-detail__move-btn" type="button" data-atom-row-action="up" data-atom-source-index="${sourceIndex}" data-atom-key="${atomKeyAttr}" data-row-index="${rowIndex}" ${rowIndex <= 1 ? 'disabled' : ''}>at. arriba</button>
        <button class="atom-detail__move-btn" type="button" data-atom-row-action="down" data-atom-source-index="${sourceIndex}" data-atom-key="${atomKeyAttr}" data-row-index="${rowIndex}" ${rowCount && rowIndex >= rowCount ? 'disabled' : ''}>at. abajo</button>
        <button class="atom-detail__move-btn" type="button" data-atom-row-action="auto" data-atom-source-index="${sourceIndex}" data-atom-key="${atomKeyAttr}" data-row-index="${rowIndex}" ${!hasOverride ? 'disabled' : ''}>at. auto</button>
      </span>
    `;
  }

  renderSelectedMoleculeRowInfo(rowInfo) {
    return `
      <div class="molecule-detail__row">
        <span>R${rowInfo.rowIndex} · A${rowInfo.sourceIndex}</span>
        <span>row ${this.formatMetric(rowInfo.baselineY)} · anchor ${this.formatMetric(rowInfo.atomBodyY)}</span>
        <span>y ${this.formatMetric(rowInfo.atomY)} · bottom ${this.formatMetric(rowInfo.atomBottomY)} · h ${this.formatMetric(rowInfo.atomHeight)}</span>
      </div>
    `;
  }

  renderRowBoundaryAudit(atomRows = [], gaps = []) {
    if (!atomRows.length) return '';
    const rows = new Map();
    for (const row of atomRows) {
      rows.set(Number(row.row_index ?? row.rowIndex ?? 0), row);
    }
    const gapByPair = new Map((gaps || []).map((gap) => [
      `${Number(gap.left_atom_index ?? gap.leftAtomIndex ?? 0)}:${Number(gap.right_atom_index ?? gap.rightAtomIndex ?? 0)}`,
      gap,
    ]));

    return `
      <div class="row-audit">
        ${Array.from(rows.entries()).sort((a, b) => a[0] - b[0]).map(([row, rowAudit]) => {
          const ordered = (rowAudit.atoms || []).slice().sort((a, b) => Number(a.x ?? 0) - Number(b.x ?? 0));
          const tokens = [];
          for (let index = 0; index < ordered.length; index += 1) {
            const current = ordered[index];
            tokens.push(`A${Number(current.source_index ?? current.sourceIndex ?? 0)}`);
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
          const left = Number(gap.left_atom_index ?? gap.leftAtomIndex ?? 0);
          const right = Number(gap.right_atom_index ?? gap.rightAtomIndex ?? 0);
          return `
            <div class="molecule-detail__fix">
              <span>Unir con ${this.escapeHtml(gap.side)}: R${row} A${left}->A${right}</span>
              <button class="gap-audit__btn" type="button" data-gap-action="join" data-left-atom-index="${left}" data-right-atom-index="${right}">unir</button>
              <button class="gap-audit__btn" type="button" data-gap-action="auto" data-left-atom-index="${left}" data-right-atom-index="${right}">auto</button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderAtomDetailItem(atom, atomIndex = 0, atomCount = 0) {
    const particles = atom.particles || [];
    const atomId = atom.atom_id ?? atom.atomId ?? '';
    const sourceIndex = Number(atom.source_index ?? atom.sourceIndex ?? 0);
    const bounds = {
      x: Number(atom.bounds_x ?? atom.boundsX ?? 0),
      y: Number(atom.bounds_y ?? atom.boundsY ?? 0),
      w: Number(atom.bounds_w ?? atom.boundsW ?? 0),
      h: Number(atom.bounds_h ?? atom.boundsH ?? 0),
    };
    const centroid = {
      x: Number(atom.centroid_x ?? atom.centroidX ?? 0),
      y: Number(atom.centroid_y ?? atom.centroidY ?? 0),
    };
    const contactCount = Number(atom.internal_contact_count ?? atom.internalContactCount ?? 0);
    const rowInfo = this.atomRowInfoForSource(sourceIndex);
    const showOrderControls = this.canSwitchMoleculeDuringEdit();
    const orderDisabled = !showOrderControls || this.orderDraftSaving;
    return `
      <section class="atom-detail" data-hover-atom-id="${this.escapeHtml(atomId)}" data-hover-atom-source-index="${sourceIndex}">
        <div class="atom-detail__head">
          <span>${this.escapeHtml(atom.slot || '?')} #${Number(atom.atom_order ?? atom.atomOrder ?? 0)} / A${Number(atom.source_index ?? atom.sourceIndex ?? 0)}</span>
          ${showOrderControls ? `<span class="atom-detail__order-controls">
            <button class="atom-detail__move-btn" type="button" data-atom-order-action="first" data-atom-id="${this.escapeHtml(atomId)}" ${orderDisabled || atomIndex === 0 ? 'disabled' : ''}>inicio</button>
            <button class="atom-detail__move-btn" type="button" data-atom-order-action="up" data-atom-id="${this.escapeHtml(atomId)}" ${orderDisabled || atomIndex === 0 ? 'disabled' : ''}>subir</button>
            <button class="atom-detail__move-btn" type="button" data-atom-order-action="down" data-atom-id="${this.escapeHtml(atomId)}" ${orderDisabled || atomIndex >= atomCount - 1 ? 'disabled' : ''}>bajar</button>
            <button class="atom-detail__move-btn" type="button" data-atom-order-action="last" data-atom-id="${this.escapeHtml(atomId)}" ${orderDisabled || atomIndex >= atomCount - 1 ? 'disabled' : ''}>final</button>
            <button class="atom-detail__move-btn atom-detail__move-btn--merge" type="button" data-atom-merge-action="previous" data-atom-id="${this.escapeHtml(atomId)}" ${atomIndex === 0 ? 'disabled' : ''}>fusionar ant.</button>
            <button class="atom-detail__move-btn atom-detail__move-btn--merge" type="button" data-atom-merge-action="next" data-atom-id="${this.escapeHtml(atomId)}" ${atomIndex >= atomCount - 1 ? 'disabled' : ''}>fusionar sig.</button>
          </span>` : ''}
          ${this.renderAtomRowControls(sourceIndex, rowInfo)}
          <code>${this.escapeHtml(atom.signature || '?')}</code>
        </div>
        <div class="atom-detail__metrics">
          <span>id <code>${this.escapeHtml(atomId)}</code></span>
          <span>firma <code>${this.escapeHtml(atom.signature_key ?? atom.signatureKey ?? atom.signature ?? '?')}</code></span>
          <span>${particles.length} particulas</span>
          <span>${contactCount} contactos internos</span>
          <span>box ${this.formatMetric(bounds.x)},${this.formatMetric(bounds.y)} ${this.formatMetric(bounds.w)}x${this.formatMetric(bounds.h)}</span>
          <span>centro ${this.formatMetric(centroid.x)},${this.formatMetric(centroid.y)}</span>
        </div>
        <div class="atom-detail__particles">
          ${particles.map((particle, index) => `
            <span class="atom-detail__particle">
              ${showOrderControls ? `
                <button class="atom-detail__particle-btn" type="button" data-particle-order-action="first" data-atom-id="${this.escapeHtml(atomId)}" data-particle-id="${Number(particle.particle_id ?? particle.particleId ?? 0)}" ${orderDisabled || index === 0 ? 'disabled' : ''}>inicio</button>
                <button class="atom-detail__particle-btn" type="button" data-particle-order-action="up" data-atom-id="${this.escapeHtml(atomId)}" data-particle-id="${Number(particle.particle_id ?? particle.particleId ?? 0)}" ${orderDisabled || index === 0 ? 'disabled' : ''}>subir</button>
                <button class="atom-detail__particle-btn" type="button" data-particle-order-action="down" data-atom-id="${this.escapeHtml(atomId)}" data-particle-id="${Number(particle.particle_id ?? particle.particleId ?? 0)}" ${orderDisabled || index === particles.length - 1 ? 'disabled' : ''}>bajar</button>
                <button class="atom-detail__particle-btn" type="button" data-particle-order-action="last" data-atom-id="${this.escapeHtml(atomId)}" data-particle-id="${Number(particle.particle_id ?? particle.particleId ?? 0)}" ${orderDisabled || index === particles.length - 1 ? 'disabled' : ''}>final</button>
              ` : ''}
              <code>${Number(particle.particle_order ?? particle.particleOrder ?? 0)}:${this.escapeHtml(particle.family || '?')}${particle.structural_config || particle.structuralConfig ? `:${this.escapeHtml(particle.structural_config ?? particle.structuralConfig)}` : ''}</code>
              <small>#${Number(particle.particle_id ?? particle.particleId ?? 0)} a:${this.formatMetric(particle.anchor_x ?? particle.anchorX)},${this.formatMetric(particle.anchor_y ?? particle.anchorY)} box:${this.formatMetric(particle.bounds_x ?? particle.boundsX)},${this.formatMetric(particle.bounds_y ?? particle.boundsY)} ${this.formatMetric(particle.bounds_w ?? particle.boundsW)}x${this.formatMetric(particle.bounds_h ?? particle.boundsH)} ang:${this.formatMetric(particle.angle)}</small>
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
    const atoms = molecule.atoms || [];
    const isSuspicious = Number(molecule.atom_count ?? molecule.atomCount ?? atoms.length) === 1;
    return `
      <section class="molecule-audit__item ${isSuspicious ? 'molecule-audit__item--warning' : ''}">
        <div class="molecule-audit__head">
          <button class="molecule-audit__select" type="button" data-select-molecule="${this.escapeHtml(molecule.molecule_id ?? molecule.moleculeId ?? '')}">M${index + 1}</button>
          <span>${isSuspicious ? 'revisar - ' : ''}${Number(molecule.atom_count ?? molecule.atomCount ?? atoms.length)}a / ${Number(molecule.particle_count ?? molecule.particleCount ?? 0)}p</span>
        </div>
        <div class="molecule-audit__atoms">
          ${atoms.map((atom) => this.renderAtomAuditItem(atom)).join('')}
        </div>
      </section>
    `;
  }

  renderAtomAuditItem(atom) {
    const slot = atom.slot || '?';
    const signature = atom.signature || '?';
    const particleCount = Number(atom.particle_count ?? atom.particleCount ?? 0);
    return `
      <div class="molecule-audit__atom">
        <span class="molecule-audit__slot">${this.escapeHtml(slot)}</span>
        <code>${this.escapeHtml(signature)}</code>
        <span>${particleCount}a</span>
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

  renderOptionalClusterMetric(label, value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return '';
    return this.renderClusterMetric(label, this.formatMetric(number));
  }

  updateAnnotationsVisibilityButton() {
    if (!this.sidebarLabelsBtn) return;
    const visible = Boolean(this.annotationsVisible);
    this.sidebarLabelsBtn.classList.toggle('sidebar__labels-btn--hidden', !visible);
    this.sidebarLabelsBtn.dataset.tooltip = visible ? 'Ocultar capas' : 'Mostrar capas';
    this.sidebarLabelsBtn.setAttribute('aria-label', visible ? 'Ocultar capas' : 'Mostrar capas');
    this.sidebarLabelsBtn.innerHTML = this.renderEyeIcon(visible);
  }

  renderEyeIcon(open) {
    if (open) {
      return `
        <svg class="sidebar__labels-svg" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
          <circle cx="12" cy="12" r="2.8"></circle>
        </svg>
      `;
    }
    return `
      <svg class="sidebar__labels-svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.7 5.5A9.9 9.9 0 0 1 12 5.2c6 0 9.5 6.8 9.5 6.8a17.1 17.1 0 0 1-3 3.8"></path>
        <path d="M14.1 14.1A3 3 0 0 1 9.9 9.9"></path>
        <path d="M4.4 4.4 19.6 19.6"></path>
        <path d="M6.1 7.1A17.1 17.1 0 0 0 2.5 12s3.5 6.8 9.5 6.8a9.8 9.8 0 0 0 3.1-.5"></path>
      </svg>
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

  isComputedParticleLabel(label) {
    return [
      'visual_variant',
      'geometry_length',
      'geometry_angle',
      'geometry_points',
      'molecule_id',
      'molecule_size',
      'particle_order',
      'structural_config',
    ].includes(label.label_type || label.labelType);
  }

  particleColor(particleId) {
    const particle = this.particleLibrary.find((item) => String(item.id) === String(particleId));
    return this.particleDefinitionColor(particle) || '#64b4dc';
  }

  particleDefinitionColor(particle) {
    return this.regionColor(particle?.region);
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

  particleColorOwner(color) {
    const clean = this.normalizeColor(color);
    if (!clean) return null;
    const owner = this.particleLibrary.find((item) => this.particleDefinitionColor(item) === clean);
    return owner ? this.particleGroupKey(owner) : null;
  }

  selectActiveParticlePattern() {
    if (!this.activeParticleKey) return;
    const exact = this.particleForConfig(this.activeParticleKey, this.activeStructuralConfig);
    const fallback = this.particleForConfig(this.activeParticleKey, '1') || this.particleLibrary.find((item) => this.particleGroupKey(item) === this.activeParticleKey);
    const next = exact || fallback;
    if (!next) return;
    this.activeParticleId = next.id;
    this.annotationPanel.setActiveParticle(next.id);
    this.imageViewer.setDrawMode('stroke', { color: this.particleColor(next.id), forceDraw: true });
  }

  particleForConfig(particleKey, configKey) {
    return this.particleLibrary.find((item) => (
      this.particleGroupKey(item) === particleKey &&
      this.particleConfigKey(item) === String(configKey || '1')
    ));
  }

  updateParticlePreview() {
    if (!this.activeParticleId && !this.activeParticleKey) {
      this.imageViewer.setParticlePreview(null);
      return;
    }
    const particle = this.particleForConfig(this.activeParticleKey, this.activeStructuralConfig) ||
      this.particleLibrary.find((item) => String(item.id) === String(this.activeParticleId));
    if (!particle?.region) {
      this.imageViewer.setParticlePreview(null);
      return;
    }
    const geometry = this.parseGeometry(particle.region.geometry_json || particle.region.geometryJson || '{}');
    if (!Array.isArray(geometry.points) || geometry.points.length < 2) {
      this.imageViewer.setParticlePreview(null);
      return;
    }
    this.imageViewer.setParticlePreview({
      points: geometry.points,
      bounds: this.boundsFromGeometry(geometry),
      color: geometry.color || '#64b4dc',
      config: this.activeStructuralConfig,
      exact: this.particleConfigKey(particle) === String(this.activeStructuralConfig || '1'),
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

  labelValueFromParticle(particle, types) {
    const labels = Array.isArray(particle?.labels) ? particle.labels : [];
    return String(this.labelValue(labels, types) || '').trim();
  }

  particleGroupKey(particle) {
    const explicit = String(particle?.particleKey || '').trim();
    if (explicit) return this.friendlyParticleKey(explicit);
    const family = this.labelValueFromParticle(particle, ['base_family']);
    const name = String(particle?.name || '').trim();
    return this.friendlyParticleKey(name || family || 'particula');
  }

  particleVariantKeyFromLabels(labels) {
    return String(this.labelValue(labels, ['visual_variant']) || 'base').trim() || 'base';
  }

  particleConfigKey(particle) {
    const explicit = String(particle?.configKey || '').trim();
    if (explicit) return explicit;
    return this.labelValueFromParticle(particle, ['structural_config']) || '1';
  }

  particleConfigKeyFromLabels(labels) {
    return String(this.labelValue(labels, ['structural_config']) || '1').trim() || '1';
  }

  friendlyParticleKey(value) {
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
    return String(value || 'particle')
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
