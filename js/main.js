// js/main.js
import EdamamService       from './services/EdamamService.js';
import NutritionixService  from './services/NutritionixService.js';
import HeroCarousel        from './ui/HeroCarousel.js';
import InterestsTagger     from './ui/InterestsTagger.js';
import FavoritesPanel      from './ui/FavoritesPanel.js';
import RecipeCard          from './ui/RecipeCard.js';
import GroceryList         from './ui/GroceryList.js';

// —––––– DOM References ––––––
const pantryForm       = document.getElementById('pantry-form');
const ingredientsInput = document.getElementById('ingredients');
const recipesContainer = document.getElementById('recipes');
const grocerySection   = document.getElementById('grocery-list');
const clearListBtn     = document.getElementById('clear-list');
// —–––––––––––––––––––––––––––

const groceryList = new GroceryList('grocery-items', grocerySection);

// Initialize homepage widgets
new HeroCarousel('hero-container');
let currentInterests = [];
new InterestsTagger('interests-container', list => currentInterests = list);
window.favorites = new FavoritesPanel('fav-toggle', 'fav-list');

// Search form handler
pantryForm.addEventListener('submit', async e => {
  e.preventDefault();
  const pantry = ingredientsInput.value
    .split(',')
    .map(i => i.trim().toLowerCase())
    .filter(Boolean);

  let results;
  if (pantry.length) {
    results = await EdamamService.searchRecipes(pantry);
  } else {
    results = await EdamamService.randomRecipes(12);
  }

  renderResults(results);
});

// Clear grocery list
clearListBtn.addEventListener('click', () => {
  groceryList.clear();
});

// Render recipes and bind “Add Missing” + “Favorite”
function renderResults(hits) {
  recipesContainer.innerHTML = '';
  grocerySection.classList.add('d-none');

  hits.forEach(h => {
    const card = new RecipeCard(h.recipe, currentInterests, missingItems => {
      groceryList.clear();
      missingItems.forEach(async item => {
        const nutri = await NutritionixService.parseNutrition(item);
        groceryList.add(item, nutri.nf_calories);
      });
      groceryList.show();
    });

    // Favorite button
    const favBtn = document.createElement('button');
    favBtn.textContent = '☆';
    favBtn.className = 'btn btn-outline-warning btn-sm mt-2';
    favBtn.onclick = () => window.favorites.add(h.recipe);

    card.element.querySelector('.recipe-card-body').appendChild(favBtn);
    recipesContainer.appendChild(card.element);
  });
}
