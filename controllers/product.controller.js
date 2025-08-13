import { cloudinary } from "../config/cloudinary.config.js";
import Constants from "../constant.js";
import { productModel } from "../models/product.model.js";

export const addProduct = async (req, res) => {
    try {
        if (!req.files) {
            return res.status(404).json({status: "failed", message: "Images are required"});
        }
        let {title, orignalPrice, discountedPrice, description, category, rating} = req.body;
        if (!title || !orignalPrice || !discountedPrice || !description || !category) {
            return res.status(404).json({status: "failed", message: "All fields are required"});
        }
        let productExisted = await productModel.findOne({title});        
        if (productExisted) {
            return res.status(400).json({status: "failed", message: "Title already existed"});
        }
        const images = req.files.map((item) => item.path);
        const product = new productModel({
            title, 
            orignalPrice, 
            discountedPrice,
            rating,
            description,
            category,
            images
        })
        await product.save()
        res.status(200).json({status: "success", message: "Product Created Successfully", data: product})
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}

export const deleteProduct = async (req, res) => {
    try {
        let id = req.params.id;
        let product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({status: "failed", message: "Product not Found"});
        }
        for (let publicId of product.images) {
            await cloudinary.uploader.destroy(publicId);
        }
        await productModel.findByIdAndDelete(id);
        res.status(200).json({status: "success", message: "Product delete successfully", data: product})
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}

export const editProduct = async (req, res) => {
    try {
        let id = req.params.id;
        if (!req.files) {
            return res.status(404).json({status: "failed", message: "IMages cant be empty"});
        }
        let {title, orignalPrice, discountedPrice, description, qty, category} = req.body;
        if (!title || !orignalPrice || !discountedPrice || !description || !qty || !category) {
            return res.status(404).json({status: "failed", message: "All fields are required"});
        }
        let product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({status: "failed", message: "Product not found, id may wrong"});
        }
        const images = req.files.map(file => file.path);
        product.title = title;
        product.orignalPrice = orignalPrice;
        product.discountedPrice = discountedPrice;
        product.description = description;
        product.qty = qty;
        product.category = category;
        product.images = images;
        await product.save();
        res.status(201).json({status: "success", message: "Product Updated Successfully", data: product});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})
    }
}

export const getProducts = async (req, res) => {
    try {
        let products = await productModel.find();
        res.status(200).json({status: "success", message: "Products fetch successfully", data: products});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export const getProductById = async (req, res) => {
    try {
        let id = req.params.id;
        let product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({status: "failed", message: "Product not found"});
        }
        res.status(200).json({status: "success", message: "Products fetch successfully", data: product});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export const getSearchProduct = async (req, res) => {
    try {
        let keyword = req.query.search;
        let products = await productModel.find({
            title: { $regex: keyword, $options: 'i' }
        })
        if (products.length === 0) {
            return res.status(404).json({status: "failed", message: "No product found"});
        }
        res.status(200).json({status: "success", message: "Products fetch successfully", data: products});
    } catch (error) {
        console.log(error);
         res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export const changeStockStatus = async (req, res) => {
    try {
        let productId = req.params.id;
        let {status} = req.body;
        console.log(status)
        let product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({status: "failed", message: "Product Not found, Id is wrong"});
        }
        product.status = status;
        await product.save();
        res.status(200).json({status: 'success', message: "Status Change Successfully", data: product});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: 'failed', message: "Internal Server Error"});
    }
}