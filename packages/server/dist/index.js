"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_express = __toESM(require("express"));
var import_dotenv = __toESM(require("dotenv"));
var import_path = __toESM(require("path"));
var import_promises = __toESM(require("node:fs/promises"));
var import_cors = __toESM(require("cors"));
var import_mongo = require("./services/mongo");
var import_product_svc = __toESM(require("./services/product-svc"));
var import_products = __toESM(require("./routes/products"));
var import_auth = __toESM(require("./routes/auth"));
import_dotenv.default.config();
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
(0, import_mongo.connect)("desithreads");
app.use((0, import_cors.default)());
app.use(import_express.default.json());
const staticDir = process.env.STATIC ? import_path.default.resolve(__dirname, process.env.STATIC) : import_path.default.resolve(__dirname, "../../app/dist");
app.use(import_express.default.static(staticDir));
app.use("/auth", import_auth.default);
app.use("/api/products", import_auth.authenticateUser, import_products.default);
app.get("/products", async (_req, res) => {
  try {
    const list = await import_product_svc.default.index();
    res.json(list);
  } catch (err) {
    console.error("Failed to load products:", err);
    res.status(500).send("Failed to load products");
  }
});
app.use("/app", async (_req, res) => {
  const indexPath = import_path.default.join(staticDir, "index.html");
  try {
    const html = await import_promises.default.readFile(indexPath, "utf8");
    res.send(html);
  } catch (err) {
    console.error("Failed to load app index.html", err);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/", (_req, res) => {
  res.sendFile(import_path.default.join(staticDir, "index.html"));
});
app.listen(port, () => {
  console.log(`\u{1F680} Server running at http://localhost:${port}`);
});
