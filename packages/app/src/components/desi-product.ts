import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";
import reset from "../styles/reset.css.ts";

export class DesiProductElement extends LitElement {
  @property({ attribute: "img-src" }) imgSrc?: string;
  @property() name?: string;
  @property() price?: string;

  override render() {
    return html`
      <div class="product-card">
        <img src="${this.imgSrc}" alt="${this.name}" />
        <div class="product-info">
          <h3>${this.name}</h3>
          <p>${this.price}</p>
        </div>
      </div>
    `;
  }

  static styles = [
    reset.styles,
    css`
      :host {
        display: block;
        width: 100%;
        max-width: 220px;
      }

      .product-card {
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        background: var(--color-background-sage);
        transition: transform 0.2s;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .product-card:hover {
        transform: scale(1.02);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .product-card img {
        width: 100%;
        border-radius: 0.5rem;
      }

      .product-info h3 {
        font-size: 1.1rem;
        margin: 0.5rem 0;
        color: var(--color-text-default);
      }

      .product-info p {
        font-weight: bold;
        color: var(--color-text-default);
      }
    `
  ];
}
