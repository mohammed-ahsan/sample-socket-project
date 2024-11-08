const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    content: { type: String, required: true },
    seen: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

const roomSchema = new mongoose.Schema({
    conversationId: { type: String, required: true, unique: true }, // Format: `${productId}_${userId1}_${userId2}`
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productTitle: { type: String, required: true },
    productImage: { type: String, required: true },
    participants: { 
        sender: { type: String, required: true }, 
        receiver: { type: String, required: true }
    },
    messages: [messageSchema],
    blockedUsers: [{ type: String, required: true }],
    blocked: { type: Boolean, default: false } // Indicates if the conversation is blocked
});

module.exports = mongoose.model("Room", roomSchema);
