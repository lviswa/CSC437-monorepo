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
      loadProducts(user).then((products: DesiProduct[]) => {
        apply((model: Model) => ({ ...model, products }));
      });
      return;

    case "products/set":
      apply((model: Model) => ({ ...model, products: message[1].products }));
      return;

    default:
      throw new Error(`Unhandled message "${message[0]}"`);
  }
}

function loadProducts(user: Auth.User): Promise<DesiProduct[]> {
  return fetch("/api/products", {
    headers: Auth.headers(user),
  })
    .then((res) => (res.status === 200 ? res.json() : []))
    .then((json) => {
      console.log("Fetched products:", json);
      return json as DesiProduct[];
    });
}
