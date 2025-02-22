const echangeModel = require("../models/echangeModel");
const livreModel = require("../models/livreModel");
const utilisateurModel = require("../models/utilisateurModel");
const { param ,body, validationResult } = require('express-validator');

exports.Fdemande = [
    body('livre1_id')
        .isInt({ min: 1 }).withMessage("ID de livre 1 invalide"),
    body('id1_uti')
        .isInt({ min: 1 }).withMessage("ID de l'utilisateur 1 invalide"),
    body('livre2_id')
        .isInt({ min: 1 }).withMessage("ID de livre 2 invalide"),
    body('id2_uti')
        .isInt({ min: 1 }).withMessage("ID de l'utilisateur 2 invalide"),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {livre1_id,livre2_id,id1_uti,id2_uti} = req.body;
    try {
        const livre1 = await livreModel.trouverLivre(livre1_id);
        if (!livre1) {
            return res.status(404).json({ message: "Livre 1 non trouvé ❌" });
        }                   
        const utilisateur1 = await utilisateurModel.trouverUtilisateur(id1_uti);
        if (!utilisateur1) {
        return res.status(404).json({ message: "Utilisateur 1 non trouvé ❌" });
        }
        const livre2 = await livreModel.trouverLivre(livre2_id);
        if (!livre2) {
            return res.status(404).json({ message: "Livre 2 non trouvé ❌" });
        }                   
        const utilisateur2 = await utilisateurModel.trouverUtilisateur(id2_uti);
        if (!utilisateur2) {
        return res.status(404).json({ message: "Utilisateur 2 non trouvé ❌" });
        }
        const echange = await echangeModel.demandeModel(livre1_id,livre2_id,id1_uti,id2_uti);
        
        return res.status(201).json({ message: "Demande ajoutée ✅", echange : echange });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Accès serveur impossible ❌" });
    }
}
];
exports.AvoirDemande = [
param('id')
    .isInt({ min: 1 }).withMessage("ID de l'utilisateur 2 invalide"),
async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}
    try{const id = parseInt(req.params.id);
    
        const echange = await echangeModel.trouverEchange(id);
        if (echange) {
            return res.json(echange);  
        } else {
            return res.status(404).json({ message: "Echange non trouvé avec cet ID ❌" });  
        }
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Accès serveur impossible ❌" });
    }
} 
];
exports.Frefus = [
    param('id')
        .isInt({ min: 1 }).withMessage("ID de l'échange invalide"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = parseInt(req.params.id);

        try {
            const echange = await echangeModel.refusModel(id);

            if (echange) {
                return res.status(201).json({ message: "Demande refusée ❌", echange: echange });
            } else {
                return res.status(404).json({ message: "Échange introuvable ❌" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Accès serveur impossible ❌" });
        }
    }
];

exports.Faccepte = [
    param('id')
        .isInt({ min: 1 }).withMessage("ID de l'échange invalide"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = parseInt(req.params.id);

        try {
            const echange = await echangeModel.accepteModel(id);

            if (echange) {
                return res.status(201).json({ message: "Demande acceptée ✅", echange: echange });
            } else {
                return res.status(404).json({ message: "Échange introuvable ❌" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Accès serveur impossible ❌" });
        }
    }
];
exports.Ftermine = [
    param('id')
        .isInt({ min: 1 }).withMessage("ID de l'échange invalide"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = parseInt(req.params.id);

        try {
            const echange = await echangeModel.finModel(id);

            if (echange) {
                return res.status(201).json({ message: "Demande terminée ✅", echange: echange });
            } else {
                return res.status(404).json({ message: "Échange introuvable ❌" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Accès serveur impossible ❌" });
        }
    }
];

exports.deleteEchange = [
    param('id')
        .isInt({ min: 1 }).withMessage("ID de l'échange invalide"),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const id = parseInt(req.params.id);

        try {
            const test = await echangeModel.supprimerEchange(id);

            if (test) {
                return res.status(200).json({
                    message: "Échange supprimé avec succès ✅",
                    echange: test
                });
            } else {
                return res.status(404).json({ message: "Échange non trouvé avec cet ID ❌" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erreur serveur ❌" });
        }
    }
];
