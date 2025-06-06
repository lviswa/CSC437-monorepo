import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "node:fs/promises";

import cors from "cors";
import { connect } from "./services/mongo";
import Products from "./services/product-svc";
import products from "./routes/products";
import auth, { authenticateUser } from "./routes/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connect("desithreads");

app.use(cors());
app.use(express.json());

// Set static directory (defaults to app/dist)
const staticDir = process.env.STATIC
  ? path.resolve(__dirname, process.env.STATIC)
  : path.resolve(__dirname, "../../app/dist");

app.use(express.static(staticDir));

// --- API Routes ---
app.use("/auth", auth);
app.use("/api/products", authenticateUser, products);

// --- Optional testing route ---
app.get("/products", async (_req, res: Response) => {
  try {
    const list = await Products.index();
    res.json(list);
  } catch (err) {
    console.error("Failed to load products:", err);
    res.status(500).send("Failed to load products");
  }
});

// --- Catch-all route to support SPA routing ---
app.get("*", async (req: Request, res: Response) => {
  const indexPath = path.join(staticDir, "index.html");
  try {
    const html = await fs.readFile(indexPath, "utf8");
    res.send(html);
  } catch (err) {
    console.error("Failed to load index.html for route", req.url, err);
    res.status(500).send("Internal Server Error");
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
