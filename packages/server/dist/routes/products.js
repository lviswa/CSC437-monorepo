"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var products_exports = {};
__export(products_exports, {
  default: () => products_default
});
module.exports = __toCommonJS(products_exports);
var import_express = __toESM(require("express"));
var import_product_svc = __toESM(require("../services/product-svc"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_product_svc.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:productid", (req, res) => {
  const { productid } = req.params;
  import_product_svc.default.get(productid).then((product) => {
    if (product) {
      res.json(product);
    } else {
      res.status(404).send("Product not found");
    }
  }).catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
  const newProduct = req.body;
  import_product_svc.default.create(newProduct).then((product) => {
    if (product) {
      res.status(201).json(product);
    } else {
      res.status(500).send("Failed to create product");
    }
  }).catch((err) => res.status(500).send(err));
});
router.put("/:productid", (req, res) => {
  const { productid } = req.params;
  const newProduct = req.body;
  import_product_svc.default.update(productid, newProduct).then((product) => res.json(product)).catch((err) => res.status(404).send(err));
});
router.patch("/:productid", async (req, res) => {
  const { productid } = req.params;
  const updates = req.body;
  try {
    const existing = await import_product_svc.default.get(productid);
    if (!existing) {
      res.status(404).send("Product not found");
      return;
    }
    const updated = {
      ...existing,
      ...updates,
      price: Number(updates.price ?? existing.price)
    };
    const saved = await import_product_svc.default.update(productid, updated);
    res.json(saved);
  } catch (err) {
    console.error("Error in PATCH:", err);
    res.status(500).send(err);
  }
});
router.delete("/:productid", (req, res) => {
  const { productid } = req.params;
  import_product_svc.default.remove(productid).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var products_default = router;
