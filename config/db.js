
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;

        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env");
        }

        if (!MONGODB_URI.startsWith("mongodb+srv://")) {
            throw new Error(
                "MONGODB_URI is not an Atlas SRV connection string"
            );
        }

        await mongoose.connect(MONGODB_URI);

        console.log("MongoDB Atlas connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;
