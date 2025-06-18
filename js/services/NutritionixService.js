// js/services/NutritionixService.js
export default class NutritionixService {
  static appId  = 'ca69f130';
  static apiKey = 'ea051360472f2b50153e34e04d3c9497';

  /**
   * Safely parse nutrition info for one ingredient line.
   * Always returns an object with nf_calories.
   */
  static async parseNutrition(text) {
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': NutritionixService.appId,
          'x-app-key': NutritionixService.apiKey,
        },
        body: JSON.stringify({ query: text, timezone: 'US/Central' })
      });
      if (!res.ok) {
        console.warn('Nutritionix returned', res.status);
        return { nf_calories: 'N/A' };
      }
      const { foods } = await res.json();
      return foods?.[0] ?? { nf_calories: 'N/A' };
    } catch (err) {
      console.warn('parseNutrition error:', err);
      return { nf_calories: 'N/A' };
    }
  }
}
