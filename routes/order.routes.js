import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { changeStatusByAdmin, createOrder, getOrders, getUserOrders, stripeWebhook } from "../controllers/order.controller.js";
import bodyParser from "body-parser";

const route = express.Router();

route.post('/create-order', authMiddleware , createOrder);
route.get('/get-all-orders', authMiddleware, checkAdmin, getOrders);
route.get('/get-my-orders', authMiddleware, getUserOrders);
route.post('/change-status', authMiddleware, checkAdmin, changeStatusByAdmin);

export default route