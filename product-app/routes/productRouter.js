import { Router } from "express";
import { getProduct,getProductById } from "../controllers/productController.js";

const prdRouter=Router();

prdRouter.get("/",getProduct);

prdRouter.get("/:prdId",getProductById)

export default prdRouter;