import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import { define } from "@calpoly/mustang";
import reset from "../styles/reset.css.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state() formData: LoginFormData = {};
  @property() api?: string;
  @property() redirect: string = "/";
  @state() error?: string;
  @state() loading: boolean = false;

  get canSubmit(): boolean {
    return Boolean(this.api && this.formData.username && this.formData.password && !this.loading);
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

      button[type="submit"]:hover:enabled {
        background-color: var(--color-primary-dark, #006644);
      }

      button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .error {
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
          <button ?disabled=${!this.canSubmit} type="submit">
            ${this.loading ? "Logging in..." : "Login"}
          </button>
        </slot>
        ${this.error ? html`<p class="error">${this.error}</p>` : null}
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

  async handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    this.error = undefined;
    this.loading = true;

    try {
      const res = await fetch(this.api!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.formData)
      });

      if (!res.ok) throw new Error("Invalid username or password");
      const { token } = await res.json();

      localStorage.setItem("authToken", token);

      this.dispatchEvent(new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: ["auth/signin", { token, redirect: this.redirect }]
      }));
    } catch (err) {
      this.error = (err as Error).message || "Login failed";
    } finally {
      this.loading = false;
    }
  }
}

define({
  "login-form": LoginFormElement
});
