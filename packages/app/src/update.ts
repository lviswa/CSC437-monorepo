import { Auth, Update } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model, DesiProduct } from "./model";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
): void {
  switch (message[0]) {
    case "products/load":
      console.log("📦 [update] Loading products...");
      loadProducts(user).then((products: DesiProduct[]) => {
        console.log("✅ [update] Loaded products:", products);
        apply((model: Model) => ({ ...model, products }));
      });
      return;

    case "products/set":
      console.log("📦 [update] Setting products directly:", message[1].products);
      apply((model: Model) => ({ ...model, products: message[1].products }));
      return;

    case "product/save": {
      const { id, product, onSuccess, onFailure } = message[1];
      console.log("📝 [update] Saving product:", id, product);

      // Ensure price is saved as a number
      const cleanProduct = {
        ...product,
        price: Number(product.price),
      };

      saveProduct(id, cleanProduct, user)
        .then(() => {
          console.log("✅ [update] Save successful. Reloading products.");
          return loadProducts(user); // 🔁 Refresh from server
        })
        .then((products: DesiProduct[]) => {
          apply((model: Model) => ({ ...model, products }));
          onSuccess?.();
        })
        .catch((err) => {
          console.error("❌ [update] Save failed:", err);
          onFailure?.(err);
        });

      return;
    }

    default:
      const unhandled: never = message[0];
      throw new Error(`Unhandled message "${unhandled}"`);
  }
}

function loadProducts(user: Auth.User): Promise<DesiProduct[]> {
  console.log("📡 [loadProducts] Fetching with user:", user);
  return fetch("/api/products", {
    headers: Auth.headers(user),
  })
    .then((res) => (res.status === 200 ? res.json() : []))
    .then((json) => {
      console.log("📄 [loadProducts] Raw server product data:", json);
      const mapped = json.map((item: any) => ({
        id: item.productid,
        name: item.name,
        price: Number(item.price),
        image: item.imgSrc,
        category: item.category ?? "women",
      }));
      console.log("✅ [loadProducts] Mapped products:", mapped);
      return mapped;
    });
}

function saveProduct(
  id: string,
  product: DesiProduct,
  user: Auth.User
): Promise<void> {
  console.log("📡 [saveProduct] PATCH /api/products/" + id, product);
  return fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: {
      ...Auth.headers(user),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  }).then((res) => {
    if (!res.ok) {
      return res.text().then((text) => {
        throw new Error(`Failed to save product: ${res.status} ${text}`);
      });
    } else {
      console.log("✅ [saveProduct] Server confirmed save.");
    }
  });
}
