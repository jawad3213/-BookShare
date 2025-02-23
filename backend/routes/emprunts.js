const express = require("express");
const router = express.Router();
const empruntsController = require("../controllers/empruntsContoller");

router.post('/demande',empruntsController.demande);
router.get('/:id/demande',empruntsController.AvoirDemande);
router.put('/:id/acceptee', empruntsController.accepte);
router.put('/:id/refusee', empruntsController.refus);
router.put('/:id/fin', empruntsController.terminée);
router.delete("/:id/supprimer",empruntsController.deleteEmprunt); 

module.exports = router;
