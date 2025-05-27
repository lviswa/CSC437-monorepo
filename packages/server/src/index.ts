import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Products from "./services/product-svc";

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "../proto/dist";

app.use(express.static(staticDir));
connect("desithreads"); 


app.get("/products", async (req: Request, res: Response) => {
  const list = await Products.index();
  res.set("Content-Type", "application/json").send(JSON.stringify(list));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
