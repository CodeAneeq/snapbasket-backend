import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { userModel } from "../models/user.model.js";
import Constants from "../constant.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(Constants.GOOGLE_CLIENT_ID);

export const signUp = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(404).json({ status: "failed", message: "All fields are required" });
        }
        const existedUser = await userModel.findOne({ email });
        console.log(existedUser);

        if (existedUser) {
            return res.status(404).json({ status: "failed", message: "Email already registered" });
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(String(password), salt);
        const user = new userModel({
            name,
            email,
            password: hashPassword
        })
        await user.save()
        let payload = {
            newUser: {
                id: user._id
            }
        }
        const token = await jwt.sign(payload, Constants.SECRET_KEY, { expiresIn: '1y' });
        user.token = token;
        await user.save();
        res.status(201).json({ status: "success", message: "User Sign Up Successfully", data: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ status: "failed", message: "All fields are required" });
        }
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "failed", message: "Email is wrong" });
        }
        const isMatch = await bcrypt.compare(String(password), user.password);
        if (!isMatch) {
            return res.status(404).json({ status: "failed", message: "Password is wrong" });
        }
        let payload = {
            newUser: {
                id: user._id
            }
        }
        const token = await jwt.sign(payload, Constants.SECRET_KEY, { expiresIn: '1y' });
        user.token = token;
        await user.save();
        res.status(201).json({ status: "success", message: "User Login Successfully", data: user });


    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        let users = await userModel.find();
        res.status(200).json({ status: "success", message: "users fetch successfully", data: users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", message: "Internal Server Error" })
    }
}

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: Constants.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await userModel.findOne({ email });

    if (!user) {
      user = new userModel({
        name,
        email,
        password: null, // Google user ka password nahi hota
      });
      await user.save();
    }

    // Apna JWT banake bhejo
    const myPayload = { newUser: { id: user._id } };
    const myToken = jwt.sign(myPayload, Constants.SECRET_KEY, { expiresIn: "1y" });
    user.token = myToken;
    await user.save();

    res.status(200).json({
      status: "success",
      message: "Google login successful",
      data: user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed", message: "Google login failed" });
  }
};
