module.exports = (socket) => {
    console.log("User connected to notifications namespace:", socket.id);

    socket.on("sendNotification", (notification) => {
        socket.broadcast.emit("receiveNotification", notification);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected from notifications namespace:", socket.id);
    });
};
