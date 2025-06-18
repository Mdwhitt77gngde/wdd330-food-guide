// js/services/EdamamService.js

export default class EdamamService {
  /**
   * Search recipes by pantry ingredients using TheMealDB.
   * @param {string[]} pantryArr
   * @returns {Promise<Array<{ recipe: { label: string, image: string, ingredientLines: string[] } }>>}
   */
  static async searchRecipes(pantryArr) {
    // TheMealDB only supports filtering by one ingredient at a time.
    // We'll use the first pantry item.
    const ingredient = encodeURIComponent(pantryArr[0] || '');
    const filterUrl  = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;

    const filterRes = await fetch(filterUrl);
    if (!filterRes.ok) throw new Error('Failed to fetch recipe list');
    const { meals } = await filterRes.json();
    if (!meals) return [];  // no matching recipes

    // Limit to first 12 meals
    const limited = meals.slice(0, 12);

    // For each meal, fetch full details
    const detailPromises = limited.map(m =>
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata`)
        .then(r => {
          if (!r.ok) throw new Error('Failed to fetch meal details');
          return r.json();
        })
        .then(json => {
          const meal = json.meals[0];
          // Build ingredientLines array from the 20 possible fields
          const ingredientLines = [];
          for (let i = 1; i <= 20; i++) {
            const ing = meal[`strIngredient${i}`];
            const amt = meal[`strMeasure${i}`];
            if (ing && ing.trim()) {
              // e.g. "2 cups Rice"
              ingredientLines.push(`${amt.trim()} ${ing.trim()}`.trim());
            }
          }
          return {
            recipe: {
              label: meal.strMeal,
              image: meal.strMealThumb,
              ingredientLines
            }
          };
        })
    );

    return Promise.all(detailPromises);
  }
}
