import express, { Request, Response } from "express";
import Products from "../services/product-svc";
import { Product } from "../models/product";

const router = express.Router();

// GET /api/products
router.get("/", (_, res: Response) => {
  Products.index()
    .then((list: Product[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

// GET /api/products/:productid
router.get("/:productid", (req: Request, res: Response) => {
  const { productid } = req.params;

  Products.get(productid)
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).send("Product not found");
      }
    })
    .catch((err) => res.status(500).send(err));
});

// POST /api/products
router.post("/", (req: Request, res: Response) => {
  const newProduct = req.body;

  Products.create(newProduct)
    .then((product) => {
      if (product) {
        res.status(201).json(product);
      } else {
        res.status(500).send("Failed to create product");
      }
    })
    .catch((err) => res.status(500).send(err));
});

// PUT /api/products/:productid
router.put("/:productid", (req: Request, res: Response) => {
  const { productid } = req.params;
  const newProduct = req.body;

  Products.update(productid, newProduct)
    .then((product: Product) => res.json(product))
    .catch((err) => res.status(404).send(err));
});

// DELETE /api/products/:productid
router.delete("/:productid", (req: Request, res: Response) => {
  const { productid } = req.params;

  Products.remove(productid)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
