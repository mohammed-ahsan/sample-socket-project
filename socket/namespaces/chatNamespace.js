const Room = require("../../models/Room");

module.exports = (socket) => {
    
    console.log("User connected to chat namespace:", socket.id);
    
    // const phone = "123456789" // < comment out this line and comment socket.phone for client test 
    socket.phone;

    socket.on("joinRoom", async () => {

        const room = await Room.findOne({ phone });

        if (room) {
            socket.join(room.phone);
            socket.to(room.phone).emit("joinedRoom", `Joined room for ${phone}`);
        } else {
            socket.emit("error", "Room not found");
        }
    });

    socket.on("sendMessage", async ({ message }) => {

        const room = await Room.findOne({ phone });

        if (room) {
            room.messages.push(message);
            socket.emit("receiveMessage",  message );
            await room.save();
            socket.to(room.phone).emit("receiveMessage", { message });
        } else {
            socket.emit("error", "Room not found");
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected from chat namespace:", socket.id);
    });
};
