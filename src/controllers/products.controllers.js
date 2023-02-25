import productService from "../services/products.services.js";
import { STATUS } from "../constant/constant.js";

export async function getProduct(req, res) {
  try {
    const { idProduct } = req.params;
    const response = await productService.getProduct(idProduct);
    res.json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}

export async function getProducts(req, res) {
  try {
    const {limit, sort, page, category} = req.query;
    const options = {
        limit: limit? Number(limit) : 10,
        page: page? Number(page) : 1,
        ...(sort && { sort: {price: sort} }),
        ...(category && { category }),
        lean: true
    }

    let query= {};
    if (category) query = {category: category};

    const paginatedData = await productService.getProducts(query, options);

    if (paginatedData) {
        res.status(200).json({
            success: true,
            data: paginatedData.docs
        })
    } else {
        res.status(404).json({
            success: false,
            message: 'Products not found'
        });
    }
} catch (error) {
    res.status(500).json({ Error: error.message });
}
}

export async function createProduct(req, res) {
  try {
    const { body } = req;
    const response = await productService.createProduct(body);
    res.status(201).json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function updateProduct(req, res) {
  try {
    const { idProduct } = req.params;
    const { body } = req;
    const response = await productService.updateProduct(idProduct, body);
    res.status(201).json({
      product: response,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}
export async function deleteProduct(req, res) {
  try {
    const { idProduct } = req.params;
    await productService.deleteProduct(idProduct);
    res.status(201).json({
      message: `Product (ID = ${idProduct})Producto borrado correctamente`,
      status: STATUS.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
      status: STATUS.FAIL,
    });
  }
}