// js/services/EdamamService.js
export default class EdamamService {
  /**
   * Search recipes by pantry ingredients using TheMealDB,
   * with name‑search and random fallbacks. Ensures up to 12 unique recipes.
   */
  static async searchRecipes(pantryArr) {
    console.log('searchRecipes called with pantryArr:', pantryArr);

    if (!pantryArr.length) {
      console.warn('No pantry ingredients—fetching random recipes');
      return this.randomRecipes(12);
    }

    // 1) filter by each ingredient
    const idArrays = await Promise.all(
      pantryArr.map(async ing => {
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ing)}`;
        console.log('Filtering by ingredient:', ing, 'URL:', url);
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`Filter failed for "${ing}"`, res.status);
          return [];
        }
        const json = await res.json();
        return json.meals ? json.meals.map(m => m.idMeal) : [];
      })
    );

    // 2) intersect
    let common = idArrays.reduce((a, b) => a.filter(id => b.includes(id)), idArrays[0] || []);
    console.log('Intersect IDs:', common);

    // 3) fallback to first ingredient
    if (!common.length) {
      console.warn('No intersection—using first ingredient results');
      common = idArrays[0] || [];
    }

    // 4) name‑search fallback
    if (!common.length) {
      const name = pantryArr[0];
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`;
      console.log('Name‑search URL:', url);
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        common = json.meals ? json.meals.map(m => m.idMeal) : [];
        console.log('Name‑search IDs:', common);
      }
    }

    // 5) final random fallback
    if (!common.length) {
      console.warn('No matches—using random fallback');
      return this.randomRecipes(12);
    }

    // 6) lookup details
    const limited = common.slice(0, 12);
    console.log('Lookup IDs:', limited);
    const detailed = await Promise.all(limited.map(id => this._lookupMeal(id)));
    return detailed.map(r => ({ recipe: r }));
  }

  static async _lookupMeal(id) {
    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Lookup failed for ID ${id}`);
    const { meals } = await res.json();
    const meal = meals[0];
    const lines = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const amt = meal[`strMeasure${i}`];
      if (ing && ing.trim()) lines.push(`${amt.trim()} ${ing.trim()}`.trim());
    }
    return {
      label: meal.strMeal,
      image: meal.strMealThumb,
      ingredientLines: lines,
      id: meal.idMeal
    };
  }

  static async randomRecipes(count = 6) {
    const seen = new Set();
    const out  = [];
    while (out.length < count) {
      const res  = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
      const { meals } = await res.json();
      const m = meals[0];
      if (seen.has(m.idMeal)) continue;
      seen.add(m.idMeal);
      out.push({ recipe: {
        label: m.strMeal,
        image: m.strMealThumb,
        ingredientLines: ['View full recipe for details'],
        id: m.idMeal
      }});
    }
    return out;
  }

  /** 
   * Returns an array of all category names 
   */
  static async categories() {
    const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load categories');
    const { categories } = await res.json();
    return categories.map(c => c.strCategory);
  }
}
