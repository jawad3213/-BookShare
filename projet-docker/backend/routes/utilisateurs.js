const express = require("express");
const router = express.Router();
const utilisateursController = require("../controllers/utilisateursController");


router.get("/:id/get",utilisateursController.GetUtilisateur);
router.delete("/:id/delete",utilisateursController.DeleteUtilisateur);
router.put("/:id/changement",utilisateursController.ModifyUtilisateur);

module.exports = router;