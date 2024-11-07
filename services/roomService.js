const Room = require("../models/Room");

exports.createRoom = async (phone) => {
    const room = new Room({ phone });
    return await room.save();
};

exports.findRoomByPhone = async (phone) => {
    return await Room.findOne({ phone });
};

