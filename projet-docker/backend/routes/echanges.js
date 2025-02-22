const express = require("express");
const router = express.Router();
const echangesController = require("../controllers/echangesController");

router.post('/demande',echangesController.Fdemande);
router.get('/:id/demande',echangesController.AvoirDemande);
router.put('/:id/refus',echangesController.Frefus);
router.put('/:id/accepte',echangesController.Faccepte);
router.put('/:id/termine',echangesController.Ftermine);
router.delete("/:id/supprimer",echangesController.deleteEchange); 

module.exports = router;