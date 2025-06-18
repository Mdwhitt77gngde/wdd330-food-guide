export default class NutritionixService {
  static appId = 'ca69f130';
  static apiKey = 'ea051360472f2b50153e34e04d3c9497';

  /**
   * Parse nutrition info for an ingredient line
   * @param {string} text
   * @returns {Promise<Object>} nutrition data
   */
  static async parseNutrition(text) {
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': this.appId,
        'x-app-key': this.apiKey,
      },
      body: JSON.stringify({ query: text, timezone: 'US/Central' })
    });
    if (!res.ok) throw new Error('Nutritionix API error');
    const json = await res.json();
    // return first parsed food item or fallback
    return json.foods?.[0] ?? { nf_calories: 'N/A' };
  }
}