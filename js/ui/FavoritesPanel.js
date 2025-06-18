export default class FavoritesPanel {
  constructor(toggleBtnId, listId) {
    this.storageKey = 'favorites';
    this.toggleBtn = document.getElementById(toggleBtnId);
    this.listEl = document.getElementById(listId);
    this.favs = new Map(JSON.parse(localStorage.getItem(this.storageKey)||'[]'));
    this.toggleBtn.addEventListener('click', () => this.toggle());
    this.render();
  }
  toggle() {
    this.listEl.classList.toggle('d-none');
  }
  add(recipe) {
    this.favs.set(recipe.id, recipe);
    this._save(); this.render();
  }
  remove(id) {
    this.favs.delete(id);
    this._save(); this.render();
  }
  _save() {
    localStorage.setItem(this.storageKey, JSON.stringify([...this.favs]));
  }
  render() {
    this.listEl.innerHTML = [...this.favs.values()].map(r => `
      <li class="list-group-item d-flex justify-content-between">
        <span>${r.label}</span>
        <button onclick="favorites.remove('${r.id}')">✕</button>
      </li>
    `).join('');
  }
}