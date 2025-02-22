const express = require("express");
const router = express.Router();
const livresController = require("../controllers/livresController");

// Définition de la route POST /inscription
router.post("/ajout", livresController.AjoutLivre);
router.get("/:id", livresController.GetLivre);
router.delete("/:id", livresController.DeleteLivre);
router.put("/:id", livresController.ModifyLivre);
router.put("/:id_livre/attribuer", livresController.AttribuerLivre);
module.exports = router;