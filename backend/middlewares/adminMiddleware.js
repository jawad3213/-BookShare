const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(401).json({ message: "Le rôle de l'utilisateur n'est pas vérifié." });
    }
    next();
};