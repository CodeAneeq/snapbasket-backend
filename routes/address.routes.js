import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { addAddress, getAddress } from "../controllers/address.controller.js";

const route = express.Router();

route.get('/get-addresses', authMiddleware, getAddress);
route.post('/add-address', authMiddleware, addAddress);

export default route