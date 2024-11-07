const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true },
    messages: { type: [String], default: [] },
});

module.exports = mongoose.model("Room", roomSchema);
