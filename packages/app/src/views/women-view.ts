import { html, css, LitElement } from "lit";
import { define } from "@calpoly/mustang";
import "../components/desi-products";

export class WomenViewElement extends LitElement {
  render() {
    return html`
      <section>
        <h2>Women's Collection</h2>
        <desi-products src="/api/products"></desi-products>
      </section>
    `;
  }

  static styles = css`
    section {
      padding: 2rem;
    }

    h2 {
      font-size: 1.6rem;
      margin-bottom: 1rem;
    }
  `;
}

define({ "women-view": WomenViewElement });
