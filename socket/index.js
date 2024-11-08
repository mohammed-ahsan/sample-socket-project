const socketIo = require("socket.io");
const chatNamespace = require("./namespaces/chatNamespace");
const notificationNamespace = require("./namespaces/notificationNamespace");
const { isValidToken } = require("./utils/socketHelpers");

module.exports = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.of("/chat").use((socket, next) => {
        const phone = socket.handshake.headers.phone;
        const token = socket.handshake.auth.token;

        if (isValidToken(token)) {
            socket.phone = phone;
            return next();
        }
        return next(new Error("Authentication error"));
    }).on("connection", (socket) => chatNamespace(socket));

    io.of("/notifications").use((socket, next) => {
        const phone = socket.handshake.headers.phone;

        socket.phone = phone;
        return next();
    }).on("connection", (socket) => notificationNamespace(socket));
};
