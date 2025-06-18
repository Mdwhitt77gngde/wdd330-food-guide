// js/ui/InterestsTagger.js
import EdamamService from '../services/EdamamService.js';

export default class InterestsTagger {
  constructor(containerId, onChange) {
    this.container = document.getElementById(containerId);
    this.onChange  = onChange;
    this.selected  = new Set();
    this.init();
  }

  async init() {
    try {
      const cats = await EdamamService.categories();
      this.container.innerHTML = cats
        .map(c => `<span class="badge bg-secondary m-1 tag">${c}</span>`)
        .join('');
      this.container.querySelectorAll('.tag').forEach(el => 
        el.addEventListener('click', e => {
          const txt = e.target.textContent;
          if (this.selected.has(txt)) {
            this.selected.delete(txt);
            e.target.classList.remove('bg-primary');
          } else {
            this.selected.add(txt);
            e.target.classList.add('bg-primary');
          }
          this.onChange([...this.selected]);
        })
      );
    } catch (err) {
      console.error('InterestsTagger init failed:', err);
    }
  }
}
