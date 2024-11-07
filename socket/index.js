const socketIo = require("socket.io");
const chatNamespace = require("./namespaces/chatNamespace");
const notificationNamespace = require("./namespaces/notificationNamespace");

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.of("/chat").use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (isValidToken(token)) {
            return next();
        }
        return next(new Error("Authentication error"));
    }).on("connection", chatNamespace);

    io.of("/notifications").on("connection", notificationNamespace);
};
