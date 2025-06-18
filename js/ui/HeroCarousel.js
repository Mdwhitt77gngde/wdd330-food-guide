import EdamamService from '../services/EdamamService.js';  // <-- add this


export default class HeroCarousel {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.render();
  }

  async render() {
    const items = await EdamamService.randomRecipes(5);
    const inner = items.map((m, i) => `
      <div class="carousel-item ${i===0?'active':''}">
        <img src="${m.recipe.image}" class="d-block w-100" alt="${m.recipe.label}">
        <div class="carousel-caption d-none d-md-block">
          <h5>${m.recipe.label}</h5>
        </div>
      </div>
    `).join('');
    this.container.innerHTML = `
      <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">${inner}</div>
        <button class="carousel-control-prev" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon"></span>
        </button>
        <button class="carousel-control-next" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon"></span>
        </button>
      </div>
    `;
  }
}