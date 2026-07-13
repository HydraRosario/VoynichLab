export class AnnotationPanel {
  constructor(containerElement) {
    this.container = containerElement;
    this.infoContainer = document.getElementById('trace-info-container');

    this.region = null;
    this.labels = [];
    this.atomLibrary = [];
    this.activeAtomId = null;
    this.activeAtomGroup = null;
    this.activeConfig = '1';
    this.clusterDebugHtml = '';

    this._onDrawAtomRequested = null;
    this._onSaveAtomRequested = null;
    this._onDeleteRequested = null;
    this._onAtomPicked = null;
    this._onConfigPicked = null;
  }

  setRegion(region, labels = []) {
    this.region = region || null;
    this.labels = labels || [];
    this._render();
  }

  setAtomLibrary(items = []) {
    this.atomLibrary = items || [];
    this._render();
  }

  setActiveAtom(id) {
    this.activeAtomId = id || null;
    const atom = this.atomLibrary.find((item) => String(item.id) === String(id || ''));
    this.activeAtomGroup = atom ? this._atomGroupKey(atom) : null;
    this.activeConfig = atom ? this._atomConfigKey(atom) : this.activeConfig;
    this._render();
  }

  setActiveConfig(config) {
    this.activeConfig = String(config || '1');
    this._render();
  }

  setClusterDebugHtml(html) {
    this.clusterDebugHtml = html || '';
    this._render();
  }

  clear() {
    this.region = null;
    this.labels = [];
    this._render();
  }

  onDrawAtomRequested(callback) { this._onDrawAtomRequested = callback; }
  onSaveAtomRequested(callback) { this._onSaveAtomRequested = callback; }
  onDeleteRequested(callback) { this._onDeleteRequested = callback; }
  onAtomPicked(callback) { this._onAtomPicked = callback; }
  onConfigPicked(callback) { this._onConfigPicked = callback; }

  _render() {
    this.infoContainer.classList.remove('hidden');
    this.infoContainer.innerHTML = `
      <div class="trace-panel atomic-panel">
        ${this._renderAtomTable()}
        ${this.clusterDebugHtml}
        ${this._renderSelectedAtom()}
      </div>
    `;
    this._attachEvents();
  }

  _renderAtomTable() {
    const groups = this._groupAtoms();
    const activeGroup = this.activeAtomGroup || this._atomGroupKey(this.atomLibrary.find((atom) => String(atom.id) === String(this.activeAtomId)));
    const newAtomColor = this._nextAvailableColor();
    const atoms = groups
      .map((group) => {
        const color = this._atomGroupColor(group);
        return `
        <span
          class="atom-group"
          style="--atom-color:${this._escapeHtml(color)}"
        >
          <button
            class="atom-button atom-group-key ${group.key === activeGroup ? 'atom-button--active' : ''}"
            data-atom-group="${this._escapeHtml(group.key)}"
            type="button"
            title="${this._escapeHtml(`${group.key}: ${group.items.length} variante${group.items.length !== 1 ? 's' : ''}`)}"
          >
            <span class="atom-key__swatch" aria-hidden="true"></span>
            <span>${this._escapeHtml(group.key)}</span>
          </button>
        </span>
      `;
      })
      .join('');

    return `
      <section class="atom-table atom-table--atoms">
        <div class="atom-table__title">Tabla atomica</div>
        <div class="atom-table__keys">
          <div class="atom-table__atom-list">
            ${atoms || '<span class="atom-table__empty">Sin atomos guardados.</span>'}
          </div>
          <div class="atom-table__create">
            <button
              class="atom-button atom-new-btn"
              type="button"
              data-draw-color="${newAtomColor}"
              style="--atom-color:${newAtomColor}"
              title="Dibujar atomo nuevo"
              aria-label="Dibujar atomo nuevo"
            >+</button>
          </div>
        </div>
      </section>
    `;
  }

  _renderSelectedAtom() {
    if (!this.region) {
      return '';
    }

    const family = this._labelValue(['base_family']);
    const variant = this._labelValue(['visual_variant']);
    const config = this._labelValue(['structural_config']) || this.activeConfig || '1';

    return `
      <section class="trace-panel__section atomic-selected">
        <div class="trace-panel__section-title">Trazo seleccionado</div>
        <div class="atom-facts">
          <div class="atom-fact">
            <span class="atom-fact__label">Atomo</span>
            <strong>${this._escapeHtml(this._friendlyAtomKey(family) || 'sin familia')}</strong>
          </div>
          <div class="atom-fact">
            <span class="atom-fact__label">Variante</span>
            <strong>${this._escapeHtml(variant || 'calculando')}</strong>
          </div>
          <div class="atom-fact">
            <span class="atom-fact__label">Config</span>
            <strong>${this._escapeHtml(config)}</strong>
          </div>
        </div>
        <div class="config-picker" aria-label="Configuraciones de preview">
          ${Array.from({ length: 9 }, (_, index) => {
            const value = String(index + 1);
            return `
              <button
                class="config-key ${value === String(config) ? 'config-key--active' : ''}"
                data-config-key="${value}"
                type="button"
              >${value}</button>
            `;
          }).join('')}
        </div>
        <div class="atomic-actions">
          <button class="btn btn--sm" id="ap-save-atom" type="button">Guardar patron</button>
          <button class="btn btn--sm btn--danger" id="ap-delete-region" type="button">Borrar trazo</button>
        </div>
      </section>
    `;
  }

  _attachEvents() {
    this.container.querySelectorAll('[data-draw-color]').forEach((button) => {
      button.addEventListener('click', () => {
        this._onDrawAtomRequested?.(button.dataset.drawColor || '#64b4dc');
      });
    });

    this.container.querySelectorAll('.atom-group-key').forEach((button) => {
      button.addEventListener('click', () => {
        const groupKey = button.dataset.atomGroup;
        const group = this._groupAtoms().find((item) => item.key === groupKey);
        if (!group) return;
        this.activeAtomGroup = group.key;
        this._onAtomPicked?.(group.items[0].id);
      });
    });

    document.getElementById('ap-save-atom')?.addEventListener('click', () => {
      this._onSaveAtomRequested?.();
    });

    document.getElementById('ap-delete-region')?.addEventListener('click', () => {
      this._onDeleteRequested?.();
    });

    this.container.querySelectorAll('[data-config-key]').forEach((button) => {
      button.addEventListener('click', () => {
        this.activeConfig = button.dataset.configKey || '1';
        this._onConfigPicked?.(this.activeConfig);
      });
    });
  }

  _labelValue(types) {
    const label = this.labels.find((item) => types.includes(item.label_type || item.labelType || ''));
    return label?.value || '';
  }

  _groupAtoms() {
    const groups = new Map();
    this.atomLibrary.forEach((atom) => {
      const key = this._atomGroupKey(atom);
      if (!key) return;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(atom);
    });

    return Array.from(groups.entries())
      .map(([key, items]) => ({
        key,
        items: items
          .slice()
          .sort((a, b) => this._atomConfigKey(a).localeCompare(this._atomConfigKey(b), undefined, { numeric: true })),
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  _atomGroupKey(atom) {
    if (!atom) return '';
    const explicit = String(atom.atomKey || '').trim();
    if (explicit) return this._friendlyAtomKey(explicit);
    const family = this._labelValueFromAtom(atom, ['base_family']);
    const name = String(atom.name || '').trim();
    return this._friendlyAtomKey(name || family || 'atomo');
  }

  _atomConfigKey(atom) {
    if (!atom) return '1';
    const explicit = String(atom.configKey || '').trim();
    if (explicit) return explicit;
    return this._labelValueFromAtom(atom, ['structural_config']) || '1';
  }

  _labelValueFromAtom(atom, types) {
    const labels = Array.isArray(atom?.labels) ? atom.labels : [];
    const label = labels.find((item) => types.includes(item.label_type || item.labelType || ''));
    return String(label?.value || '').trim();
  }

  _atomGroupColor(group) {
    const atom = group?.items?.find((item) => this._atomColor(item)) || group?.items?.[0];
    return this._atomColor(atom) || '#d9c2f5';
  }

  _usedAtomColors() {
    const colors = new Set();
    this._groupAtoms().forEach((group) => {
      const color = this._normalizeColor(this._atomGroupColor(group));
      if (color) colors.add(color);
    });
    return colors;
  }

  _nextAvailableColor() {
    const palette = [
      '#4a9e6a',
      '#ff5f1f',
      '#f2e45c',
      '#2f7df6',
      '#00f0b5',
      '#ff2d55',
      '#8aff00',
      '#00a2ff',
      '#7c3cff',
      '#ff8c00',
      '#00ff7f',
      '#ffffff',
      '#ff00ff',
    ];
    const usedColors = this._usedAtomColors();
    const available = palette.find((item) => !usedColors.has(this._normalizeColor(item)));
    if (available) return available;
    return this._generatedColor(usedColors.size);
  }

  _generatedColor(index) {
    const hue = (index * 137.508) % 360;
    return this._hslToHex(hue, 94, 58);
  }

  _hslToHex(h, s, l) {
    const saturation = s / 100;
    const lightness = l / 100;
    const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = lightness - c / 2;
    const [r, g, b] = h < 60 ? [c, x, 0]
      : h < 120 ? [x, c, 0]
      : h < 180 ? [0, c, x]
      : h < 240 ? [0, x, c]
      : h < 300 ? [x, 0, c]
      : [c, 0, x];
    return `#${[r, g, b].map((value) => Math.round((value + m) * 255).toString(16).padStart(2, '0')).join('')}`;
  }

  _atomColor(atom) {
    const geometry = this._parseGeometry(atom?.region?.geometry_json || atom?.region?.geometryJson || '{}');
    return this._normalizeColor(geometry.color);
  }

  _parseGeometry(value) {
    try {
      return typeof value === 'string' ? JSON.parse(value || '{}') : value || {};
    } catch {
      return {};
    }
  }

  _normalizeColor(value) {
    const clean = String(value || '').trim().toLowerCase();
    return /^#[0-9a-f]{6}$/.test(clean) ? clean : '';
  }

  _friendlyAtomKey(value) {
    const clean = String(value || '').trim();
    const normalized = clean.endsWith('_base') ? clean.slice(0, -5) : clean;
    return normalized.toLowerCase();
  }

  _escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = String(value || '');
    return div.innerHTML;
  }
}

export default AnnotationPanel;
