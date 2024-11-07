const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());

app.use((req, res, next) => {
    req.phone = req.headers.phone || req.body.phone;
    next();
});

const rooms = {};

app.post("/room", (req, res) => {
    if (!req.phone) return res.status(400).json({ message: "Phone number is required" });
    if (!rooms[req.phone]) {
        rooms[req.phone] = { messages: [] };
        return res.status(201).json({ message: `Room created for phone: ${req.phone}` });
    }
    res.status(400).json({ message: `Room already exists for phone: ${req.phone}` });
});

app.get("/room", (req, res) => {
    if (!req.phone || !rooms[req.phone]) return res.status(404).json({ message: "Room not found" });
    res.status(200).json({ room: rooms[req.phone] });
});

// Update room (e.g., change phone number)
app.put("/room", (req, res) => {
    const { newPhone } = req.body;
    if (!req.phone || !rooms[req.phone]) return res.status(404).json({ message: "Room not found" });
    if (newPhone) {
        rooms[newPhone] = rooms[req.phone];
        delete rooms[req.phone];
        req.phone = newPhone;
        return res.status(200).json({ message: `Room phone updated to: ${newPhone}` });
    }
    res.status(400).json({ message: "New phone number is required" });
});

app.delete("/room", (req, res) => {
    if (!req.phone || !rooms[req.phone]) return res.status(404).json({ message: "Room not found" });
    delete rooms[req.phone];
    res.status(200).json({ message: `Room deleted for phone: ${req.phone}` });
});

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ phone }) => {
        if (phone && rooms[phone]) {
            socket.join(phone);
        }
    });

    socket.on("sendMessage", ({ phone, message }) => {
        if (phone && message) {
            rooms[phone]?.messages.push(message);
            io.to(phone).emit("receiveMessage", { message });
        }
    });

    socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {});
