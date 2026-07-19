export class AnnotationPanel {
  constructor(containerElement) {
    this.container = containerElement;
    this.infoContainer = document.getElementById('trace-info-container');

    this.region = null;
    this.labels = [];
    this.particleLibrary = [];
    this.activeParticleId = null;
    this.activeParticleGroup = null;
    this.activeConfig = '1';
    this.clusterDebugHtml = '';

    this._onDrawParticleRequested = null;
    this._onSaveParticleRequested = null;
    this._onDeleteRequested = null;
    this._onParticlePicked = null;
    this._onConfigPicked = null;
  }

  setRegion(region, labels = []) {
    this.region = region || null;
    this.labels = labels || [];
    this._render();
  }

  setParticleLibrary(items = []) {
    this.particleLibrary = items || [];
    this._render();
  }

  setActiveParticle(id) {
    this.activeParticleId = id || null;
    const particle = this.particleLibrary.find((item) => String(item.id) === String(id || ''));
    this.activeParticleGroup = particle ? this._particleGroupKey(particle) : null;
    this.activeConfig = particle ? this._particleConfigKey(particle) : this.activeConfig;
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

  onDrawParticleRequested(callback) { this._onDrawParticleRequested = callback; }
  onSaveParticleRequested(callback) { this._onSaveParticleRequested = callback; }
  onDeleteRequested(callback) { this._onDeleteRequested = callback; }
  onParticlePicked(callback) { this._onParticlePicked = callback; }
  onConfigPicked(callback) { this._onConfigPicked = callback; }

  _render() {
    this.infoContainer.classList.remove('hidden');
    this.infoContainer.innerHTML = `
      <div class="trace-panel particle-panel">
        ${this._renderParticleTable()}
        ${this.clusterDebugHtml}
        ${this._renderSelectedParticle()}
      </div>
    `;
    this._attachEvents();
  }

  _renderParticleTable() {
    const groups = this._groupParticles();
    const activeGroup = this.activeParticleGroup || this._particleGroupKey(this.particleLibrary.find((particle) => String(particle.id) === String(this.activeParticleId)));
    const newParticleColor = this._nextAvailableColor();
    const particles = groups
      .map((group) => {
        const color = this._particleGroupColor(group);
        return `
        <span
          class="particle-group"
          style="--particle-color:${this._escapeHtml(color)}"
        >
          <button
            class="particle-button particle-group-key ${group.key === activeGroup ? 'particle-button--active' : ''}"
            data-particle-group="${this._escapeHtml(group.key)}"
            type="button"
            title="${this._escapeHtml(`${group.key}: ${group.items.length} variante${group.items.length !== 1 ? 's' : ''}`)}"
          >
            <span class="particle-key__swatch" aria-hidden="true"></span>
            <span>${this._escapeHtml(group.key)}</span>
          </button>
        </span>
      `;
      })
      .join('');

    return `
      <section class="particle-table particle-table--particles">
        <div class="particle-table__title">Tabla de particulas</div>
        <div class="particle-table__keys">
          <div class="particle-table__particle-list">
            ${particles || '<span class="particle-table__empty">Sin particulas guardadas.</span>'}
          </div>
          <div class="particle-table__create">
            <button
              class="particle-button particle-new-btn"
              type="button"
              data-draw-color="${newParticleColor}"
              style="--particle-color:${newParticleColor}"
              title="Dibujar particula nueva"
              aria-label="Dibujar particula nueva"
            >+</button>
          </div>
        </div>
      </section>
    `;
  }

  _renderSelectedParticle() {
    if (!this.region) {
      return '';
    }

    const family = this._labelValue(['base_family']);
    const variant = this._labelValue(['visual_variant']);
    const config = this._labelValue(['structural_config']) || this.activeConfig || '1';

    return `
      <section class="trace-panel__section particle-selected">
        <div class="trace-panel__section-title">Trazo seleccionado</div>
        <div class="particle-facts">
          <div class="particle-fact">
            <span class="particle-fact__label">Particula</span>
            <strong>${this._escapeHtml(this._friendlyParticleKey(family) || 'sin familia')}</strong>
          </div>
          <div class="particle-fact">
            <span class="particle-fact__label">Variante</span>
            <strong>${this._escapeHtml(variant || 'calculando')}</strong>
          </div>
          <div class="particle-fact">
            <span class="particle-fact__label">Config</span>
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
        <div class="particle-actions">
          <button class="btn btn--sm" id="ap-save-particle" type="button">Guardar patron</button>
          <button class="btn btn--sm btn--danger" id="ap-delete-region" type="button">Borrar trazo</button>
        </div>
      </section>
    `;
  }

  _attachEvents() {
    this.container.querySelectorAll('[data-draw-color]').forEach((button) => {
      button.addEventListener('click', () => {
        this._onDrawParticleRequested?.(button.dataset.drawColor || '#64b4dc');
      });
    });

    this.container.querySelectorAll('.particle-group-key').forEach((button) => {
      button.addEventListener('click', () => {
        const groupKey = button.dataset.particleGroup;
        const group = this._groupParticles().find((item) => item.key === groupKey);
        if (!group) return;
        this.activeParticleGroup = group.key;
        this._onParticlePicked?.(group.items[0].id);
      });
    });

    document.getElementById('ap-save-particle')?.addEventListener('click', () => {
      this._onSaveParticleRequested?.();
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

  _groupParticles() {
    const groups = new Map();
    this.particleLibrary.forEach((particle) => {
      const key = this._particleGroupKey(particle);
      if (!key) return;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(particle);
    });

    return Array.from(groups.entries())
      .map(([key, items]) => ({
        key,
        items: items
          .slice()
          .sort((a, b) => this._particleConfigKey(a).localeCompare(this._particleConfigKey(b), undefined, { numeric: true })),
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  _particleGroupKey(particle) {
    if (!particle) return '';
    const explicit = String(particle.particleKey || '').trim();
    if (explicit) return this._friendlyParticleKey(explicit);
    const family = this._labelValueFromParticle(particle, ['base_family']);
    const name = String(particle.name || '').trim();
    return this._friendlyParticleKey(name || family || 'particula');
  }

  _particleConfigKey(particle) {
    if (!particle) return '1';
    const explicit = String(particle.configKey || '').trim();
    if (explicit) return explicit;
    return this._labelValueFromParticle(particle, ['structural_config']) || '1';
  }

  _labelValueFromParticle(particle, types) {
    const labels = Array.isArray(particle?.labels) ? particle.labels : [];
    const label = labels.find((item) => types.includes(item.label_type || item.labelType || ''));
    return String(label?.value || '').trim();
  }

  _particleGroupColor(group) {
    const particle = group?.items?.find((item) => this._particleColor(item)) || group?.items?.[0];
    return this._particleColor(particle) || '#d9c2f5';
  }

  _usedParticleColors() {
    const colors = new Set();
    this._groupParticles().forEach((group) => {
      const color = this._normalizeColor(this._particleGroupColor(group));
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
    const usedColors = this._usedParticleColors();
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

  _particleColor(particle) {
    const geometry = this._parseGeometry(particle?.region?.geometry_json || particle?.region?.geometryJson || '{}');
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

  _friendlyParticleKey(value) {
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
