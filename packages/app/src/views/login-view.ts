import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../components/login-form";

@customElement("login-view")
export class LoginViewElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
      background: url("/assets/login-background.png") no-repeat center center fixed;
      background-size: cover;
      font-family: var(--body-font, 'Playfair Display', serif);
      color: var(--color-text, black);
      padding: 2rem;
      box-sizing: border-box;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }

    h1.title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
      color: black;
      text-align: center;
    }

    .card {
      background: var(--color-background-header, white);
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }

    .card h2 {
      text-align: center;
      font-size: 1.75rem;
      margin-bottom: 1rem;
    }

    p {
      margin-top: 1.5rem;
      font-size: 0.9rem;
      text-align: center;
    }

    a {
      color: #ff4081;
      text-decoration: none;
      font-weight: bold;
    }
  `;

  render() {
    return html`
      <mu-auth>
        <div class="container">
          <h1 class="title">DESI THREADS</h1>
          <main class="card">
            <h2>User Login</h2>
            <login-form api="/auth/login" redirect="/app">
              <label>
                Username:
                <input name="username" autocomplete="off" />
              </label>
              <label>
                Password:
                <input type="password" name="password" />
              </label>
            </login-form>
          </main>
          <p>
            Or did you want to
            <a href="/app/newuser">Sign up as a new user</a>?
          </p>
        </div>
      </mu-auth>
    `;
  }
}
