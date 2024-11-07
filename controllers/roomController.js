const Room = require("../models/Room");

exports.createRoom = async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone number is required" });
    try {
        const room = new Room({ phone });
        await room.save();
        res.status(201).json({ message: "Room created", room });
    } catch (error) {
        res.status(400).json({ message: "Room creation failed", error });
    }
};

exports.getRoom = async (req, res) => {
    try {
        const room = await Room.findOne({ phone: req.phone });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json(room);
    } catch (error) {
        res.status(500).json({ message: "Failed to get room", error });
    }
};

exports.updateRoom = async (req, res) => {
    const { newPhone } = req.body;
    if (!newPhone) return res.status(400).json({ message: "New phone number is required" });
    try {
        const room = await Room.findOneAndUpdate({ phone: req.phone }, { phone: newPhone }, { new: true });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room updated", room });
    } catch (error) {
        res.status(500).json({ message: "Failed to update room", error });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findOneAndDelete({ phone: req.phone });
        if (!room) return res.status(404).json({ message: "Room not found" });
        res.status(200).json({ message: "Room deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete room", error });
    }
};
