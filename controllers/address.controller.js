import { addressModel } from "../models/address.model.js";
import { userModel } from "../models/user.model.js";

export const addAddress = async (req, res) => {
    try {
        let user = req.user;
        let {firstName, lastName, email, street, city, state, zipCode, country, phoneNumber} = req.body;
        let existedUser = await userModel.findById(user._id);
        if (!existedUser) {
            return res.status(404).json({status: "failed", message: "user not found, id may wrong"});
        }
        if (!firstName || !lastName || !email || !street || !city || !state || !zipCode || !country || !phoneNumber) {
             return res.status(400).json({status: "failed", message: "All fields are required"});
        }
        let newAddress = new addressModel({
            firstName,
            lastName,
            email,
            state,
            street,
            city,
            zipCode,
            country,
            phoneNumber,
            userId: user._id
        })
        await newAddress.save()
        res.status(201).json({status: "success", message: "Address added sucessfully", data: newAddress})
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});
    }
}

export const getAddress = async (req, res) => {
    try {
        let user = req.user;
        let addresses = await addressModel.find({userId: user._id});
        if (addresses.length === 0) {
            return res.status(404).json({status: "failed", message: "Not address found, please add first address"});
        }
        res.status(200).json({status: "success", message: "addresses fetch successfully", data: addresses})
    } catch (error) {
      console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"});   
    }
}
