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
console.log("✅ Loaded MONGODB_URI:", process.env.MONGODB_URI);

const app = express();
const port = process.env.PORT || 3000;

connect("desithreads");

app.use(cors());
app.use(express.json());

// Set static directory (defaults to app/dist)
const staticDir = process.env.STATIC
  ? path.resolve(__dirname, process.env.STATIC)
  : path.resolve(__dirname, "../../app/dist");

app.use(express.static(staticDir));

app.use("/auth", auth);

app.use("/api/products", authenticateUser, products);

app.get("/products", async (_req, res: Response) => {
  try {
    const list = await Products.index();
    res.json(list);
  } catch (err) {
    console.error("Failed to load products:", err);
    res.status(500).send("Failed to load products");
  }
});

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

app.get("/", (_req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
