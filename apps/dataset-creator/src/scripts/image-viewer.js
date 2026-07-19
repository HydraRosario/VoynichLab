// ============================================================
// DataSetCreator - Image Viewer (Canvas)
// Full-featured canvas image viewer with zoom, pan, drawing
// ============================================================

const STROKE_STYLE = {
  border: '#64b4dc',
  selectedFill: 'rgba(100,180,220,0.20)',
};

export class ImageViewer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');

    // Image state
    this.image = null;        // HTMLImageElement
    this.imageWidth = 0;
    this.imageHeight = 0;

    // Viewport state
    this.zoom = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.minZoom = 0.1;
    this.maxZoom = 10;

    // Regions
    this.regions = [];
    this.pendingPaintRegions = [];
    this.pendingDeleteRegionIds = new Set();
    this.batchDeleteMode = false;
    this.particles = [];
    this.molecules = [];
    this.atoms = [];
    this._particlesById = new Map();
    this._selectedRegion = null;
    this.clusterExplanation = null;
    this.moleculeGaps = [];
    this.atomRows = [];
    this.selectedRegionId = null;
    this.selectedMoleculeId = null;
    this.hoveredMoleculeId = null;
    this.hoveredAtomId = null;
    this.hoveredAtomSourceIndex = 0;
    this.annotationsVisible = true;
    this.activeRowDrag = null;
    this.rowEditMode = false;

    // Drawing state
    this.isDrawing = false;
    this.drawMode = 'select';
    this.strokePoints = [];
    this.strokeColor = '#64b4dc';
    this.forceDraw = false;
    this.particlePreview = null;
    this.keyboardStrokeHeld = false;
    this.lastMousePos = null;

    this.isTransforming = false;
    this.transformKind = null;
    this.transformHandle = null;
    this.transformRegion = null;
    this.transformStartMouse = null;
    this.transformStartRegion = null;

    // Panning state
    this.isPanning = false;
    this.panStartMouse = null;
    this.panStartOffset = null;
    this.spaceHeld = false;

    // Dirty flag for rendering
    this._dirty = true;
    this._rafId = null;

    // Callbacks
    this._onStrokeCreated = null;
    this._onParticleStamped = null;
    this._onRegionSelected = null;
    this._onRegionChanged = null;
    this._onMoleculeSelected = null;
    this._onRowGuideAdjusted = null;
    this._onMoleculeGapAction = null;

    // Bind methods
    this._handleMouseDown = this._handleMouseDown.bind(this);
    this._handleMouseMove = this._handleMouseMove.bind(this);
    this._handleMouseUp = this._handleMouseUp.bind(this);
    this._handleStrokeWindowMove = this._handleStrokeWindowMove.bind(this);
    this._handleStrokeWindowUp = this._handleStrokeWindowUp.bind(this);
    this._handleWheel = this._handleWheel.bind(this);
    this._handleKeyDown = this._handleKeyDown.bind(this);
    this._handleKeyUp = this._handleKeyUp.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this._renderLoop = this._renderLoop.bind(this);
    this._handleContextMenu = this._handleContextMenu.bind(this);

    // Setup
    this._setupCanvas();
    this._attachEvents();
    this._startRenderLoop();
  }

  // Public API

  /**
   * Load an image from a base64 data URI
   */
  loadImage(base64DataUri) {
    return new Promise((resolve, reject) => {
      if (!base64DataUri) {
        this.clear();
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.image = img;
        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;
        this._fitImageToView();
        this._dirty = true;
        resolve();
      };
      img.onerror = (err) => {
        console.error('[ImageViewer] Failed to load image:', err);
        reject(err);
      };
      img.src = base64DataUri;
    });
  }

  clear() {
    this.image = null;
    this.imageWidth = 0;
    this.imageHeight = 0;
    this.regions = [];
    this.pendingPaintRegions = [];
    this.pendingDeleteRegionIds = new Set();
    this.batchDeleteMode = false;
    this.particles = [];
    this.molecules = [];
    this.atoms = [];
    this._particlesById = new Map();
    this._selectedRegion = null;
    this.clusterExplanation = null;
    this.moleculeGaps = [];
    this.atomRows = [];
    this.selectedRegionId = null;
    this.selectedMoleculeId = null;
    this.hoveredMoleculeId = null;
    this.hoveredAtomId = null;
    this.hoveredAtomSourceIndex = 0;
    this._dirty = true;
  }

  /**
   * Set regions to overlay on the image.
   * Each region: { id, geometry_json (or geometryJson) }
   * geometry_json must parse to { points, color, width, closed }
   */
  setRegions(regions) {
    this.regions = (regions || []).map(r => {
      let geom;
      const geoStr = r.geometry_json || r.geometryJson || r.geometryJSON || '{}';
      try { geom = typeof geoStr === 'string' ? JSON.parse(geoStr) : geoStr; } catch { geom = {}; }
      const points = Array.isArray(geom.points) ? geom.points : [];
      return {
        id: r.id,
        points,
        color: geom.color,
        width: geom.width,
        closed: Boolean(geom.closed),
        bounds: this._pointsBounds(points),
      };
    });
    this._selectedRegion = this.regions.find(r => String(r.id) === String(this.selectedRegionId)) || null;
    this._dirty = true;
  }

  setPendingPaintStrokes(strokes = []) {
    this.pendingPaintRegions = (strokes || []).map((stroke, index) => {
      const points = Array.isArray(stroke.points) ? stroke.points : [];
      return {
        id: `paint-${index}`,
        points,
        color: stroke.color || STROKE_STYLE.border,
        width: stroke.width,
        closed: Boolean(stroke.closed),
        bounds: this._pointsBounds(points),
      };
    });
    this._dirty = true;
  }

  setPendingDeleteRegionIds(regionIds = []) {
    this.pendingDeleteRegionIds = new Set((regionIds || []).map((id) => String(id)));
    this._dirty = true;
  }

  setBatchDeleteMode(active) {
    this.batchDeleteMode = Boolean(active);
    this._dirty = true;
  }

  setRowEditMode(active) {
    this.rowEditMode = Boolean(active);
    this._dirty = true;
  }

  getAtomRowGuides() {
    return (this.atomRows || []).map((row) => ({
      rowIndex: Number(row.rowIndex),
      topY: Number(row.topY),
      y: Number((row.topY + row.bottomY) / 2),
      bottomY: Number(row.bottomY),
    }));
  }

  setAtomRowGuides(rows = []) {
    this.atomRows = (rows || []).map((row) => this._normalizeAtomRow(row));
    this._dirty = true;
  }

  setMoleculeGapDraft(leftAtomIndex, rightAtomIndex, decision) {
    this.setMoleculeGapState(leftAtomIndex, rightAtomIndex, {
      cut: decision === 'cut',
      overrideDecision: decision,
      reason: 'manual',
    });
  }

  setMoleculeGapState(leftAtomIndex, rightAtomIndex, state = {}) {
    const left = Number(leftAtomIndex);
    const right = Number(rightAtomIndex);
    if (!left || !right) return;
    const gap = this.moleculeGaps.find((item) => (
      Number(item.leftAtomIndex) === left && Number(item.rightAtomIndex) === right
    ));
    if (!gap) return;
    gap.cut = Boolean(state.cut);
    gap.overrideDecision = state.overrideDecision ?? null;
    gap.reason = state.reason || '';
    this._dirty = true;
  }

  setHierarchy(packet = {}) {
    this.particles = (packet.particles || []).map((particle) => this._normalizeParticle(particle));
    this._particlesById = new Map(this.particles.map((particle) => [String(particle.id), particle]));
    this.molecules = (packet.molecules || []).map((molecule) => this._normalizeBox(molecule, 'molecule'));
    this.atoms = (packet.atoms || []).map((atom) => this._normalizeBox(atom, 'atom'));
    this.clusterExplanation = packet.cluster_explanation || packet.clusterExplanation || null;
    this.moleculeGaps = (this.clusterExplanation?.molecule_gaps || this.clusterExplanation?.moleculeGaps || [])
      .map((gap) => this._normalizeMoleculeGap(gap));
    this.atomRows = (this.clusterExplanation?.atom_rows || this.clusterExplanation?.atomRows || [])
      .map((row) => this._normalizeAtomRow(row));
    this.hoveredMoleculeId = null;
    this.hoveredAtomId = null;
    this.hoveredAtomSourceIndex = 0;
    this._dirty = true;
  }

  setSelectedRegion(id) {
    this.selectedRegionId = id;
    this._selectedRegion = this.regions.find(r => String(r.id) === String(id)) || null;
    this._dirty = true;
  }

  setSelectedMolecule(id) {
    this.selectedMoleculeId = id || null;
    this._dirty = true;
  }

  setHoveredAtom(id, sourceIndex = 0) {
    this.hoveredAtomId = id || null;
    this.hoveredAtomSourceIndex = Number(sourceIndex || 0);
    this._dirty = true;
  }

  setAnnotationsVisible(visible) {
    this.annotationsVisible = Boolean(visible);
    if (!this.annotationsVisible) {
      this.hoveredMoleculeId = null;
      this.hoveredAtomId = null;
      this.hoveredAtomSourceIndex = 0;
      this.canvas.style.cursor = this.spaceHeld ? 'grab' : 'default';
    } else {
      this._updateCursor();
    }
    this._dirty = true;
  }

  onStrokeCreated(callback) {
    this._onStrokeCreated = callback;
  }

  onParticleStamped(callback) {
    this._onParticleStamped = callback;
  }

  onRegionSelected(callback) {
    this._onRegionSelected = callback;
  }

  onRegionChanged(callback) {
    this._onRegionChanged = callback;
  }

  onMoleculeSelected(callback) {
    this._onMoleculeSelected = callback;
  }

  onRowGuideAdjusted(callback) {
    this._onRowGuideAdjusted = callback;
  }

  onMoleculeGapAction(callback) {
    this._onMoleculeGapAction = callback;
  }

  setDrawMode(mode, options = {}) {
    this.drawMode = mode === 'stroke' ? 'stroke' : 'select';
    this.strokeColor = options.color || this.strokeColor;
    this.forceDraw = this.drawMode === 'stroke' && Boolean(options.forceDraw);
    this._updateCursor();
    this._dirty = true;
  }

  setParticlePreview(preview) {
    this.particlePreview = preview || null;
    this._dirty = true;
  }

  getZoomLevel() {
    return this.zoom;
  }

  zoomIn() {
    this._zoomBy(1.25, this.canvas.width / 2, this.canvas.height / 2);
  }

  zoomOut() {
    this._zoomBy(0.8, this.canvas.width / 2, this.canvas.height / 2);
  }

  resetZoom() {
    if (this.image) {
      this._fitImageToView();
    } else {
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
    }
    this._dirty = true;
  }

  focusBox(box, options = {}) {
    if (!box || !this.image || !this._canvasW || !this._canvasH) return;
    const padding = Number(options.padding ?? 84);
    const boxW = Math.max(Number(box.w || 0), 20);
    const boxH = Math.max(Number(box.h || 0), 20);
    const fitZoom = Math.min(
      (this._canvasW - padding * 2) / boxW,
      (this._canvasH - padding * 2) / boxH
    );
    if (Number.isFinite(fitZoom) && fitZoom > 0) {
      const minFocusZoom = Number(options.minZoom ?? 0.85);
      const maxFocusZoom = Number(options.maxZoom ?? 3.2);
      this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, Math.max(minFocusZoom, Math.min(fitZoom, maxFocusZoom))));
    }
    const centerX = Number(box.x || 0) + boxW / 2;
    const centerY = Number(box.y || 0) + boxH / 2;
    this.panX = this._canvasW / 2 - centerX * this.zoom;
    this.panY = this._canvasH / 2 - centerY * this.zoom;
    this._dirty = true;
  }

  destroy() {
    this._detachEvents();
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  // Internal: Setup

  _setupCanvas() {
    this._resizeCanvas();
  }

  _resizeCanvas() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._canvasW = rect.width;
    this._canvasH = rect.height;
    this._dirty = true;
  }

  _fitImageToView() {
    if (!this.image) return;
    const padFraction = 0.9;
    const scaleX = (this._canvasW * padFraction) / this.imageWidth;
    const scaleY = (this._canvasH * padFraction) / this.imageHeight;
    this.zoom = Math.min(scaleX, scaleY, 2);
    this.panX = (this._canvasW - this.imageWidth * this.zoom) / 2;
    this.panY = (this._canvasH - this.imageHeight * this.zoom) / 2;
  }

  _attachEvents() {
    this.canvas.addEventListener('mousedown', this._handleMouseDown);
    this.canvas.addEventListener('mousemove', this._handleMouseMove);
    this.canvas.addEventListener('mouseup', this._handleMouseUp);
    this.canvas.addEventListener('wheel', this._handleWheel, { passive: false });
    this.canvas.addEventListener('contextmenu', this._handleContextMenu);
    window.addEventListener('keydown', this._handleKeyDown);
    window.addEventListener('keyup', this._handleKeyUp);
    window.addEventListener('resize', this._handleResize);
  }

  _detachEvents() {
    this.canvas.removeEventListener('mousedown', this._handleMouseDown);
    this.canvas.removeEventListener('mousemove', this._handleMouseMove);
    this.canvas.removeEventListener('mouseup', this._handleMouseUp);
    this.canvas.removeEventListener('wheel', this._handleWheel);
    this.canvas.removeEventListener('contextmenu', this._handleContextMenu);
    window.removeEventListener('keydown', this._handleKeyDown);
    window.removeEventListener('keyup', this._handleKeyUp);
    window.removeEventListener('resize', this._handleResize);
  }

  _handleContextMenu(e) {
    e.preventDefault();
  }

  // Coordinate Conversion

  /** Screen pixel position to image coordinates */
  _screenToImage(sx, sy) {
    return {
      x: (sx - this.panX) / this.zoom,
      y: (sy - this.panY) / this.zoom,
    };
  }

  /** Image coordinates to screen pixel position */
  _imageToScreen(ix, iy) {
    return {
      x: ix * this.zoom + this.panX,
      y: iy * this.zoom + this.panY,
    };
  }

  /** Get mouse pos relative to canvas from event */
  _getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // Input Handlers

  _handleMouseDown(e) {
    const pos = this._getMousePos(e);
    this.lastMousePos = pos;

    // Middle-click pan
    if (e.button === 1) {
      e.preventDefault();
      this._startPan(pos);
      return;
    }

    // Space+left-click pan
    if (e.button === 0 && this.spaceHeld) {
      this._startPan(pos);
      return;
    }

    if (e.button === 0 && this.image) {
      const imgPos = this._screenToImage(pos.x, pos.y);

      if (!this.annotationsVisible) return;

      const rowEdgeHit = this.rowEditMode ? this._hitTestRowGuide(pos.x, pos.y, false) : null;
      if (rowEdgeHit) {
        e.preventDefault();
        this.activeRowDrag = {
          rowIndex: rowEdgeHit.row.rowIndex,
          edge: rowEdgeHit.edge,
          startImageY: imgPos.y,
          originalY: rowEdgeHit.row.y,
          originalTopY: rowEdgeHit.row.topY,
          originalBottomY: rowEdgeHit.row.bottomY,
        };
        this._dirty = true;
        return;
      }

      if (this.forceDraw && this.drawMode === 'stroke') {
        e.preventDefault();
        this._startStroke(imgPos);
        return;
      }

      const gapHit = this.drawMode === 'stroke' || !this.rowEditMode ? null : this._hitTestMoleculeGap(imgPos.x, imgPos.y);
      if (gapHit) {
        e.preventDefault();
        this._onMoleculeGapAction?.(gapHit);
        return;
      }

      const rowBandHit = this.rowEditMode ? this._hitTestRowGuide(pos.x, pos.y, true) : null;
      if (rowBandHit) {
        e.preventDefault();
        this.activeRowDrag = {
          rowIndex: rowBandHit.row.rowIndex,
          edge: rowBandHit.edge,
          startImageY: imgPos.y,
          originalY: rowBandHit.row.y,
          originalTopY: rowBandHit.row.topY,
          originalBottomY: rowBandHit.row.bottomY,
        };
        this._dirty = true;
        return;
      }

      const handleHit = this._hitTestHandle(pos.x, pos.y);
      if (handleHit) {
        this._startTransform(handleHit.handle === 'rotate' ? 'rotate' : 'resize', handleHit.region, imgPos, handleHit.handle);
        return;
      }

      const hit = this._hitTestRegion(imgPos.x, imgPos.y);

      if (hit) {
        if (this.batchDeleteMode) {
          this._onRegionSelected?.(hit.id);
          return;
        }

        if (String(hit.id) === String(this.selectedRegionId)) {
          this._startTransform('move', hit, imgPos, null);
          return;
        }

        if (this._onRegionSelected) {
          this._onRegionSelected(hit.id);
        }
      } else {
        const moleculeHit = this._hitTestMolecule(imgPos.x, imgPos.y);
        if (moleculeHit) {
          this.selectedMoleculeId = moleculeHit.id;
          this._dirty = true;
          this._onMoleculeSelected?.(moleculeHit.id);
          return;
        }

        if (this.selectedRegionId !== null) {
          this.selectedRegionId = null;
          this._selectedRegion = null;
          this._dirty = true;
          if (this._onRegionSelected) {
            this._onRegionSelected(null);
          }
        }
      }
    }
  }

  _handleMouseMove(e) {
    const pos = this._getMousePos(e);
    this.lastMousePos = pos;
    if (this.particlePreview) this._dirty = true;

    if (this.isPanning) {
      const dx = pos.x - this.panStartMouse.x;
      const dy = pos.y - this.panStartMouse.y;
      this.panX = this.panStartOffset.x + dx;
      this.panY = this.panStartOffset.y + dy;
      this._dirty = true;
      return;
    }

    if (this.isDrawing) {
      if (this.drawMode === 'stroke') {
        e.preventDefault();
        this._appendStrokePointFromEvent(e);
      }
      this._dirty = true;
      return;
    }

    if (this.activeRowDrag) {
      e.preventDefault();
      const imgPos = this._screenToImage(pos.x, pos.y);
      const deltaY = imgPos.y - this.activeRowDrag.startImageY;
      const row = this.atomRows.find((item) => Number(item.rowIndex) === Number(this.activeRowDrag.rowIndex));
      if (row) {
        if (this.activeRowDrag.edge === 'top') {
          row.topY = Math.min(this.activeRowDrag.originalTopY + deltaY, row.bottomY - 1);
          const previousRow = this.atomRows.find((item) => Number(item.rowIndex) === Number(this.activeRowDrag.rowIndex) - 1);
          if (previousRow) {
            previousRow.bottomY = row.topY;
            previousRow.y = (previousRow.topY + previousRow.bottomY) / 2;
            previousRow.h = previousRow.bottomY - previousRow.topY;
          }
        } else if (this.activeRowDrag.edge === 'bottom') {
          row.bottomY = Math.max(this.activeRowDrag.originalBottomY + deltaY, row.topY + 1);
          const nextRow = this.atomRows.find((item) => Number(item.rowIndex) === Number(this.activeRowDrag.rowIndex) + 1);
          if (nextRow) {
            nextRow.topY = row.bottomY;
            nextRow.y = (nextRow.topY + nextRow.bottomY) / 2;
            nextRow.h = nextRow.bottomY - nextRow.topY;
          }
        } else if (this.activeRowDrag.edge === 'center') {
          row.topY = this.activeRowDrag.originalTopY + deltaY;
          row.bottomY = this.activeRowDrag.originalBottomY + deltaY;
          const previousRow = this.atomRows.find((item) => Number(item.rowIndex) === Number(this.activeRowDrag.rowIndex) - 1);
          if (previousRow) {
            previousRow.bottomY = row.topY;
            previousRow.y = (previousRow.topY + previousRow.bottomY) / 2;
            previousRow.h = previousRow.bottomY - previousRow.topY;
          }
          const nextRow = this.atomRows.find((item) => Number(item.rowIndex) === Number(this.activeRowDrag.rowIndex) + 1);
          if (nextRow) {
            nextRow.topY = row.bottomY;
            nextRow.y = (nextRow.topY + nextRow.bottomY) / 2;
            nextRow.h = nextRow.bottomY - nextRow.topY;
          }
        }
        row.y = (row.topY + row.bottomY) / 2;
        row.h = row.bottomY - row.topY;
      }
      this._dirty = true;
      return;
    }

    if (this.isTransforming) {
      this._updateTransform(this._screenToImage(pos.x, pos.y));
      return;
    }

    if (this.image) {
      if (!this.annotationsVisible) {
        if (this.hoveredMoleculeId || this.hoveredAtomId || this.hoveredAtomSourceIndex) {
          this.hoveredMoleculeId = null;
          this.hoveredAtomId = null;
          this.hoveredAtomSourceIndex = 0;
          this._dirty = true;
        }
        this.canvas.style.cursor = this.spaceHeld ? 'grab' : 'default';
        return;
      }
      const imgPos = this._screenToImage(pos.x, pos.y);
      const rowEdgeHit = this.rowEditMode ? this._hitTestRowGuide(pos.x, pos.y, false) : null;
      if (rowEdgeHit) {
        this.canvas.style.cursor = 'ns-resize';
        return;
      }
      const gapHit = this.rowEditMode ? this._hitTestMoleculeGap(imgPos.x, imgPos.y) : null;
      if (gapHit && this.drawMode !== 'stroke') {
        this.canvas.style.cursor = 'pointer';
        return;
      }
      const rowBandHit = this.rowEditMode ? this._hitTestRowGuide(pos.x, pos.y, true) : null;
      if (rowBandHit) {
        this.canvas.style.cursor = rowBandHit.edge === 'center' ? 'move' : 'ns-resize';
        return;
      }
      const hoveredMolecule = this._hitTestMolecule(imgPos.x, imgPos.y);
      const nextHoveredMoleculeId = hoveredMolecule?.id || null;
      if (String(nextHoveredMoleculeId || '') !== String(this.hoveredMoleculeId || '')) {
        this.hoveredMoleculeId = nextHoveredMoleculeId;
        this._dirty = true;
      }

      const handleHit = this._hitTestHandle(pos.x, pos.y);
      if (handleHit) {
        this.canvas.style.cursor = this._cursorForHandle(handleHit.handle);
        return;
      }
      const hit = this._hitTestRegion(imgPos.x, imgPos.y);
      if (hit && String(hit.id) === String(this.selectedRegionId)) {
        this.canvas.style.cursor = 'move';
      } else {
        this.canvas.style.cursor = hit || hoveredMolecule ? 'pointer' : 'crosshair';
      }
    }
  }

  _handleMouseUp(e) {
    if (this.activeRowDrag) {
      const pos = this._getMousePos(e);
      const imgPos = this._screenToImage(pos.x, pos.y);
      const deltaY = imgPos.y - this.activeRowDrag.startImageY;
      const drag = this.activeRowDrag;
      this.activeRowDrag = null;
      if (Math.abs(deltaY) > 0.25) {
        this._onRowGuideAdjusted?.(drag.rowIndex, drag.edge, deltaY);
      }
      this._dirty = true;
      return;
    }

    if (this.isPanning) {
      this._endPan();
      return;
    }

    if (this.isDrawing) {
      if (this.drawMode === 'stroke') {
        e.preventDefault();
        this._appendStrokePointFromEvent(e);
        this._finishStroke();
        return;
      }
    }

    if (this.isTransforming) {
      this._finishTransform();
    }
  }

  _handleWheel(e) {
    e.preventDefault();
    const pos = this._getMousePos(e);
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    this._zoomBy(factor, pos.x, pos.y);
  }

  _handleKeyDown(e) {
    // Ignore if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

    if (e.key.toLowerCase() === 'h' && this.drawMode === 'stroke' && this.forceDraw && this.image && this.annotationsVisible) {
      e.preventDefault();
      if (this.keyboardStrokeHeld || this.isDrawing) return;
      if (!this.lastMousePos || !this._isPointInsideCanvas(this.lastMousePos)) return;

      this.keyboardStrokeHeld = true;
      this._startStroke(this._screenToImage(this.lastMousePos.x, this.lastMousePos.y));
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      this.spaceHeld = true;
      this._updateCursor();
    }
  }

  _handleKeyUp(e) {
    if (e.key.toLowerCase() === 'h') {
      if (this.keyboardStrokeHeld && this.isDrawing && this.drawMode === 'stroke') {
        e.preventDefault();
        this.keyboardStrokeHeld = false;
        this._finishStroke();
      }
      return;
    }

    if (e.code === 'Space') {
      this.spaceHeld = false;
      if (this.isPanning) {
        this._endPan();
      }
      this._updateCursor();
    }
  }

  _handleResize() {
    this._resizeCanvas();
    if (this.image) {
      this._dirty = true;
    }
  }

  // Helpers

  _startPan(pos) {
    this.isPanning = true;
    this.panStartMouse = { x: pos.x, y: pos.y };
    this.panStartOffset = { x: this.panX, y: this.panY };
    this.canvas.parentElement.classList.add('canvas-container--panning');
  }

  _endPan() {
    this.isPanning = false;
    this.canvas.parentElement.classList.remove('canvas-container--panning');
  }

  _zoomBy(factor, centerX, centerY) {
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * factor));
    if (newZoom === this.zoom) return;

    // Zoom centered on mouse position
    const imgBefore = this._screenToImage(centerX, centerY);
    this.zoom = newZoom;
    const screenAfter = this._imageToScreen(imgBefore.x, imgBefore.y);
    this.panX += centerX - screenAfter.x;
    this.panY += centerY - screenAfter.y;

    this._dirty = true;
  }

  _updateCursor() {
    if (!this.annotationsVisible) {
      this.canvas.style.cursor = this.spaceHeld ? 'grab' : 'default';
      return;
    }
    if (this.spaceHeld) {
      this.canvas.style.cursor = 'grab';
    } else {
      this.canvas.style.cursor = 'crosshair';
    }
  }

  _startStroke(imgPos) {
    const point = { x: Math.round(imgPos.x), y: Math.round(imgPos.y) };
    this.isDrawing = true;
    this.strokePoints = [point];
    window.addEventListener('mousemove', this._handleStrokeWindowMove, { passive: false });
    window.addEventListener('mouseup', this._handleStrokeWindowUp, { passive: false });
    this._dirty = true;
  }

  _appendStrokePointFromEvent(event) {
    const pos = this._getMousePos(event);
    const point = this._screenToImage(pos.x, pos.y);
    const next = { x: Math.round(point.x), y: Math.round(point.y) };
    const previous = this.strokePoints[this.strokePoints.length - 1];
    if (previous && previous.x === next.x && previous.y === next.y) return;
    this.strokePoints.push(next);
  }

  _handleStrokeWindowMove(event) {
    if (!this.isDrawing || this.drawMode !== 'stroke') return;
    if (event.buttons === 0 && !this.keyboardStrokeHeld) {
      this._finishStroke();
      return;
    }
    event.preventDefault();
    this._appendStrokePointFromEvent(event);
    this._dirty = true;
  }

  _handleStrokeWindowUp(event) {
    if (!this.isDrawing || this.drawMode !== 'stroke') return;
    if (this.keyboardStrokeHeld) return;
    event.preventDefault();
    this._appendStrokePointFromEvent(event);
    this._finishStroke();
  }

  _finishStroke() {
    const wasKeyboardStroke = this.keyboardStrokeHeld;
    this.keyboardStrokeHeld = false;
    const points = this._simplifyStrokePoints(this.strokePoints);
    const shouldStampParticle = this.particlePreview && points.length <= 1 && !wasKeyboardStroke;
    const stampPoint = points[0];
    if (points.length === 1) {
      points.push({ x: points[0].x + 1, y: points[0].y + 1 });
    }
    this.isDrawing = false;
    this.strokePoints = [];
    window.removeEventListener('mousemove', this._handleStrokeWindowMove);
    window.removeEventListener('mouseup', this._handleStrokeWindowUp);

    if (shouldStampParticle && stampPoint && this._onParticleStamped) {
      const stampedPoints = this._previewPointsAtCursor(this.particlePreview, stampPoint)
        .map((point) => ({ x: Math.round(point.x), y: Math.round(point.y) }));
      this._onParticleStamped({
        points: stampedPoints,
        color: this.particlePreview.color || this.strokeColor,
        width: 3,
      });
      this._dirty = true;
      return;
    }

    if (points.length >= 2 && this._onStrokeCreated) {
      this._onStrokeCreated({
        points,
        color: this.strokeColor,
        width: 3,
      });
    }

    this._dirty = true;
  }

  _startTransform(kind, region, imgPos, handle) {
    this.isTransforming = true;
    this.transformKind = kind;
    this.transformHandle = handle;
    this.transformRegion = region;
    this.transformStartMouse = imgPos;
    this.transformStartRegion = {
      ...region,
      points: Array.isArray(region.points) ? region.points.map((point) => ({ ...point })) : [],
      bounds: this._regionBounds(region),
    };
    this._dirty = true;
  }

  _updateTransform(imgPos) {
    if (!this.transformRegion || !this.transformStartRegion || !this.transformStartMouse) return;

    const dx = imgPos.x - this.transformStartMouse.x;
    const dy = imgPos.y - this.transformStartMouse.y;
    const start = this.transformStartRegion;
    const region = this.transformRegion;

    if (this.transformKind === 'move') {
      region.points = (start.points || []).map((point) => ({
        x: Math.round(point.x + dx),
        y: Math.round(point.y + dy),
      }));
    } else if (this.transformKind === 'resize') {
      const startBox = start.bounds || this._regionBounds(start);
      let x1 = startBox.x;
      let y1 = startBox.y;
      let x2 = startBox.x + startBox.w;
      let y2 = startBox.y + startBox.h;

      if (this.transformHandle.includes('w')) x1 = startBox.x + dx;
      if (this.transformHandle.includes('e')) x2 = startBox.x + startBox.w + dx;
      if (this.transformHandle.includes('n')) y1 = startBox.y + dy;
      if (this.transformHandle.includes('s')) y2 = startBox.y + startBox.h + dy;

      const nx = Math.min(x1, x2);
      const ny = Math.min(y1, y2);
      const nw = Math.abs(x2 - x1);
      const nh = Math.abs(y2 - y1);

      region.points = this._scalePointsToBox(start.points || [], startBox, {
        x: nx,
        y: ny,
        w: Math.max(6, nw),
        h: Math.max(6, nh),
      });
    } else if (this.transformKind === 'rotate') {
      const startBox = start.bounds || this._regionBounds(start);
      const center = {
        x: startBox.x + startBox.w / 2,
        y: startBox.y + startBox.h / 2,
      };
      const startAngle = Math.atan2(this.transformStartMouse.y - center.y, this.transformStartMouse.x - center.x);
      const nextAngle = Math.atan2(imgPos.y - center.y, imgPos.x - center.x);
      const angle = nextAngle - startAngle;
      region.closed = false;
      region.points = this._rotatePoints(this._pointsForTransform(start), center, angle);
    }

    this._dirty = true;
  }

  _finishTransform() {
    const region = this.transformRegion;
    this.isTransforming = false;
    this.transformKind = null;
    this.transformHandle = null;
    this.transformRegion = null;
    this.transformStartMouse = null;
    this.transformStartRegion = null;

    if (region && this._onRegionChanged) {
      this._onRegionChanged(region.id, {
        points: region.points || [],
        color: region.color,
        width: region.width || 3,
        closed: Boolean(region.closed),
      });
    }

    this._dirty = true;
  }

  // Hit Testing

  _hitTestRegion(imgX, imgY) {
    if (!this.annotationsVisible) return null;
    const tolerance = Math.max(8 / this.zoom, 2);
    for (let i = this.regions.length - 1; i >= 0; i--) {
      const r = this.regions[i];
      if (!this._boxContainsPoint(r.bounds, imgX, imgY, tolerance)) continue;
      if (this._hitTestPolygonRegion(r, imgX, imgY)) {
        return r;
      }
    }

    return null;
  }

  _hitTestMolecule(imgX, imgY) {
    if (!this.annotationsVisible) return null;
    let best = null;
    for (const molecule of this.molecules) {
      if (
        imgX >= molecule.x &&
        imgX <= molecule.x + molecule.w &&
        imgY >= molecule.y &&
        imgY <= molecule.y + molecule.h
      ) {
        if (!best || molecule.w * molecule.h < best.w * best.h) {
          best = molecule;
        }
      }
    }
    return best;
  }

  _hitTestMoleculeGap(imgX, imgY) {
    if (!this.annotationsVisible) return null;
    if (!this.moleculeGaps.length) return null;
    const tolerance = Math.max(4, 9 / Math.max(this.zoom, 0.1));
    let best = null;
    let bestDistance = Infinity;

    for (const gap of this.moleculeGaps) {
      const row = this.atomRows.find((item) => Number(item.rowIndex) === Number(gap.rowIndex));
      const topY = row?.topY ?? (gap.y - 22);
      const bottomY = row?.bottomY ?? (gap.y + 22);
      const minY = Math.min(topY, bottomY) - tolerance;
      const maxY = Math.max(topY, bottomY) + tolerance;
      if (imgY < minY || imgY > maxY) continue;

      const distance = Math.abs(imgX - Number(gap.x || 0));
      if (distance <= tolerance && distance < bestDistance) {
        best = gap;
        bestDistance = distance;
      }
    }

    return best;
  }

  _hitTestRowGuide(screenX, screenY, includeBand = false) {
    if (!this.annotationsVisible) return null;
    if (!this.atomRows.length) return null;
    const tolerance = 7;
    let best = null;
    const left = this._imageToScreen(0, 0).x;
    const right = this._imageToScreen(this.imageWidth || 0, 0).x;
    if (screenX < Math.min(left, right) || screenX > Math.max(left, right)) return null;

    for (const row of this.atomRows) {
      const top = this._imageToScreen(0, row.topY).y;
      const bottom = this._imageToScreen(0, row.bottomY).y;
      const topDelta = Math.abs(screenY - top);
      const bottomDelta = Math.abs(screenY - bottom);
      if (topDelta <= tolerance && (!best || topDelta < best.delta)) {
        best = { row, edge: 'top', delta: topDelta };
      }
      if (bottomDelta <= tolerance && (!best || bottomDelta < best.delta)) {
        best = { row, edge: 'bottom', delta: bottomDelta };
      }
      if (
        includeBand &&
        !best &&
        screenY > Math.min(top, bottom) + tolerance &&
        screenY < Math.max(top, bottom) - tolerance
      ) {
        best = { row, edge: 'center', delta: 0 };
      }
    }
    return best;
  }

  _hitTestHandle(screenX, screenY) {
    if (!this.annotationsVisible) return null;
    const selected = this._selectedRegion;
    if (!selected) return null;

    const handles = this._regionHandles(selected);
    for (const handle of handles) {
      if (
        screenX >= handle.x - 6 &&
        screenX <= handle.x + 6 &&
        screenY >= handle.y - 6 &&
        screenY <= handle.y + 6
      ) {
        return { region: selected, handle: handle.name };
      }
    }

    return null;
  }

  _regionHandles(region) {
    const bounds = this._regionBounds(region);
    const tl = this._imageToScreen(bounds.x, bounds.y);
    const br = this._imageToScreen(bounds.x + bounds.w, bounds.y + bounds.h);
    const tc = this._imageToScreen(bounds.x + bounds.w / 2, bounds.y);
    return [
      { name: 'nw', x: tl.x, y: tl.y },
      { name: 'ne', x: br.x, y: tl.y },
      { name: 'sw', x: tl.x, y: br.y },
      { name: 'se', x: br.x, y: br.y },
      { name: 'rotate', x: tc.x, y: tc.y - 24 },
    ];
  }

  _cursorForHandle(handle) {
    if (handle === 'rotate') return 'grab';
    if (handle === 'nw' || handle === 'se') return 'nwse-resize';
    return 'nesw-resize';
  }

  // Render Loop

  _startRenderLoop() {
    this._rafId = requestAnimationFrame(this._renderLoop);
  }

  _renderLoop(timestamp) {
    if (this._dirty) {
      this._render();
      this._dirty = false;
    }

    this._rafId = requestAnimationFrame(this._renderLoop);
  }

  _render() {
    const ctx = this.ctx;
    const cw = this._canvasW;
    const ch = this._canvasH;

    // Clear
    ctx.clearRect(0, 0, cw, ch);

    if (!this.image) {
      return;
    }

    // Draw image
    ctx.save();
    ctx.imageSmoothingEnabled = this.zoom < 2;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
      this.image,
      this.panX, this.panY,
      this.imageWidth * this.zoom,
      this.imageHeight * this.zoom
    );
    ctx.restore();

    const viewport = this._visibleImageBounds();
    if (this.annotationsVisible) {
      this._drawHierarchy(ctx, viewport);
      for (const region of this.regions) {
        const isSelected = String(region.id) === String(this.selectedRegionId);
        const isDeletePending = this.pendingDeleteRegionIds.has(String(region.id));
        if (!isSelected && !this._boxIntersects(region.bounds, viewport)) continue;
        this._drawRegion(
          ctx,
          region,
          isSelected,
          isDeletePending
        );
      }
      for (const region of this.pendingPaintRegions) {
        if (!this._boxIntersects(region.bounds, viewport)) continue;
        this._drawPendingPaintRegion(ctx, region);
      }

      if (this.isDrawing && this.drawMode === 'stroke') {
        this._drawStrokePreview(ctx);
      } else if (this.forceDraw && this.drawMode === 'stroke' && this.particlePreview && this.lastMousePos) {
        this._drawParticlePreview(ctx);
      }
    }
  }

  _drawRegion(ctx, region, isSelected, isDeletePending = false) {
    this._drawPolygonRegion(ctx, region, isSelected, false, isDeletePending);
  }

  _drawPendingPaintRegion(ctx, region) {
    ctx.save();
    ctx.globalAlpha = 0.88;
    ctx.setLineDash([7, 4]);
    this._drawPolygonRegion(ctx, region, false, true);
    ctx.restore();
  }

  _drawHierarchy(ctx, viewport) {
    this._drawAtomRows(ctx, viewport);
    this._drawClusterLinks(ctx, viewport);
    this._drawMoleculeGapAudit(ctx, viewport);

    const isHoveredAtom = (atom) => (
      String(atom.id) === String(this.hoveredAtomId)
      || (this.hoveredAtomSourceIndex > 0 && Number(atom.sourceIndex) === Number(this.hoveredAtomSourceIndex))
    );

    for (const atom of this.atoms) {
      if (!this._boxIntersects(atom, viewport)) continue;
      const isHovered = isHoveredAtom(atom);
      this._drawHierarchyBox(ctx, atom, {
        stroke: isHovered ? 'rgba(88, 255, 190, 1)' : 'rgba(88, 210, 164, 0.34)',
        fill: isHovered ? 'rgba(88, 255, 190, 0.22)' : 'rgba(88, 210, 164, 0.035)',
        dash: isHovered ? [] : [3, 5],
        lineWidth: isHovered ? 3.4 : 1,
        inset: isHovered ? 5 : 1,
        glow: isHovered ? 18 : 0,
      });
    }

    for (const molecule of this.molecules) {
      if (!this._boxIntersects(molecule, viewport)) continue;
      const isHovered = String(molecule.id) === String(this.hoveredMoleculeId);
      const isSelected = String(molecule.id) === String(this.selectedMoleculeId);
      this._drawHierarchyBox(ctx, molecule, {
        stroke: isSelected ? 'rgba(255, 210, 96, 0.98)' : isHovered ? 'rgba(255, 210, 96, 0.95)' : 'rgba(100, 180, 220, 0.58)',
        fill: isSelected ? 'rgba(255, 210, 96, 0.16)' : isHovered ? 'rgba(255, 210, 96, 0.10)' : 'rgba(100, 180, 220, 0.045)',
        dash: isSelected || isHovered ? [8, 4] : [7, 6],
        lineWidth: isSelected ? 2.6 : isHovered ? 2.25 : 1.35,
        inset: 3,
        glow: isHovered ? 8 : 0,
      });
    }

    const hoveredAtom = this.atoms.find(isHoveredAtom);
    if (hoveredAtom) {
      this._drawHierarchyBox(ctx, hoveredAtom, {
        stroke: 'rgba(88, 255, 190, 1)',
        fill: 'rgba(88, 255, 190, 0.28)',
        dash: [],
        lineWidth: 4.2,
        inset: 7,
        glow: 24,
      });
    }
  }

  _drawAtomRows(ctx, viewport) {
    if (!this.atomRows.length) return;

    ctx.save();
    ctx.font = '800 11px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (const row of this.atomRows) {
      if (viewport && (row.bottomY < viewport.y || row.topY > viewport.y + viewport.h)) continue;
      const bandLeftX = 0;
      const bandRightX = this.imageWidth || row.x + row.w;
      const tl = this._imageToScreen(row.x - 12, row.y - 8);
      const br = this._imageToScreen(row.x + row.w + 12, row.y + row.h + 8);
      const bandTop = this._imageToScreen(bandLeftX, row.topY);
      const bandBottom = this._imageToScreen(bandRightX, row.bottomY);

      ctx.fillStyle = 'rgba(255, 210, 96, 0.055)';
      ctx.strokeStyle = 'rgba(255, 210, 96, 0.78)';
      ctx.lineWidth = 1;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.rect(bandTop.x, bandTop.y, bandBottom.x - bandTop.x, bandBottom.y - bandTop.y);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      if (row.w > 0 && row.h > 0) {
        ctx.beginPath();
        ctx.rect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        ctx.stroke();
      }

      const label = `R${row.rowIndex} · ${row.atomCount}p`;
      const labelW = Math.max(44, label.length * 7);
      const labelY = bandTop.y - 18;
      ctx.fillStyle = 'rgba(10, 10, 15, 0.78)';
      this._roundRect(ctx, bandTop.x + 6, labelY, labelW, 16, 4);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 226, 146, 0.96)';
      ctx.fillText(label, bandTop.x + 11, labelY + 8);
    }

    ctx.restore();
  }

  _drawClusterLinks(ctx, viewport) {
    const links = this.clusterExplanation?.links || [];
    if (!links.length || !this.particles.length) return;

    ctx.save();
    ctx.lineCap = 'round';

    for (const link of links) {
      const accepted = Boolean(link.accepted);
      if (!accepted) continue;

      const particleA = this._particlesById.get(String(link.particle_id_a ?? link.particleIdA));
      const particleB = this._particlesById.get(String(link.particle_id_b ?? link.particleIdB));
      if (!particleA || !particleB) continue;
      if (viewport && !this._boxIntersects(particleA, viewport) && !this._boxIntersects(particleB, viewport)) continue;

      const a = this._imageToScreen(particleA.x + particleA.w / 2, particleA.y + particleA.h / 2);
      const b = this._imageToScreen(particleB.x + particleB.w / 2, particleB.y + particleB.h / 2);
      const stage = link.stage || 'molecule';

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = stage === 'atom'
        ? 'rgba(88, 210, 164, 0.50)'
        : 'rgba(100, 180, 220, 0.50)';
      ctx.lineWidth = stage === 'atom' ? 1.35 : 2.1;
      ctx.setLineDash(stage === 'atom' ? [2, 4] : []);
      ctx.stroke();
    }

    ctx.restore();
  }

  _drawMoleculeGapAudit(ctx, viewport) {
    if (!this.moleculeGaps.length) return;

    ctx.save();

    for (const gap of this.moleculeGaps) {
      const row = this.atomRows.find((item) => Number(item.rowIndex) === Number(gap.rowIndex));
      const topY = row?.topY ?? (gap.y - 22);
      const bottomY = row?.bottomY ?? (gap.y + 22);
      if (viewport && (
        bottomY < viewport.y ||
        topY > viewport.y + viewport.h ||
        gap.x < viewport.x ||
        gap.x > viewport.x + viewport.w
      )) continue;
      const top = this._imageToScreen(gap.x, topY);
      const bottom = this._imageToScreen(gap.x, bottomY);
      const center = this._imageToScreen(gap.x, gap.y);
      const isManual = Boolean(gap.overrideDecision);
      const color = isManual ? 'rgba(255, 95, 31, 0.96)' : gap.cut ? 'rgba(255, 210, 96, 0.92)' : 'rgba(88, 210, 164, 0.78)';
      const fill = isManual ? 'rgba(255, 95, 31, 0.18)' : gap.cut ? 'rgba(255, 210, 96, 0.16)' : 'rgba(88, 210, 164, 0.13)';

      ctx.fillStyle = fill;
      ctx.fillRect(center.x - 4, top.y, 8, bottom.y - top.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = isManual ? 3 : gap.cut ? 2.4 : 1.4;
      ctx.setLineDash(gap.cut ? [] : [3, 5]);
      ctx.beginPath();
      ctx.moveTo(center.x, top.y);
      ctx.lineTo(center.x, bottom.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  _drawHierarchyBox(ctx, box, style) {
    if (!box || box.w <= 0 || box.h <= 0) return;
    const tl = this._imageToScreen(box.x - style.inset, box.y - style.inset);
    const br = this._imageToScreen(box.x + box.w + style.inset, box.y + box.h + style.inset);
    const x = tl.x;
    const y = tl.y;
    const w = br.x - tl.x;
    const h = br.y - tl.y;

    ctx.save();
    ctx.setLineDash(style.dash);
    ctx.strokeStyle = style.stroke;
    ctx.fillStyle = style.fill;
    ctx.lineWidth = style.lineWidth;
    ctx.shadowColor = style.stroke;
    ctx.shadowBlur = Number(style.glow ?? 0);
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  _drawPolygonRegion(ctx, region, isSelected, isHighlighted, isDeletePending = false) {
    const points = region.points || [];
    if (points.length < 2) return;

    const color = isDeletePending ? '#ff4d6d' : (region.color || STROKE_STYLE.border);
    const isClosed = Boolean(region.closed);
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = isSelected || isHighlighted || isDeletePending ? 5 : 3;
    ctx.shadowColor = color;
    ctx.shadowBlur = isSelected || isHighlighted || isDeletePending ? 12 : 0;
    if (isDeletePending) ctx.setLineDash([8, 5]);

    if (isClosed) {
      this._drawClosedPolygonPath(ctx, points);
      ctx.fillStyle = isSelected || isHighlighted || isDeletePending
        ? STROKE_STYLE.selectedFill
        : `rgba(${this._hexToRgb(color)}, 0.14)`;
      ctx.fill();
      ctx.stroke();
    } else {
      this._drawSmoothStrokePath(ctx, points);
    }

    if (isSelected) {
      const bounds = this._pointsBounds(points);
      const tl = this._imageToScreen(bounds.x, bounds.y);
      const br = this._imageToScreen(bounds.x + bounds.w, bounds.y + bounds.h);
      this._drawHandles(ctx, tl.x, tl.y, br.x - tl.x, br.y - tl.y, color, true);
    }
    ctx.restore();
  }

  _drawHandles(ctx, sx, sy, sw, sh, color, includeRotate = false) {
    const points = [
      [sx, sy],
      [sx + sw, sy],
      [sx, sy + sh],
      [sx + sw, sy + sh],
    ];

    ctx.save();
    ctx.fillStyle = '#101018';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;

    for (const [x, y] of points) {
      ctx.beginPath();
      ctx.rect(x - 5, y - 5, 10, 10);
      ctx.fill();
      ctx.stroke();
    }

    if (includeRotate) {
      const rx = sx + sw / 2;
      const ry = sy - 24;
      ctx.beginPath();
      ctx.moveTo(sx + sw / 2, sy);
      ctx.lineTo(rx, ry);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }

  _drawStrokePreview(ctx) {
    if (this.strokePoints.length < 2) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.strokeColor;
    ctx.lineWidth = 4;
    ctx.shadowColor = this.strokeColor;
    ctx.shadowBlur = 10;

    this._drawSmoothStrokePath(ctx, this.strokePoints);
    ctx.restore();
  }

  _drawParticlePreview(ctx) {
    if (!this.particlePreview || !this.lastMousePos || !this._isPointInsideCanvas(this.lastMousePos)) return;
    const cursor = this._screenToImage(this.lastMousePos.x, this.lastMousePos.y);
    const points = this._previewPointsAtCursor(this.particlePreview, cursor);
    if (points.length < 2) return;

    ctx.save();
    ctx.globalAlpha = 0.58;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.particlePreview.color || this.strokeColor;
    ctx.lineWidth = 4;
    ctx.shadowColor = this.particlePreview.color || this.strokeColor;
    ctx.shadowBlur = 12;
    ctx.setLineDash([8, 5]);
    this._drawSmoothStrokePath(ctx, points);
    ctx.setLineDash([]);

    const label = this.particlePreview.config ? String(this.particlePreview.config) : '';
    if (label) {
      const screen = this._imageToScreen(cursor.x, cursor.y);
      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(10, 10, 15, 0.82)';
      this._roundRect(ctx, screen.x + 10, screen.y + 10, 18, 18, 4);
      ctx.fill();
      ctx.fillStyle = this.particlePreview.color || this.strokeColor;
      ctx.fillText(label, screen.x + 16, screen.y + 23);
    }
    ctx.restore();
  }

  _previewPointsAtCursor(preview, cursor) {
    const points = Array.isArray(preview.points) ? preview.points : [];
    if (points.length < 2) return [];
    const bounds = preview.bounds || this._pointsBounds(points);
    const center = {
      x: bounds.x + bounds.w / 2,
      y: bounds.y + bounds.h / 2,
    };
    return points.map((point) => {
      const relX = Number(point.x || 0) - center.x;
      const relY = Number(point.y || 0) - center.y;
      return {
        x: cursor.x + relX,
        y: cursor.y + relY,
      };
    });
  }

  // Helpers

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  _drawSmoothStrokePath(ctx, points) {
    if (!points || points.length < 2) return;

    const first = this._imageToScreen(points[0].x, points[0].y);
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    if (points.length === 2) {
      const second = this._imageToScreen(points[1].x, points[1].y);
      ctx.lineTo(second.x, second.y);
      ctx.stroke();
      return;
    }

    for (let index = 1; index < points.length - 1; index += 1) {
      const current = this._imageToScreen(points[index].x, points[index].y);
      const next = this._imageToScreen(points[index + 1].x, points[index + 1].y);
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;
      ctx.quadraticCurveTo(current.x, current.y, midX, midY);
    }

    const last = this._imageToScreen(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }

  _drawClosedPolygonPath(ctx, points) {
    if (!points || points.length < 2) return;

    const first = this._imageToScreen(points[0].x, points[0].y);
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);

    for (let index = 1; index < points.length; index += 1) {
      const point = this._imageToScreen(points[index].x, points[index].y);
      ctx.lineTo(point.x, point.y);
    }

    ctx.closePath();
  }

  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '138,133,120';
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
  }

  _normalizeBox(item, kind) {
    const id = item?.molecule_id || item?.moleculeId || item?.atom_id || item?.atomId || item?.id;
    return {
      id,
      kind,
      moleculeId: item?.molecule_id || item?.moleculeId || id,
      sourceIndex: Number(item?.source_index ?? item?.sourceIndex ?? 0),
      x: Number(item?.bounds_x ?? item?.boundsX ?? 0),
      y: Number(item?.bounds_y ?? item?.boundsY ?? 0),
      w: Number(item?.bounds_w ?? item?.boundsW ?? 0),
      h: Number(item?.bounds_h ?? item?.boundsH ?? 0),
      particleCount: Number(item?.particle_count ?? item?.particleCount ?? 0),
    };
  }

  _normalizeMoleculeGap(gap) {
    return {
      rowIndex: Number(gap?.row_index ?? gap?.rowIndex ?? 0),
      leftAtomIndex: Number(gap?.left_atom_index ?? gap?.leftAtomIndex ?? 0),
      rightAtomIndex: Number(gap?.right_atom_index ?? gap?.rightAtomIndex ?? 0),
      gap: Number(gap?.gap ?? 0),
      threshold: Number(gap?.threshold ?? 0),
      nextGap: gap?.next_gap ?? gap?.nextGap ?? null,
      baselineDelta: Number(gap?.baseline_delta ?? gap?.baselineDelta ?? 0),
      cut: Boolean(gap?.cut),
      overrideDecision: gap?.override_decision ?? gap?.overrideDecision ?? null,
      reason: gap?.reason || '',
      x: Number(gap?.x ?? 0),
      y: Number(gap?.y ?? 0),
      leftEdge: Number(gap?.left_edge ?? gap?.leftEdge ?? gap?.x ?? 0),
      rightEdge: Number(gap?.right_edge ?? gap?.rightEdge ?? gap?.x ?? 0),
    };
  }

  _normalizeAtomRow(row) {
    return {
      rowIndex: Number(row?.row_index ?? row?.rowIndex ?? 0),
      baselineY: Number(row?.baseline_y ?? row?.baselineY ?? 0),
      displayY: Number(row?.display_y ?? row?.displayY ?? row?.baseline_y ?? row?.baselineY ?? 0),
      topY: Number(row?.top_y ?? row?.topY ?? row?.y ?? 0),
      bottomY: Number(row?.bottom_y ?? row?.bottomY ?? ((row?.y ?? 0) + (row?.h ?? 0))),
      x: Number(row?.x ?? 0),
      y: Number(row?.y ?? 0),
      w: Number(row?.w ?? 0),
      h: Number(row?.h ?? 0),
      atomCount: Number(row?.atom_count ?? row?.atomCount ?? (row?.atoms || []).length),
    };
  }

  _normalizeParticle(particle) {
    return {
      id: particle?.id,
      regionId: particle?.region_id ?? particle?.regionId,
      moleculeId: particle?.molecule_id ?? particle?.moleculeId,
      atomId: particle?.atom_id ?? particle?.atomId,
      family: particle?.family || '',
      x: Number(particle?.bounds_x ?? particle?.boundsX ?? 0),
      y: Number(particle?.bounds_y ?? particle?.boundsY ?? 0),
      w: Number(particle?.bounds_w ?? particle?.boundsW ?? 0),
      h: Number(particle?.bounds_h ?? particle?.boundsH ?? 0),
    };
  }

  _regionBounds(region) {
    if (Array.isArray(region.points) && region.points.length) {
      const bounds = this._pointsBounds(region.points);
      region.bounds = bounds;
      return bounds;
    }
    const bounds = { x: 0, y: 0, w: 0, h: 0 };
    region.bounds = bounds;
    return bounds;
  }

  _pointsForTransform(region) {
    if (Array.isArray(region.points) && region.points.length) {
      return region.points.map((point) => ({ ...point }));
    }
    return [];
  }

  _scalePointsToBox(points, fromBox, toBox) {
    const sx = toBox.w / Math.max(fromBox.w, 1);
    const sy = toBox.h / Math.max(fromBox.h, 1);
    return (points || []).map((point) => ({
      x: Math.round(toBox.x + (point.x - fromBox.x) * sx),
      y: Math.round(toBox.y + (point.y - fromBox.y) * sy),
    }));
  }

  _rotatePoints(points, center, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return (points || []).map((point) => {
      const dx = point.x - center.x;
      const dy = point.y - center.y;
      return {
        x: Math.round(center.x + dx * cos - dy * sin),
        y: Math.round(center.y + dx * sin + dy * cos),
      };
    });
  }

  _pointsBounds(points = []) {
    if (!points.length) return { x: 0, y: 0, w: 0, h: 0 };
    const xs = points.map(point => point.x || 0);
    const ys = points.map(point => point.y || 0);
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    return {
      x,
      y,
      w: Math.max(...xs) - x,
      h: Math.max(...ys) - y,
    };
  }

  _hitTestPolygonRegion(region, imgX, imgY) {
    if (region.closed && this._pointInPolygon(imgX, imgY, region.points || [])) {
      return true;
    }
    return this._hitTestStroke(region, imgX, imgY);
  }

  _hitTestStroke(region, imgX, imgY) {
    const points = region.points || [];
    if (points.length < 2) return false;

    const tolerance = Math.max(6 / this.zoom, 2);
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      if (this._distanceToSegment(imgX, imgY, previous.x, previous.y, current.x, current.y) <= tolerance) {
        return true;
      }
    }

    return false;
  }

  _pointInPolygon(x, y, points = []) {
    if (points.length < 3) return false;
    let inside = false;
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x;
      const yi = points[i].y;
      const xj = points[j].x;
      const yj = points[j].y;
      const intersects = ((yi > y) !== (yj > y))
        && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1) + xi);
      if (intersects) inside = !inside;
    }
    return inside;
  }

  _distanceToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) {
      return Math.hypot(px - x1, py - y1);
    }

    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
    const x = x1 + t * dx;
    const y = y1 + t * dy;
    return Math.hypot(px - x, py - y);
  }

  _isPointInsideCanvas(pos) {
    return pos.x >= 0 && pos.y >= 0 && pos.x <= this._canvasW && pos.y <= this._canvasH;
  }

  _visibleImageBounds() {
    if (!this.image || !this.zoom) return { x: 0, y: 0, w: 0, h: 0 };
    const x1 = Math.max(0, (0 - this.panX) / this.zoom);
    const y1 = Math.max(0, (0 - this.panY) / this.zoom);
    const x2 = Math.min(this.imageWidth, (this._canvasW - this.panX) / this.zoom);
    const y2 = Math.min(this.imageHeight, (this._canvasH - this.panY) / this.zoom);
    const margin = Math.max(32 / this.zoom, 12);
    return {
      x: Math.max(0, x1 - margin),
      y: Math.max(0, y1 - margin),
      w: Math.max(0, Math.min(this.imageWidth, x2 + margin) - Math.max(0, x1 - margin)),
      h: Math.max(0, Math.min(this.imageHeight, y2 + margin) - Math.max(0, y1 - margin)),
    };
  }

  _boxIntersects(box, viewport) {
    if (!box || !viewport) return true;
    return (
      box.x <= viewport.x + viewport.w &&
      box.x + box.w >= viewport.x &&
      box.y <= viewport.y + viewport.h &&
      box.y + box.h >= viewport.y
    );
  }

  _boxContainsPoint(box, x, y, tolerance = 0) {
    if (!box) return true;
    return (
      x >= box.x - tolerance &&
      x <= box.x + box.w + tolerance &&
      y >= box.y - tolerance &&
      y <= box.y + box.h + tolerance
    );
  }

  _simplifyStrokePoints(points) {
    return (points || []).filter((point, index, list) => {
      if (index === 0) return true;
      const prev = list[index - 1];
      return point.x !== prev.x || point.y !== prev.y;
    });
  }
}

export default ImageViewer;
