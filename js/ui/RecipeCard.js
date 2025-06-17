/**
 * Class representing a recipe card UI component
 */
export default class RecipeCard {
  constructor(recipe, pantryArr, onAddMissing) {
    this.recipe = recipe;
    this.pantry = pantryArr;
    this.onAddMissing = onAddMissing;
    this.element = this._createCard();
  }

  _createCard() {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    card.innerHTML = `
      <div class="recipe-card">
        <img src="${this.recipe.image}" alt="${this.recipe.label}" class="w-100">
        <div class="recipe-card-body">
          <h5>${this.recipe.label}</h5>
          <button class="btn btn-sm btn-outline-primary">Add Missing to List</button>
        </div>
      </div>
    `;
    const btn = card.querySelector('button');
    btn.addEventListener('click', () => this._handleAddMissing());
    return card;
  }

  _handleAddMissing() {
    const missing = this.recipe.ingredientLines
      .map(i => i.toLowerCase())
      .filter(i => !this.pantry.some(p => i.includes(p)));
    this.onAddMissing(missing);
  }
}