import CartModel from "../dao/models/carts.models.js";
import productService from "../services/products.services.js";

class CartServices {

    async createCart() {
        try {
            const newCart = await CartModel.create({new: true});

            return newCart;
            
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
    async getCart(idCart) {
        try {
            const cart = await CartModel.findById(idCart).lean().populate("Products");
            return cart;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteCart(idCart) {
        try {
            await CartModel.findByIdAndDelete(idCart).lean();
        } catch (error) {
            throw new Error(error.message);
        }
    }

async addProductToCart(idCart, idProduct, quantity) {
  try {
     
      const cart = await CartModel.findById(idCart);
      if (!cart) {
        throw new Error("Cart not found");
    }
    const productIsInCart = cart.products.some(prod => prod.product.equals(idProduct)); 
    let updatedCart = {};
    if (productIsInCart) { 
        const cart = await CartModel.findOneAndUpdate(
            { _id: cartID, 'products.product': idProduct },
            { $inc: {'products.$.quantity': quantity} },
            { new: true }
        ).lean()
        updatedCart = {...cart};
    } else {
        const cart = await CartModel.findOneAndUpdate(
            { _id: idCart },
            { $push: {products: {product: idProduct, quantity}} },
            { new: true }
        ).lean()
        updatedCart = {...cart};
    }

    return updatedCart;

} catch (error) {
    throw new Error(error.message);
} 
     
      
} 

async updateQuantity(idCart,idProduct, quantity) {
    try {
        const cart = await CartModel.findByIdAndUpdate(
            idCart,
            { $set: {'products.$[elem].quantity': quantity } },
            { arrayFilters: [{ 'elem.product': idProduct }], new: true }
        )
        return cart                
    } catch (error) {
        throw new Error(error.message);
    }
}
async updateCart(idCart, cartData) {
    try {
        const updatedCart = await CartModel.findByIdAndUpdate(idCart, { products: cartData }, { new: true });
        return updatedCart;
    } catch (error) {
        throw new Error(error.message);
    }
}

async deleteProductFromCart(idCart, idProduct, quantity) {
    try { // Check comments in addProductToCart
        const cart = await CartModel.findById(idCart);
        const product = await productService.getProduct(idProduct);

        if (cart && product) {
            let productIndex = cart.Products.findIndex(prod => prod.idProduct === idProduct);
            if (productIndex != -1) { // Technically index will always be != -1 because it comes from the cart, but just in case
                cart.Products.splice(productIndex, 1);
                cart.subtotal = cart.Products.map(prod => prod.total).reduce((acc, curr) => acc + curr);
            }
        }
        return await cart.save();
    } catch (error) {
        throw new Error(error.message);
    }
}
async deleteCart(idCart) {
  try {
      await CartModel.findByIdAndDelete(idCart).lean();
  } catch (error) {
      throw new Error(error.message);
  }
}

}

const cartServices = new CartServices();
export default cartServices;