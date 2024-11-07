const express = require("express");
const { createRoom, getRoom, updateRoom, deleteRoom } = require("../controllers/roomController");

const router = express.Router();

router.post("/room", createRoom);
router.get("/room", getRoom);
router.put("/room", updateRoom);
router.delete("/room", deleteRoom);

module.exports = router;
