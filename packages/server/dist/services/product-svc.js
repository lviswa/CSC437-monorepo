"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var product_svc_exports = {};
__export(product_svc_exports, {
  default: () => product_svc_default
});
module.exports = __toCommonJS(product_svc_exports);
var import_mongoose = require("mongoose");
const ProductSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: String, required: true },
    imgSrc: { type: String, required: true }
  },
  { collection: "products" }
);
const ProductModel = (0, import_mongoose.model)("Product", ProductSchema);
function index() {
  return ProductModel.find();
}
function get(name) {
  return ProductModel.findOne({ name });
}
var product_svc_default = { index, get };
