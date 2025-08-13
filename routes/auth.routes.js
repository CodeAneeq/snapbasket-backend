import express from "express";
import { getAllUsers, googleLogin, login, signUp } from "../controllers/auth.controller.js";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";

const route = express.Router();

route.post('/sign-up', signUp);
route.post('/login', login);
route.get('/get-users', authMiddleware, checkAdmin , getAllUsers);
route.post('/google' , googleLogin);

export default route