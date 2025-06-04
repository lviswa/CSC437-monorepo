import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "node:fs/promises";

import { connect } from "./services/mongo";
import Products from "./services/product-svc";
import products from "./routes/products";
import auth, { authenticateUser } from "./routes/auth";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connect("desithreads");

app.use(cors());
app.use(express.json());

// Static directory config
const staticDir = process.env.STATIC
  ? path.resolve(__dirname, process.env.STATIC)
  : path.resolve(__dirname, "../../proto/dist");

// Serve static files (e.g., CSS, JS, assets)
app.use(express.static(staticDir));

// Auth routes
app.use("/auth", auth);

// Protected product API
app.use("/api/products", authenticateUser, products);

// Sample unprotected products route for testing
app.get("/products", async (_, res: Response) => {
  const list = await Products.index();
  res.json(list);
});

// 🔹 Serve SPA for all /app routes
app.use("/app", async (_req: Request, res: Response) => {
  const indexHtml = path.join(staticDir, "index.html");
  try {
    const html = await fs.readFile(indexHtml, "utf8");
    res.send(html);
  } catch (err) {
    console.error("Failed to load app index.html", err);
    res.status(500).send("Internal Server Error");
  }
});

// 🔸 Optional: Serve index.html at root as fallback
app.get("/", (_, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
