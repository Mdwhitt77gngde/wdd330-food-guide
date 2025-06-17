import EdamamService from './services/EdamamService.js';
import NutritionixService from './services/NutritionixService.js';
import RecipeCard from './ui/RecipeCard.js';
import GroceryList from './ui/GroceryList.js';

// DOM refs
const pantryForm = document.getElementById('pantry-form');
const ingredientsInput = document.getElementById('ingredients');
const recipesContainer = document.getElementById('recipes');
const grocerySection = document.getElementById('grocery-list');
const clearListBtn = document.getElementById('clear-list');

// State
let pantry = [];
const groceryList = new GroceryList('grocery-items', grocerySection);

// Event: Search form submitted
pantryForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!ingredientsInput.checkValidity()) return;

  pantry = ingredientsInput.value.split(',').map(i => i.trim().toLowerCase());
  recipesContainer.innerHTML = '';

  try {
    const hits = await EdamamService.searchRecipes(pantry);
    hits.forEach((hit, i) => {
      const card = new RecipeCard(hit.recipe, pantry, onAddMissing);
      recipesContainer.appendChild(card.element);
      card.element.classList.add('fade-in-up');
    });
  } catch (err) {
    console.error(err);
    recipesContainer.innerHTML = '<p class="text-danger">Failed to load recipes.</p>';
  }
});

// Callback when missing items are added
async function onAddMissing(missingItems) {
  groceryList.clear();
  for (const item of missingItems) {
    // fetch nutrition data for each missing item
    const nutri = await NutritionixService.parseNutrition(item);
    groceryList.add(item, nutri.nf_calories);
  }
  groceryList.show();
}

// Clear grocery list
clearListBtn.addEventListener('click', () => { groceryList.clear(); });