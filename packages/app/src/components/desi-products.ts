import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "@calpoly/mustang";
import "./desi-product.ts";

// Define the shape of one product
interface Product {
  name: string;
  price: string;
  imgSrc: string;
}

export class DesiProductsElement extends LitElement {
  @property()
  src?: string;

  @state()
  products: Array<Product> = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.src) this.hydrate(this.src);
  }

  hydrate(src: string) {
    const token = localStorage.getItem("authToken");
  
    fetch(src, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((json: object) => {
        if (Array.isArray(json)) {
          this.products = json as Array<Product>;
        }
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      });
  }  

  render() {
    return html`
      <div class="product-grid">
        ${this.products.map(
          (p) => html`
            <desi-product
              img-src="${p.imgSrc}"
              name="${p.name}"
              price="${p.price}"
            ></desi-product>
          `
        )}
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, 250px);
      gap: 2rem;
      padding: 2rem;
      justify-items: start;
    }

    desi-product {
      max-width: 220px;
      width: 100%;
    }
  `;
}

define({
  "desi-products": DesiProductsElement
});
