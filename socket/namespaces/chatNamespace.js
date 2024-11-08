const Room = require("../../models/Room");

module.exports = (socket) => {
    const phone = socket.phone;

    socket.on("joinRoom", async (payload) => {
        try {
            const { conversationId } = payload
            const room = await Room.findOne({ conversationId });

            if (room) {
                // Check if user is blocked in the room
                if (room.blockedUsers && room.blockedUsers.includes(phone)) {
                    return socket.emit("error", { message: "You are blocked from this room" });
                }

                socket.join(conversationId);
                socket.emit("joinedRoom", { message: "Joined the room", room });
            } else {
                socket.emit("error", { message: "Room not found" });
            }
        } catch (error) {
            socket.emit("error", { message: "Error joining room", error });
        }
    });

    socket.on("sendMessage", async ({ conversationId, content }) => {
        try {
            const room = await Room.findOne({ conversationId });

            if (room) {
                if (room.blocked || (room.blockedUsers && room.blockedUsers.includes(phone))) {
                    return socket.emit("error", { message: "You are blocked from sending messages in this room" });
                }

                const message = { sender: phone, content, seen: false };
                room.messages.push(message);
                await room.save();

                socket.to(conversationId).emit("receiveMessage", { message });
                socket.emit("messageStatus", { seen: message.seen });
            } else {
                socket.emit("error", { message: "Room not found" });
            }
        } catch (error) {
            socket.emit("error", { message: "Error sending message", error });
        }
    });

    socket.on("markAsSeen", async ({ conversationId, messageId }) => {
        try {
            const room = await Room.findOne({ conversationId });

            if (room) {
                const message = room.messages.id(messageId);
                if (message) {
                    message.seen = true;
                    await room.save();
                    socket.to(conversationId).emit("messageSeen", { messageId });
                } else {
                    socket.emit("error", { message: "Message not found" });
                }
            } else {
                socket.emit("error", { message: "Room not found" });
            }
        } catch (error) {
            socket.emit("error", { message: "Error marking message as seen", error });
        }
    });

    socket.on("toggleBlock", async ({ conversationId, userIdToBlock }) => {
        try {
            const room = await Room.findOne({ conversationId });

            if (room) {
                if (!room.blockedUsers) room.blockedUsers = [];
                
                const isBlocked = room.blockedUsers.includes(userIdToBlock);
                if (isBlocked) {
                    room.blockedUsers = room.blockedUsers.filter(id => id !== userIdToBlock);
                } else {
                    room.blockedUsers.push(userIdToBlock);
                }
                await room.save();

                socket.to(conversationId).emit("blockStatusChanged", { userId: userIdToBlock, blocked: !isBlocked });
                socket.emit("blockStatusChanged", { userId: userIdToBlock, blocked: !isBlocked });
            } else {
                socket.emit("error", { message: "Room not found" });
            }
        } catch (error) {
            socket.emit("error", { message: "Error toggling block status", error });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected from chat namespace:", socket.id);
    });
};
