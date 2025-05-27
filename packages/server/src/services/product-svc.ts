import { Schema, model } from "mongoose";
import { Product } from "../models/product";

const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    imgSrc: { type: String, required: true }
  },
  { collection: "products" }
);

const ProductModel = model<Product>("Product", ProductSchema);

function index(): Promise<Product[]> {
  return ProductModel.find();
}

function get(name: string): Promise<Product | null> {
  return ProductModel.findOne({ name });
}

export default { index, get };
