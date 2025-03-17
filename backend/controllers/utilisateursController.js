const utilisateurModel = require("../models/utilisateurModel");
const { query,param ,body, validationResult } = require('express-validator');
const authModel = require("../models/authModel");

// GET : 1 -une pour lutilisateur lui meme , 2-admin

exports.GetProfil =  async (req, res) => {
    try{
        const person = await utilisateurModel.trouverUtilisateur(req.user.id);
        if (person) {
            return res.json(person);
        } else {
            return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID ❌" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur ❌" });
    }
    
};

exports.GetUser = [
    query('id')
    .isInt({min:1}).withMessage("ID invalide"), 
    async (req, res) => {
    const errors=validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
    }
     try{
        const { id } = req.query;
         const person = await utilisateurModel.trouverUtilisateur(id);
         if (person) {
             return res.json(person);
         } else {
             return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID ❌" });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ message: "Erreur serveur ❌" });
     }
     
     } 
];

// DELETE : 1 -une pour lutilisateur lui meme , 2-admin
exports.DeleteProfil = async (req, res) => {
    
    try{
        const test = await utilisateurModel.supprimerUtilisateur(req.user.id); 

        if (test) {  
            return res.status(200).json({ 
                message: "Utilisateur supprimé avec succès ✅", 
                utilisateur: test 
            });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur ❌" });
    }   
};

exports.DeleteUser = [
    query('id') //query plus recommande pour delete que body
    .isInt({min:1}).withMessage("ID invalide"), 

    async (req, res) => {
    
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try{
        const id = req.query.id; 
        const test = await utilisateurModel.supprimerUtilisateur(id); 

        if (test) {  
            return res.status(200).json({ 
                message: "Utilisateur supprimé avec succès ✅", 
                utilisateur: test 
            });
        } else { 
            return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID ❌" });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur ❌" });
    }
    
    
}
];

// PUT :que pour lutilisateur    

exports.modifyEmail = [
    body('email')
       .notEmpty().withMessage("L'email est requis.")
       .isEmail().withMessage("Email invalide."), 

    async (req, res) => {
     const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    
    try{
        const person = await utilisateurModel.modifyEmail(email,req.user.id);

        if (person) {
            return res.status(200).json({
                message: "Modification validée ✅"
            });
        } else {
            return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID ❌" });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur ❌" });
    }   

}
];

exports.modifyNom = [
    body('nom')
       .notEmpty().withMessage("Le nom est requis.")
       .isAlpha('fr-FR', { ignore: " " }).withMessage("Le nom ne doit contenir que des lettres et espaces.")
       .trim(), 

    async (req, res) => {
     const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nom } = req.body;
    
    try{
        const person = await utilisateurModel.modifyNom(nom,req.user.id);

        if (person) {
            return res.status(200).json({
                message: "Modification validée ✅"
            });
        } else {
            return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID ❌" });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur ❌" });
    }   

}
];

exports.modifyMotdepasse = [
    body('InitialMotDePasse').notEmpty().withMessage("Le mot de passe initial est requis."),
    body('motDePasse').notEmpty().withMessage("Le nouveau mot de passe est requis.")
        .isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères.")
        .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage("Doit contenir au moins une majuscule et un chiffre."),
    body('motDePasse2').notEmpty().withMessage("Veuillez confirmer le mot de passe.")
        .custom((value, { req }) => {
            if (value !== req.body.motDePasse) {
                throw new Error("Les mots de passe ne correspondent pas.");
            }
            return true;
        }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { InitialMotDePasse, motDePasse } = req.body;
        try {
            const result1=await utilisateurModel.testInitial(InitialMotDePasse, req.user.id);
            if (!result1) { 
                return res.status(404).json({ message: "Mot de passe initial invalide ❌" });
            }
            const result2=await authModel.verification(motDePasse, req.user.id);
            if (result2) {
                return res.status(401).json({ message: "Ce mot de passe est déjà utilisé !!" });
              }
            const result = await utilisateurModel.modifyMotdepasse(motDePasse, req.user.id);

            if (result) {
                return res.status(200).json({ message: "Modification validée ✅" });
            } else {
                return res.status(404).json({ message: "Modification invalide ❌" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Erreur serveur ❌" });
        }
    }
];

exports.modifyDate = [
    body('date_naissance')
    .notEmpty().withMessage("La date de naissance est requise.")
    .isISO8601().withMessage("La date de naissance doit être au format AAAA-MM-JJ."),

    async (req, res) => {
     const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { date_naissance } = req.body;
    
    try{
        const person = await utilisateurModel.modifyDate(date_naissance,req.user.id);

        if (person) {
            return res.status(200).json({
                message: "Modification validée ✅"
            });
        } else {
            return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID ❌" });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur ❌" });
    }   

}
];

exports.modifyLieux = [
    body('lieu_naissance')
    .notEmpty().withMessage("Le lieu de naissance est requise."),

    async (req, res) => {
     const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { lieu_naissance } = req.body;
    
    try{
        const person = await utilisateurModel.modifyLieux(lieu_naissance,req.user.id);

        if (person) {
            return res.status(200).json({
                message: "Modification validée ✅"
            });
        } else {
            return res.status(404).json({ message: "Utilisateur non trouvé avec cet ID ❌" });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur ❌" });
    }   

}
];