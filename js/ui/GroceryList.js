/**
 * Class to manage and render grocery list
 */
export default class GroceryList {
  constructor(listId, containerSection) {
    this.listEl = document.getElementById(listId);
    this.container = containerSection;
    this.items = [];
  }

  add(item, calories) {
    this.items.push({ item, calories });
    this._renderItem(item, calories);
  }

  _renderItem(name, cal) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `
      <span>${name} <small class="text-muted">(${cal}&nbsp;cal)</small></span>
      <button aria-label="Remove ${name}">&#10005;</button>
    `;
    li.querySelector('button').addEventListener('click', () => {
      this.items = this.items.filter(x => x.item !== name);
      li.remove();
    });
    this.listEl.appendChild(li);
  }

  clear() {
    this.items = [];
    this.listEl.innerHTML = '';
    this.container.classList.add('d-none');
  }

  show() {
    this.container.classList.remove('d-none');
  }
}