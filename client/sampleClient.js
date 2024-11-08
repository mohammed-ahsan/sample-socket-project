const { io } = require("socket.io-client");

const socket = io("ws://localhost:3000/chat");

socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);

    socket.phone = "123456789";

    socket.emit("joinRoom");
});

socket.on("joinedRoom", (message) => {
    console.log("Server response on room join:", message);
});

const sendMessage = (message) => {
    socket.emit("sendMessage", { message });
};

socket.on("receiveMessage", (message) => {
    console.log("Received message:", message);
});

socket.on("error", (errorMessage) => {
    console.error("Error:", errorMessage);
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

sendMessage("Hello from client!");
