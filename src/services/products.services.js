import ProductModel from "../dao/models/products.models.js";
import webSocketService from './websocket.services.js';

class ProductService {

  async createProduct(data) {
    try {
        const newProduct = await ProductModel.create(data);
       
        const productsList = await this.getProducts();
        webSocketService.io.emit('reloadList', productsList);

        return newProduct;
    } catch (error) {
        throw new Error(error.message)
    }
}

async getProducts(query, options) {
    try {
        query = {...{deleted: false}, ...query}
        
        const paginatedList = await ProductModel.paginate(query, options);
       
        webSocketService.io.emit('reloadList', paginatedList.docs);

        const newData = {
            ...paginatedList,
            options
        }

        return newData;
    } catch (error) {
        throw new Error(error.message)
    }
}

async getProduct(idProduct) {
    try {
        const product = await ProductModel.findById(idProduct).lean();
        return product;
    } catch (error) {
        throw new Error(error.message)
    }
}

async updateProduct(idProduct, data) {
    try {
        console.log(data);
        const updatedProduct = await ProductModel.findByIdAndUpdate(idProduct, data, {new: true}).lean();
         
        const productsList = await this.getProducts();
        webSocketService.io.emit('reloadList', productsList);

        return updatedProduct;
    } catch (error) {
        throw new Error(error.message)
    }
}

async deleteProduct(idProduct) {
    try {
        await ProductModel.deleteById(idProduct);

        const productsList = await this.getProducts();
        webSocketService.io.emit('reloadList', productsList);

    } catch (error) {
        throw new Error(error.message)
    }
}
}

const productService = new ProductService();
export default productService;