import express from "express";
import * as cartsController from '../controllers/carts.controllers.js'

const cartsRouter = express.Router();

cartsRouter.get('/:idCart', cartsController.getCart)
cartsRouter.post('/', cartsController.createCart)
cartsRouter.put('/:idCart/', cartsController.updateCart)
cartsRouter.put('/:idCart/product/:idProduct', cartsController.updateQuantity)
cartsRouter.post('/:idCart/product/:idProduct', cartsController.addProductToCart)
cartsRouter.delete('/:idCart', cartsController.deleteCart)
cartsRouter.put('/:idCart/product/:idProduct', cartsController.deleteProductFromCart)
cartsRouter.delete('/:idCart', cartsController.deleteCart)

export default cartsRouter;







