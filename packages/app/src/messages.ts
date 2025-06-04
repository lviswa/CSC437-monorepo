import { DesiProduct } from "./model";

export type Msg =
  | ["products/load", {}]
  | ["products/set", { products: DesiProduct[] }];
