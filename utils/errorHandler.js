module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal server error" });
};

module.exports.socketErrorHandler = (err, socket) => {
    console.error(err.stack);
    socket.emit("error", "An error occurred");
};
