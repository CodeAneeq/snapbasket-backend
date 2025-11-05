import mongoose from "mongoose";

export default async function connectDB(URI) {
    try {
      await mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, 
    socketTimeoutMS: 45000, 
});
        console.log("Mongo DB Connected Successfully");
    } catch (error) {
        console.log("Mongo Db Failed", error);
    }
}
