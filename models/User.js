const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    storeData: {
        storeName: { type: String }
    },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    savedShops: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    professional: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
