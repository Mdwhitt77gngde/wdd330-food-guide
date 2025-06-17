export default class EdamamService {
  static id = 'YOUR_APP_ID';
  static key = 'YOUR_APP_KEY';

  /**
   * Search recipes by pantry ingredients
   * @param {string[]} pantryArr
   * @returns {Promise<Object[]>} array of hits
   */
  static async searchRecipes(pantryArr) {
    const q = encodeURIComponent(pantryArr.join(','));
    const url = `https://api.edamam.com/search?q=${q}&app_id=${this.id}&app_key=${this.key}&to=12`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Edamam API error');
    const json = await res.json();
    return json.hits;
  }
}