import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { connect } from "./services/mongo";
import Products from "./services/product-svc";
import products from "./routes/products";
import auth, { authenticateUser } from "./routes/auth";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// connect to MongoDB
connect("desithreads");

app.use(cors());
app.use(express.json());

const PROTO_DIST = path.resolve(__dirname, "../../proto/dist");
app.use(express.static(PROTO_DIST));

const STATIC_HTML_DIR = path.resolve(__dirname, "../../proto");
app.use(express.static(STATIC_HTML_DIR));

// auth routes
app.use("/auth", auth);

// protected API
app.use("/api/products", authenticateUser, products);

app.get("/products", async (_, res: Response) => {
  const list = await Products.index();
  res.json(list);
});

app.get("/", (_, res) => {
  res.sendFile(path.join(PROTO_DIST, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
