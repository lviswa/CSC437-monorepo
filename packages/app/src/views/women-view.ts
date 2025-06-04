import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { Model, DesiProduct } from "../model";
import { Msg } from "../messages";

export class WomenViewElement extends View<Model, Msg> {
  @state()
  get products(): DesiProduct[] {
    return this.model.products?.filter((p) => p.category === "women") ?? [];
  }

  constructor() {
    super("desi:model");
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.dispatchMessage(["products/load", {}]);
  }

  render() {
    return html`
      <main class="shop-page">
        <aside class="filters">
          <h2>Filters</h2>

          <div class="filter-group">
            <label>Waist Size (in):</label>
            <div class="size-options">
              <button type="button">25</button>
              <button type="button">26</button>
              <button type="button">27</button>
              <button type="button">28</button>
              <button type="button">29</button>
              <button type="button">30</button>
              <button type="button">30+</button>
            </div>
          </div>

          <div class="filter-group">
            <label>Price Range: <span id="price-value">$0</span> – $5,000</label>
            <input type="range" min="0" max="5000" value="0" step="50" id="price-slider">
          </div>

          <div class="filter-group">
            <label>Color:</label>
            <div class="color-options">
              <span class="color red"></span>
              <span class="color blue"></span>
              <span class="color black"></span>
              <span class="color orange"></span>
              <span class="color yellow"></span>
              <span class="color pink"></span>
              <span class="color purple"></span>
              <span class="color green"></span>
            </div>
          </div>

          <div class="filter-group">
            <label>Condition:</label>
            <div class="condition-options">
              <label><input type="radio" name="condition"> New</label>
              <label><input type="radio" name="condition"> Excellent</label>
              <label><input type="radio" name="condition"> Good</label>
              <label><input type="radio" name="condition"> Fair</label>
              <label><input type="radio" name="condition"> Old</label>
            </div>
          </div>
        </aside>

        <section>
          <ul class="product-grid">
            ${this.products.map(
              (product) => html`
                <li class="product-card">
                  <img src=${product.image} alt=${product.name} />
                  <h3>${product.name}</h3>
                  <p>$${product.price.toFixed(2)}</p>
                </li>
              `
            )}
          </ul>
        </section>
      </main>
    `;
  }

  static styles = css`
  .shop-page {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 2rem;
    padding: 2rem;
  }

  .filters {
    background: var(--color-background-sage);
    padding: 1.5rem;
    border-radius: 8px;
  }

  .filters h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .filter-group {
    margin-bottom: 2rem;
  }

  .filter-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .size-options button {
    margin: 0.3rem;
    padding: 0.4rem 0.8rem;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
    border-radius: 0.4rem;
    transition: background-color 0.2s, color 0.2s;
  }

  .size-options button:hover {
    background-color: black;
    color: white;
  }

  .color-options {
    display: flex;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .color {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    border: 1px solid #aaa;
    cursor: pointer;
  }

  .color.red { background: red; }
  .color.yellow { background: yellow; }
  .color.blue { background: blue; }
  .color.black { background: black; }
  .color.orange { background: orange; }
  .color.pink { background: pink; }
  .color.purple { background: purple; }
  .color.green { background: green; }

  .condition-options label {
    display: block;
    margin-top: 0.3rem;
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
  }

  .product-card {
    display: flex;
    flex-direction: column;
    background: var(--color-background-sage);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    height: auto;
  }

  .product-card img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .product-card:hover {
    transform: translateY(-5px);
  }

  .product-info {
    padding: 1rem;
    text-align: center;
  }

  .product-info h3 {
    font-size: 1.2rem;
    margin: 0.5rem 0;
  }

  .product-info p {
    font-weight: bold;
    color: #555;
  }

  @media (max-width: 768px) {
    .shop-page {
      grid-template-columns: 1fr;
    }

    .filters {
      margin-bottom: 2rem;
    }
  }
`;
}