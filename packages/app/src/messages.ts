import { DesiProduct } from "./model";

export type Msg =
  | ["products/load", {}]
  | ["products/set", { products: DesiProduct[] }]
  | [
      "product/save",
      {
        id: string;
        product: DesiProduct;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ];
