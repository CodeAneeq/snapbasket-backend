import mongoose, { Mongoose, Schema } from "mongoose";

const addressSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    street: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zipCode: {type: Number, required: true},
    country: {type: String, required: true},
    phoneNumber: {type: Number, required: true},
    userId: {type: mongoose.Types.ObjectId, ref: 'user', required: true}
})

export const addressModel = mongoose.model('address', addressSchema)