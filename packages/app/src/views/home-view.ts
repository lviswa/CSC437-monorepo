import { html, css, LitElement } from "lit";

export class HomeViewElement extends LitElement {
  render() {
    return html`
      <main>
        <!-- Hero Section -->
        <section class="hero-section">
          <h1>DESI THREADS</h1>
          <p class="catchphrase">Sustainable Indian Fashion, Redefined.</p>
          <a href="#explore" class="explore-button">Explore</a>
        </section>

        <!-- Explore Women's Collection -->
        <section class="women-collection" id="explore">
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
        </section>

        <!-- Men's Collection -->
        <section class="men-collection">
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
        </section>

        <!-- Why Desi Threads -->
        <section class="why-desi-threads">
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
    main {
      display: block;
    }

    .hero-section {
      text-align: center;
      padding: 4rem 2rem;
      background: #fdf0e3;
    }

    .catchphrase {
      font-style: italic;
      margin: 1rem 0;
    }

    .explore-button {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.5rem 1.5rem;
      background: #b25c5c;
      color: white;
      text-decoration: none;
      font-weight: bold;
      border-radius: 4px;
    }

    section {
      padding: 3rem 2rem;
    }

    .text-content {
      max-width: 500px;
    }

    .image-content img {
      max-width: 100%;
      height: auto;
    }

    .shop-button {
      margin-top: 1rem;
      display: inline-block;
      padding: 0.5rem 1.5rem;
      background-color: #222;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }

    .why-desi-threads {
      background-color: #f8f8f8;
      text-align: center;
    }
  `;
}
