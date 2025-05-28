import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "@calpoly/mustang";
import reset from "../styles/reset.css.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state()
  formData: LoginFormData = {};

  @property()
  api?: string;

  @property()
  redirect: string = "/";

  @state()
  error?: string;

  get canSubmit(): boolean {
    return Boolean(this.api && this.formData.username && this.formData.password);
  }

  static styles = [
    reset.styles,
    css`
      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      button[type="submit"] {
        font-size: 1.1rem;
        padding: 0.75rem 1.5rem;
        background-color: var(--color-background, #ee5470);
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button[type="submit"]:hover {
        background-color: var(--color-primary-dark, #006644);
      }

      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }
    `
  ];

  override render() {
    return html`
      <form
        @change=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;

    if (name === "username") {
      this.formData = { ...prevData, username: value };
    } else if (name === "password") {
      this.formData = { ...prevData, password: value };
    }
  }

  handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    if (this.canSubmit) {
      fetch(this.api!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.formData)
      })
        .then((res) => {
          if (res.status !== 200) throw "Login failed";
          return res.json();
        })
        .then((json) => {
          const { token } = json as { token: string };
          localStorage.setItem("authToken", token);
          const event = new CustomEvent("auth:message", {
            bubbles: true,
            composed: true,
            detail: ["auth/signin", { token, redirect: this.redirect }]
          });
          console.log("Dispatching message", event);
          this.dispatchEvent(event);
        })        
        .catch((err) => {
          console.error(err);
          this.error = err.toString();
        });
    }
  }
}

// ✅ Register the element for Mustang/Lit + Vite build
define({
  "login-form": LoginFormElement
});
