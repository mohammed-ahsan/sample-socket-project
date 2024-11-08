const Room = require("../models/Room");
const { v4: uuidv4 } = require('uuid'); 
exports.createRoom = async (req, res) => {
    const { productId, productTitle, productImage, user1Id, user2Id } = req.body;
    const conversationId = `${productId}_${user1Id}_${user2Id}`;
    //const conversationId = uuidv4();
    try {
        let room = await Room.findOne({ conversationId });
        
        if (!room) {
            room = new Room({
                conversationId,
                productId,
                productTitle,
                productImage,
                participants: [user1Id, user2Id]
            });
            await room.save();
        }

        res.status(201).json({ message: "Room created or already exists", room });
    } catch (error) {
        res.status(400).json({ message: "Room creation failed", error });
    }
};

exports.sendMessage = async (req, res) => {
    const { conversationId, senderId, content } = req.body;

    try {
        const room = await Room.findOne({ conversationId });
        if (!room) return res.status(404).json({ message: "Room not found" });

        if (room.blocked) return res.status(403).json({ message: "Conversation is blocked" });

        const message = { sender: senderId, content, seen: false };
        room.messages.push(message);
        await room.save();

        res.status(200).json({ message: "Message sent", room });
    } catch (error) {
        res.status(500).json({ message: "Failed to send message", error });
    }
};

exports.toggleBlock = async (req, res) => {
    const { conversationId } = req.params;

    try {
        const room = await Room.findOne({ conversationId });
        if (!room) return res.status(404).json({ message: "Room not found" });

        room.blocked = !room.blocked;
        await room.save();

        res.status(200).json({ message: `Conversation ${room.blocked ? 'blocked' : 'unblocked'}` });
    } catch (error) {
        res.status(500).json({ message: "Failed to toggle block", error });
    }
};


exports.getRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: "Failed to get room", error });
    }
};

exports.updateRoom = async (req, res) => {
    const { roomId } = req.params;
    const { newPhone, ...otherUpdates } = req.body;
    
    if (!newPhone) return res.status(400).json({ message: "New phone number is required" });
    try {
        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { phone: newPhone, ...otherUpdates },
            { new: true }
        );
        if (!updatedRoom) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room updated", room: updatedRoom });
    } catch (error) {
        res.status(500).json({ message: "Failed to update room", error });
    }
};

exports.deleteRoom = async (req, res) => {
    const { roomId } = req.params;
    try {
        const room = await Room.findByIdAndDelete(roomId);
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete room", error });
    }
};
