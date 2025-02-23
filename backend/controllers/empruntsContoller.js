const empruntModel = require("../models/empruntModel");
const livreModel = require("../models/livreModel");
const utilisateurModel = require("../models/utilisateurModel");
const { param ,body, validationResult } = require('express-validator');

exports.demande = [
    body('livre_id')
        .isInt({ min: 1 }).withMessage("ID de livre invalide"),
    body('emprunteur_id')
        .isInt({ min: 1 }).withMessage("ID de l'utilisateur invalide"),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { livre_id, emprunteur_id } = req.body;

    try {
        
        const livre = await livreModel.trouverLivre(livre_id);
        if (!livre) {
            return res.status(404).json({ message: "Livre non trouvé ❌" });
        }
    
        
        const utilisateur = await utilisateurModel.trouverUtilisateur(emprunteur_id);
        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé ❌" });
        }
    
        
        const emprunt = await empruntModel.demandeModel(livre_id, emprunteur_id);
        return res.status(201).json({ message: "Demande ajoutée ✅", emprunt });
    
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur ❌" });
    }
    
}
];
exports.AvoirDemande = [
    param('id')
    .isInt({ min: 1 }).withMessage("ID d'Emprunt invalide"),
    async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    const id = parseInt(req.params.id);
     
    try{   
        const emprunt = await empruntModel.trouverEmprunt(id);
        if (emprunt) {
            return res.json(emprunt);  
        } else {
            return res.status(404).json({ message: "Emprunt non trouvé avec cet ID ❌" });  
        } 
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur ❌" });
    }
}
];
exports.accepte = [
    param('id')
    .isInt({ min: 1 }).withMessage("ID d'Emprunt invalide"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    const id = parseInt(req.params.id);
    try {
        const emprunt = await empruntModel.accepteModel(id);

        if (emprunt) {
            return res.status(201).json({ message: "Demande acceptée ✅", emprunt });
        } else {
            return res.status(400).json({ message: "Emprunt introuvable ❌" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur ❌", error });
    }
}
];
exports.refus = [
param('id')
    .isInt({ min: 1 }).withMessage("ID d'Emprunt invalide"),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id);
    try {
        const emprunt = await empruntModel.refusModel(id);

        if (emprunt) {
            return res.status(201).json({ message: "Demande refuse ❌", emprunt });
        } else {
            return res.status(400).json({ message: "Emprunt introuvable ❌" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur ❌", error });
    }
}
];
exports.terminée = [
    param('id')
    .isInt({ min: 1 }).withMessage("ID d'Emprunt invalide"),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id);
    try {
        const emprunt = await empruntModel.finModel(id);

        if (emprunt) {
            return res.status(201).json({ message: "Demande terminée ❌", emprunt });
        } else {
            return res.status(400).json({ message: "Emprunt introuvable ❌" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur ❌", error });
    }
}
];
exports.deleteEmprunt = [
    param('id')
    .isInt({ min: 1 }).withMessage("ID d'Emprunt invalide"),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = parseInt(req.params.id); 

    try { 
        const test = await empruntModel.supprimerEmprunt(id); 

        if (test) {  
            return res.status(200).json({ 
                message: "Emprunt supprimé avec succès ✅", 
                Emprunt: test 
            });
        } else { 
            return res.status(404).json({ message: "Emprunt non trouvé avec cet ID ❌" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur serveur ❌", error });
    }
}
];