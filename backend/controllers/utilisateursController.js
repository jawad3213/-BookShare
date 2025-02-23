const utilisateurModel = require("../models/utilisateurModel");
const { param ,body, validationResult } = require('express-validator');



exports.GetUtilisateur = [
    param('id')
    .isInt({min:1}).withMessage("ID invalide"),
   async (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    const id = req.params.id;
    try{
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

exports.DeleteUtilisateur = [
    param('id')
    .isInt({min:1}).withMessage("ID invalide"), 

    async (req, res) => {
    
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try{
        const id = req.params.id; 
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

exports.ModifyUtilisateur = [
    param('id')
    .isInt({min:1}).withMessage("ID invalide"), 
    body('nom')
       .notEmpty().withMessage("Le nom est requis.")
       .isAlpha('fr-FR', { ignore: " " }).withMessage("Le nom ne doit contenir que des lettres et espaces.")
       .trim(), 

    body('email')
       .notEmpty().withMessage("L'email est requis.")
       .isEmail().withMessage("Email invalide."), 

    body('motDePasse')
       .notEmpty().withMessage("Le mot de passe est requis.")
       .isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères.")
       .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage("Doit contenir au moins une majuscule et un chiffre."),
    
    async (req, res) => {
     const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { nom, email, motDePasse } = req.body;
    const id = req.params.id;
    


    try{
        const person = await utilisateurModel.modifieUtilisateur(nom, email, motDePasse, id);

        if (person) {
            return res.status(200).json({
                message: "Modification validée ✅",
                utilisateur: person
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