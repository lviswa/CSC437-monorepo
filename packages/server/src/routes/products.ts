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

// PUT /api/products/:productid (replace entire product)
router.put("/:productid", (req: Request, res: Response) => {
  const { productid } = req.params;
  const newProduct = req.body;

  Products.update(productid, newProduct)
    .then((product: Product) => res.json(product))
    .catch((err) => res.status(404).send(err));
});

// PATCH /api/products/:productid
router.patch("/:productid", async (req: Request, res: Response): Promise<void> => {
  const { productid } = req.params;
  const updates = req.body;

  try {
    const existing = await Products.get(productid);
    if (!existing) {
      res.status(404).send("Product not found");
      return;
    }
    const updated = {
      ...existing,
      ...updates,
      price: Number(updates.price ?? existing.price),
    };    
    const saved = await Products.update(productid, updated);
    res.json(saved);
  } catch (err) {
    console.error("Error in PATCH:", err);
    res.status(500).send(err);
  }
});

// DELETE /api/products/:productid
router.delete("/:productid", (req: Request, res: Response) => {
  const { productid } = req.params;

  Products.remove(productid)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;
