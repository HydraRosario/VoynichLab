// ============================================================
// DataSetCreator - Image List
// Shows manuscript page thumbnails and allows page selection.
// ============================================================

export class ImageList {
  constructor(containerElement) {
    this.container = containerElement;
    this.emptyEl = document.getElementById('image-list-empty');
    this.images = [];
    this.selectedImageId = null;
    this.atomCounts = {};
    this.showOnlyWithAtoms = false;

    this._onImageSelected = null;
  }

  setImages(images) {
    this.images = images || [];
    this._render();
  }

  setSelectedImage(id) {
    this.selectedImageId = id;
    this._updateSelection();
  }

  setAtomCounts(counts) {
    this.atomCounts = counts || {};
    this._render();
  }

  setShowOnlyWithAtoms(showOnlyWithAtoms) {
    this.showOnlyWithAtoms = Boolean(showOnlyWithAtoms);
    this._render();
  }

  onImageSelected(callback) {
    this._onImageSelected = callback;
  }

  _render() {
    const visibleImages = this.showOnlyWithAtoms
      ? this.images.filter((image) => (this.atomCounts[image.id] || 0) > 0)
      : this.images;

    if (visibleImages.length === 0) {
      this.emptyEl.classList.remove('hidden');
      const emptyText = this.emptyEl.querySelector('span:last-child');
      if (emptyText) {
        emptyText.textContent = this.showOnlyWithAtoms ? 'No hay paginas con atomos.' : 'Cargando paginas.';
      }
      this.container.querySelectorAll('.image-item').forEach((el) => el.remove());
      return;
    }

    this.emptyEl.classList.add('hidden');
    this.container.querySelectorAll('.image-item').forEach((el) => el.remove());

    const fragment = document.createDocumentFragment();

    visibleImages.forEach((image, index) => {
      const item = document.createElement('div');
      item.className = 'image-item';
      if (String(image.id) === String(this.selectedImageId)) {
        item.classList.add('image-item--selected');
      }
      item.dataset.imageId = image.id;
      item.style.animationDelay = `${index * 30}ms`;
      item.classList.add('animate-fade-in-up');

      const filename = image.name || this._getFilename(
        image.source_path || image.sourcePath || image.file_path || image.filePath || image.filename || 'Unknown'
      );
      const atomCount = this.atomCounts[image.id] || 0;

      item.innerHTML = `
        <div class="image-item__thumb">
          <span>#</span>
        </div>
        <div class="image-item__info">
          <div class="image-item__name" title="${this._escapeHtml(filename)}">${this._escapeHtml(filename)}</div>
          <div class="image-item__meta">${atomCount} atomo${atomCount !== 1 ? 's' : ''}</div>
        </div>
        <span class="image-item__badge">${atomCount}</span>
      `;

      item.addEventListener('click', () => {
        if (this._onImageSelected) {
          this._onImageSelected(image.id);
        }
      });

      fragment.appendChild(item);
    });

    this.container.appendChild(fragment);
  }

  _updateSelection() {
    const items = this.container.querySelectorAll('.image-item');
    items.forEach((item) => {
      if (String(item.dataset.imageId) === String(this.selectedImageId)) {
        item.classList.add('image-item--selected');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('image-item--selected');
      }
    });
  }

  _getFilename(path) {
    if (!path) return 'Unknown';
    return path.split(/[/\\]/).pop() || path;
  }

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }
}

export default ImageList;
