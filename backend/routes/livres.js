const express = require("express");
const router = express.Router();
const livresController = require("../controllers/livresController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { verifyAdmin } = require("../middlewares/adminMiddleware");


router.post("/ajout",verifyToken,verifyAdmin, livresController.AjoutLivre);
router.get("/getLivre",verifyToken, livresController.GetLivre);
router.delete("/:id",verifyToken,verifyAdmin, livresController.DeleteLivre);
router.put("/:id",verifyToken,verifyAdmin, livresController.ModifyLivre);
router.put("/:id_livre/attribuer",verifyToken,verifyAdmin, livresController.AttribuerLivre);
module.exports = router;