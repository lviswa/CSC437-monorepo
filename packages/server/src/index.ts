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

// Set static directory
const staticDir = process.env.STATIC
  ? path.resolve(__dirname, process.env.STATIC)
  : path.resolve(__dirname, "../../proto/dist");

// Serve static assets (CSS, JS, etc.)
app.use(express.static(staticDir));

// Auth routes
app.use("/auth", auth);

// ✅ Protected product routes
app.use("/api/products", authenticateUser, products);

// 🔍 Optional unprotected GET for testing
app.get("/products", async (_req, res: Response) => {
  try {
    const list = await Products.index();
    res.json(list);
  } catch (err) {
    console.error("Failed to load products:", err);
    res.status(500).send("Failed to load products");
  }
});

// 🔹 Serve index.html for all /app routes (SPA support)
app.use("/app", async (_req: Request, res: Response) => {
  const indexPath = path.join(staticDir, "index.html");
  try {
    const html = await fs.readFile(indexPath, "utf8");
    res.send(html);
  } catch (err) {
    console.error("Failed to load app index.html", err);
    res.status(500).send("Internal Server Error");
  }
});

// 🔸 Optional fallback to serve SPA from root
app.get("/", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
