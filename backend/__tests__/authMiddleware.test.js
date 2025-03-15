const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middlewares/authMiddleware");

describe("Middleware Auth - Vérification du Token", () => {
    it(" Devrait appeler next() si le token est valide", () => {
        const req = { query: {}, headers: { authorization: "valid_token" } }; // Ajout de req.query
        const res = {};
        const next = jest.fn();

        jest.spyOn(jwt, "verify").mockImplementation((token, secret, callback) => {
            callback(null, { id: 1, email: "test@example.com" });
        });

        verifyToken(req, res, next);
        expect(next).toHaveBeenCalled(); 
        expect(req.user).toEqual({ id: 1, email: "test@example.com" });
    });

    it(" Devrait retourner une erreur 401 si le token est invalide", () => {
        const req = { query: {}, headers: { authorization: "invalid_token" } }; // Ajout de req.query
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        jest.spyOn(jwt, "verify").mockImplementation((token, secret, callback) => {
            callback(new Error("Token invalide"), null);
        });

        verifyToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Token invalide ou expiré." });
    });

    it(" Devrait retourner une erreur 401 si aucun token n'est fourni", () => {
        const req = { query: {}, headers: {} }; // Ajout de req.query
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();

        verifyToken(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: "Aucun token fourni." });
    });
});
