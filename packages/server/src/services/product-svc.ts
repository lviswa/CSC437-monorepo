import { Schema, model } from "mongoose";
import { Product } from "../models/product";

const ProductSchema = new Schema<Product>(
  {
    productid: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imgSrc: { type: String, required: true },
    category: { type: String, required: true }
  },
  { collection: "products" }
);

const ProductModel = model<Product>("Product", ProductSchema);

function index(): Promise<Product[]> {
  return ProductModel.find();
}

function get(productid: string): Promise<Product | null> {
  return ProductModel.findOne({ productid });
}

function create(json: Product): Promise<Product> {
  const p = new ProductModel(json);
  return p.save();
}

function update(productid: string, product: Product): Promise<Product> {
  return ProductModel.findOneAndUpdate({ productid }, product, { new: true }).then((updated) => {
    if (!updated) throw `${productid} not updated`;
    return updated as Product;
  });
}

function remove(productid: string): Promise<void> {
  return ProductModel.findOneAndDelete({ productid }).then((deleted) => {
    if (!deleted) throw `${productid} not deleted`;
  });
}

export default { index, get, create, update, remove };
