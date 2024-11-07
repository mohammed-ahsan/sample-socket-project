require("dotenv").config();
const express = require("express");
const http = require("http");
const connectDB = require("./configs/db");
const setPhoneMiddleware = require("./middlewires/setPhoneMiddleware");
const roomRoutes = require("./routes/roomRoutes");
const initializeSocket = require("./socket");

const app = express();
const server = http.createServer(app);

connectDB();

app.use(express.json());
app.use(setPhoneMiddleware);

app.use("/api", roomRoutes);

initializeSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));