const livreModel = require("../models/livreModel");
const { query,param ,body, validationResult } = require('express-validator');


exports.AjoutLivre = [
body('Titre')
    .notEmpty().withMessage("Le titre est requis.")
    .isString().withMessage("Le titre doit être une chaîne de caractères.")
    .trim(),
 
body('Auteur')
    .notEmpty().withMessage("L'auteur est requis.")
    .isAlpha('fr-FR', { ignore: " " }).withMessage("L'auteur ne doit contenir que des lettres et espaces.")
    .trim(),
 
body('Genre')
    .notEmpty().withMessage("Le genre est requis.")
    .isString().withMessage("Le genre doit être une chaîne de caractères.")
    .trim(),
 
body('date_publication')
    .notEmpty().withMessage("La date de publication est requise.")
    .isISO8601().withMessage("La date de publication doit être au format AAAA-MM-JJ."),
     
async (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
      
    try{
        const { Titre, Auteur, Genre, date_publication } = req.body;
        const livre=await livreModel.ajoutL(Titre, Auteur, Genre, date_publication);
        return res.status(201).json({ message: "Ajout réussie ✅" , livre : livre});
    } catch(error) {
        console.error(error); 
        res.status(500).json({ message: "Erreur serveur ❌" });
    }
}
];

exports.GetLivre = [
    query('Titre')
    .notEmpty().withMessage("Le titre est requis.")
    .trim(),
async (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {Titre} = req.query;
    try {
        const livre = await livreModel.trouverLivre(Titre);
        if (livre) {
            return res.json(livre);
        } else {
            return res.status(404).json({ message: "Livre non trouvé avec cet ID ❌" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Erreur interne du serveur ❌", error });
    }
}
];
exports.DeleteLivre = [
    param('id')
    .isInt({min:1}).withMessage("ID invalide"),
async (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const id = req.params.id; 

    try{
        const test = await livreModel.supprimerLivre(id); 

        if (test) {  
            return res.status(200).json({ 
                message: "Livre supprimé avec succès ✅", 
                livre : test 
            });
        } else { 
            return res.status(404).json({ message: "Livre non trouvé avec cet ID ❌" });
        }
    }catch (error) {
        return res.status(500).json({ message: "Erreur interne du serveur ❌", error });
    }
 }

];

exports.ModifyLivre = [
    param('id')
        .isInt({ min: 1 }).withMessage("ID invalide"),

    body('Titre')
        .notEmpty().withMessage("Le titre est requis.")
        .isString().withMessage("Le titre doit être une chaîne de caractères.")
        .trim(),

    body('Auteur')
        .notEmpty().withMessage("L'auteur est requis.")
        .isAlpha('fr-FR', { ignore: " " }).withMessage("L'auteur ne doit contenir que des lettres et espaces.")
        .trim(),

    body('Genre')
        .notEmpty().withMessage("Le genre est requis.")
        .isString().withMessage("Le genre doit être une chaîne de caractères.")
        .trim(),

    body('date_publication')
        .notEmpty().withMessage("La date de publication est requise.")
        .isISO8601().withMessage("La date de publication doit être au format AAAA-MM-JJ."),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { Titre, Auteur, Genre, date_publication } = req.body;
        const id = parseInt(req.params.id);

        try {
            const livre = await livreModel.modifieLivre(Titre, Auteur, Genre, date_publication, id);

            if (livre) {
                return res.status(200).json({
                    message: "Modification validée ✅",
                    livre: livre
                });
            } else {
                return res.status(404).json({ message: "Livre non trouvé avec cet ID ❌" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erreur interne du serveur ❌", error });
        }
    }
];

exports.AttribuerLivre = [
    param('id_livre')
        .isInt({ min: 1 }).withMessage("ID de livre invalide"),
    body('id')
        .isInt({ min: 1 }).withMessage("ID de l'utilisateur invalide"),
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id_livre = req.params.id_livre;
    const { id } = req.body;

    try {
        const livre = await livreModel.empLivre(id_livre,id); 
        
        if (!livre) {
            return res.status(404).json({ message: "Livre non trouvé ou non disponible❌" });
        }

        return res.status(200).json({
            message: "Attribution validée ✅",
            livre: livre
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erreur serveur ❌", error });
    }
}
];