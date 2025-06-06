import { View, define, Form, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { property } from "lit/decorators.js";
import { Model, DesiProduct } from "../model";
import { Msg } from "../messages";

export class ProductEditView extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element,
  });

  constructor() {
    super("desi:model");
  }

  @property()
  id = "";

  override firstUpdated(): void {
    if (!this.model?.products) {
      this.dispatchMessage(["products/load", {}]);
    }
  }

  get product(): DesiProduct | undefined {
    return this.model?.products?.find((p) => p.id === this.id);
  }

  render() {
    const product = this.product;

    if (!this.model?.products) {
      return html`<main class="page"><p>Loading products...</p></main>`;
    }

    if (!product) {
      return html`<main class="page"><p>Product not found for ID: ${this.id}</p></main>`;
    }

    return html`
      <main class="page">
        <div class="form-box">
          <h2>Edit Product</h2>
          <mu-form .init=${product} @mu-form:submit=${this.handleSubmit}>
            <label>Name:
              <input type="text" name="name" required />
            </label>
            <label>Price:
              <input type="number" name="price" required />
            </label>
            <label>Image URL:
              <input type="text" name="image" />
            </label>
            <label>Category:
              <select name="category" required>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="accessories">Accessories</option>
              </select>
            </label>

            <div class="button-wrapper" slot="button">
              <button type="submit">💾 Save</button>
            </div>
          </mu-form>
        </div>
      </main>
    `;
  }

  handleSubmit = (event: Form.SubmitEvent<DesiProduct>) => {
    const product = {
      ...event.detail,
      price: Number(event.detail.price),
    };
  
    this.dispatchMessage([
      "product/save",
      {
        id: this.id,
        product,
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: "/app/women",
          }),
        onFailure: (err) => console.error("Save failed:", err),
      },
    ]);
  };  

  static styles = css`
    main.page {
      display: flex;
      justify-content: center;
      padding: 3rem 1rem;
      font-family: "Playfair Display", serif;
    }

    .form-box {
      background-color: var(--color-header, #f49e62);
      padding: 2.5rem;
      border-radius: 1rem;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 500px;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }

    h2 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    mu-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    label {
      display: flex;
      flex-direction: column;
      font-weight: 600;
      font-size: 1rem;
    }

    input,
    select {
      margin-top: 0.4rem;
      padding: 0.6rem 0.8rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      background: white;
    }

    .button-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 1.5rem;
    }

    button[type="submit"] {
      padding: 0.75rem 1.5rem;
      background-color: #222;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button[type="submit"]:hover {
      background-color: #444;
    }
  `;
}
