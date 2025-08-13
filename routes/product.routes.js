import express from "express";
import { checkAdmin, authMiddleware } from "../middleware/auth.middleware.js";
import { addProduct, changeStockStatus, deleteProduct, editProduct, getProductById, getProducts, getSearchProduct } from "../controllers/product.controller.js";
import upload from "../middleware/multer.middleware.js";

const route = express.Router();

route.post('/add-product', authMiddleware, checkAdmin, upload.array('imgs') , addProduct);
route.delete('/del-product/:id', authMiddleware, checkAdmin, deleteProduct);
route.get('/get-products', getProducts);
route.get('/get-product/:id', getProductById);
route.patch('/edit-product/:id', upload.array('imgs'), authMiddleware, checkAdmin, editProduct);
route.get('/search-product', getSearchProduct);
route.patch('/change-stock-status/:id', authMiddleware, changeStockStatus)

export default route