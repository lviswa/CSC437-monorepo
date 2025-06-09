import"./modulepreload-polyfill-B5Qt9EMX.js";import{i as g,x as n,r as x,a as v,n as p,b as $,d as y,c as k}from"./reset.css-45SUcpOs.js";var w=Object.defineProperty,u=(d,t,o,e)=>{for(var r=void 0,i=d.length-1,c;i>=0;i--)(c=d[i])&&(r=c(t,o,r)||r);return r&&w(t,o,r),r};const l=class l extends g{render(){return n`
      <div class="product-card">
        <img src="${this.imgSrc}" alt="${this.name}" />
        <div class="product-info">
          <h3>${this.name}</h3>
          <p>${this.price}</p>
        </div>
      </div>
    `}};l.styles=[x.styles,v`
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
    `];let s=l;u([p({attribute:"img-src"})],s.prototype,"imgSrc");u([p()],s.prototype,"name");u([p()],s.prototype,"price");var S=Object.defineProperty,b=(d,t,o,e)=>{for(var r=void 0,i=d.length-1,c;i>=0;i--)(c=d[i])&&(r=c(t,o,r)||r);return r&&S(t,o,r),r};const h=class h extends g{constructor(){super(...arguments),this.products=[]}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src)}hydrate(t){const o=localStorage.getItem("authToken");fetch(t,{headers:{Authorization:`Bearer ${o}`}}).then(e=>{if(!e.ok)throw new Error(`HTTP ${e.status}`);return e.json()}).then(e=>{Array.isArray(e)&&(this.products=e)}).catch(e=>{console.error("Failed to load products:",e)})}render(){return n`
      <div class="product-grid">
        ${this.products.map(t=>n`
            <desi-product
              img-src="${t.imgSrc}"
              name="${t.name}"
              price="${t.price}"
            ></desi-product>
          `)}
      </div>
    `}};h.styles=v`
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
  `;let a=h;b([p()],a.prototype,"src");b([$()],a.prototype,"products");y({"desi-products":a});y({"mu-auth":k.Provider,"desi-product":s,"desi-products":a});const m=localStorage.getItem("authToken"),f=document.querySelector("desi-products");f&&m&&(f.token=m);
