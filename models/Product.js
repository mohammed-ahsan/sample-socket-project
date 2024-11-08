const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    features: [{ title: { type: String, required: true } }],
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    available: { type: Boolean, default: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true },
    priceNegotiable: { type: Boolean, default: false },
    filters: {
        location: [{ title: { type: String }, id: { type: String } }],
        sizeArea: { type: String },
        numberOfRooms: { type: String },
        condition: [{ title: { type: String }, id: { type: String } }],
        amenities: [{ title: { type: String }, id: { type: String } }],
        floorLevel: [{ title: { type: String }, id: { type: String } }],
        heatingType: [{ title: { type: String }, id: { type: String } }],
        energyEfficiency: [{ title: { type: String }, id: { type: String } }],
        view: [{ title: { type: String }, id: { type: String } }]
    },
    contactInformation: {
        country: { type: String },
        state: { type: String },
        name: { type: String },
        phone: { type: String },
        other: { type: String }
    },
    images: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
