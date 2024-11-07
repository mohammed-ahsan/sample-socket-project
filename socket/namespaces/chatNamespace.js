const Room = require("../../models/Room");

module.exports = (socket) => {
    console.log("User connected to chat namespace:", socket.id);

    socket.on("joinRoom", async ({ phone }) => {
        const room = await Room.findOne({ phone });
        if (room) {
            socket.join(room.phone);
            socket.emit("joinedRoom", `Joined room for ${phone}`);
        } else {
            socket.emit("error", "Room not found");
        }
    });

    socket.on("sendMessage", async ({ phone, message }) => {
        const room = await Room.findOne({ phone });
        if (room) {
            room.messages.push(message);
            await room.save();
            socket.to(phone).emit("receiveMessage", { message });
        } else {
            socket.emit("error", "Room not found");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected from chat namespace:", socket.id);
    });
};
