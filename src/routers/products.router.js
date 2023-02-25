import express from "express";
import ProductManager from "../dao/ProductsManager.js";
import * as ProductController from "../controllers/products.controllers.js"


const route = express.Router();

  route.get("/", ProductController.getProducts);
  route.get("/:idProduct", ProductController.getProduct);
  route.post("/", ProductController.createProduct);
  route.put("/:idProduct", ProductController.updateProduct);
  route.delete("/:idProduct", ProductController.deleteProduct);

export default route;





export const productManager = new ProductManager();


