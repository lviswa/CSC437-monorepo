import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { Model } from "../model";
import { Msg } from "../messages";

export class HomeViewElement extends View<Model, Msg> {
  constructor() {
    super("desi:model");
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.dispatchMessage(["products/load", {}]);
  }

  render() {
    return html`
      <main class="page">
        <!-- Hero Section -->
        <section class="hero-section section">
        <a class="logo-link" href="/app">
          <img src="/assets/logo.png" class="logo-img" alt="Desi Threads Logo" />
          <h1 class="site-title">DESI THREADS</h1>
        </a>
        <p class="catchphrase">Sustainable Indian Fashion, Redefined.</p>
        <a href="/app/login" class="explore-button">Login</a>
      </section>

        <!-- Explore Women's Collection -->
        <section class="women-collection section" id="explore">
          <div class="grid">
            <div class="text-content">
              <h2>Explore Our Women's Collection</h2>
              <p>
                Dive into curated sarees, lehengas, and more — celebrate tradition
                while embracing sustainability through preloved fashion treasures.
              </p>
              <a href="/app/women" class="shop-button">Shop Now</a>
            </div>
            <div class="image-content">
              <img src="/assets/woman-collection.png" alt="Indian Woman Wearing Saree" />
            </div>
          </div>
        </section>

        <!-- Men's Collection -->
        <section class="men-collection section">
          <div class="grid">
            <div class="image-content">
              <img src="/assets/mens-fashion.png" alt="Indian Men's Fashion" />
            </div>
            <div class="text-content">
              <h2>Featured Men's Fashion</h2>
              <p>
                Discover the elegance and charm of traditional Indian menswear.
                From embroidered kurtas to sherwanis, find sustainable styles that impress.
              </p>
              <a href="#" class="shop-button">Shop Now</a>
            </div>
          </div>
        </section>

        <!-- Why Desi Threads -->
        <section class="why-desi-threads section">
          <h2>Why Desi Threads?</h2>
          <p>
            We believe fashion should honor tradition and the planet. By giving a
            second life to timeless Indian clothing, Desi Threads empowers
            sustainability without sacrificing style. Join us in embracing
            eco-conscious fashion with deep-rooted cultural beauty.
          </p>
        </section>
      </main>
    `;
  }

  static styles = css`
    .hero-section {
      text-align: center;
      padding: 6rem 2rem;
      background-image: url('/assets/background.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      position: relative;
    }

    .hero-section::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.6);
      z-index: 0;
    }

    .hero-section h1,
    .hero-section .catchphrase,
    .hero-section .explore-button {
      position: relative;
      z-index: 1;
    }

    .catchphrase {
      font-size: 1.5rem;
      font-style: italic;
      color: gray;
      margin-bottom: 2rem;
    }

    .explore-button {
      background-color: black;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: bold;
    }

    .explore-button:hover {
      background-color: var(--color-accent-hover);
    }

    .section {
      padding: 6rem 2rem;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: center;
    }

    .text-content {
      max-width: 500px;
    }

    .image-content img {
      width: 100%;
      border-radius: 0.5rem;
    }

    .shop-button {
      background-color: black;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: bold;
    }

    .shop-button:hover {
      background-color: var(--color-accent-hover);
    }

    .why-desi-threads {
      width: 100%;
      text-align: center;
      background-color: var(--color-background-header);
    }

    .why-desi-threads h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .why-desi-threads p {
      font-size: 1.2rem;
      max-width: 800px;
      margin: 0 auto;
      color: #555;
    }
    .logo-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        justify-content: center;
        text-decoration: none;
        color: inherit;
        margin-bottom: 1rem;
      }
      
      .logo-img {
        width: 60px;
        height: auto;
      }
      
      .site-title {
        font-family: 'Playfair Display', serif;
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
      }      

    @media (max-width: 768px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `;
}
