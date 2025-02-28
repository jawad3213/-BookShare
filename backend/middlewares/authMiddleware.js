const jwt = require('jsonwebtoken');
require('dotenv').config();
/*exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header is required." });
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer') {
      return res.status(400).json({ message: "Authorization scheme must be Bearer." });
    }
    if (!token) {
      return res.status(401).json({ message: "Bearer token is missing." });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = decoded;
      next();
    });
  };*/
  
  exports.verifyToken = (req, res, next) => {
    const token = req.query.token || req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Aucun token fourni." });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token invalide ou expiré." });
      }
      req.user = decoded;
      next();
    });
  };