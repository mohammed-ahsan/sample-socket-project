const setPhoneMiddleware = (req, res, next) => {
    req.phone = req.headers.phone || req.body.phone;
    if (!req.phone) {
        return res.status(400).json({ message: "Phone number is required" });
    }
    next();
};

module.exports = setPhoneMiddleware;

