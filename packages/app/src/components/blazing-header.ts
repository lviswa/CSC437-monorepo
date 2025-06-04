import { html, css, LitElement } from "lit";

export class HeaderElement extends LitElement {
  render() {
    return html`
      <header>
        <h1>Desi Threads</h1>
        <nav>
          <a href="/app">Home</a>
          <a href="/app/women">Women</a>
        </nav>
      </header>
    `;
  }

  static styles = css`
    header {
      background-color: #fdf0e3;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #ccc;
    }

    h1 {
      font-size: 1.5rem;
      margin: 0;
    }

    nav a {
      margin-left: 1rem;
      text-decoration: none;
      color: #333;
      font-weight: bold;
    }

    nav a:hover {
      text-decoration: underline;
    }
  `;
}
