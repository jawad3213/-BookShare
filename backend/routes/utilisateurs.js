const express = require("express");
const router = express.Router();
const utilisateursController = require("../controllers/utilisateursController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { verifyAdmin } = require("../middlewares/adminMiddleware");

// GET : 1 -une pour lutilisateur lui meme , 2-admin
router.get("/getProfil",verifyToken,utilisateursController.GetProfil);
router.get("/getUser",verifyToken,verifyAdmin,utilisateursController.GetUser);

// DELETE : 1 -une pour lutilisateur lui meme , 2-admin
router.delete("/deleteProfil",verifyToken,utilisateursController.DeleteProfil);
router.delete("/DeleteUser",verifyToken,verifyAdmin,utilisateursController.DeleteUser);

// PUT : que pour lutilisateur
router.put("/modifyEmail",verifyToken,utilisateursController.modifyEmail);
router.put("/modifyNom",verifyToken,utilisateursController.modifyNom);
router.put("/modifyMotdepasse",verifyToken,utilisateursController.modifyMotdepasse);
router.put("/modifyDate",verifyToken,utilisateursController.modifyDate);
router.put("/modifyLieux",verifyToken,utilisateursController.modifyLieux);



module.exports = router;