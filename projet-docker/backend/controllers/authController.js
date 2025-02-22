const authModel = require("../models/authModel");
const { param ,body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});


exports.FuncInscription = [
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
    body('type')
       .notEmpty().withMessage("Le type est requis.")
       .isIn(["client","administrateur"]).withMessage("client/administrateur"),
async (req, res) => {
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

    const { nom, email, motDePasse,type } = req.body;


    try {
        
        const motDePasseSecurise=await bcrypt.hash(motDePasse, 10);
        const Nutilisateur = await authModel.ajouterUtilisateur(nom, email, motDePasseSecurise,type);
        res.status(201).json({ message: "Inscription réussie ✅", utilisateur: Nutilisateur });

    } catch (error) {
        console.error(error); 
        if (error.code === "23505") {  // 23505 = Violation d'unicité d'email
            return res.status(400).json({ message: "Cet email est déjà utilisé ❌" });
        }

        res.status(500).json({ message: "Erreur serveur ❌" });
    }
}
];

exports.FuncLogin = [
  body('email')
    .notEmpty().withMessage("L'email est requis.")
    .isEmail().withMessage("Email invalide."),
  
  body('motDePasse')
    .notEmpty().withMessage("Le mot de passe est requis.")
    .isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères.")
    .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage("Doit contenir au moins une majuscule et un chiffre."),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, motDePasse } = req.body;

    try {
      const utilisateur = await authModel.loginmodel(email, motDePasse);

      if (utilisateur) {
        
        const token = jwt.sign(
          {
            id: utilisateur.id,
            email: utilisateur.email,
            type: utilisateur.type
          },
          process.env.JWT_SECRET, 
          { expiresIn: process.env.JWT_EXPIRES_IN } 
        );
        res.cookie("token", token, {
            httpOnly: true, 
            secure: true,  
            maxAge: 3600000
          });
          

        return res.status(200).json({
          message: "Connexion réussie ✅",
          token: token,
          utilisateur: {
            id: utilisateur.id,
            email: utilisateur.email,
            type: utilisateur.type
          }
        });
      } else {
        return res.status(401).json({ message: "Email ou mot de passe incorrect ❌" });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur ❌" });
    }
  }
];
exports.FuncLogout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true, 
        secure: true,  
        sameSite: 'strict' 
      });
  
      return res.status(200).json({
        message: "Déconnexion réussie ✅"
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur ❌" });
    }
};

exports.FuncChange = [
  body('email')
     .notEmpty().withMessage("L'email est requis.")
     .isEmail().withMessage("Email invalide."), 

async (req, res) => {
  const errors=validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const { email } = req.body;

  try {
    const utilisateur = await authModel.changemodel(email);
    if(utilisateur){
      const resetToken = jwt.sign(
        { id: utilisateur.id, email: utilisateur.email }, 
        process.env.JWT_SECRET,
        { expiresIn: '15m' } 
      );
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to: utilisateur.email,
    subject: "Réinitialisation de votre mot de passe 🔒",
    html: `
      <h2>Réinitialisation du mot de passe</h2>
      <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
      <a href="${resetLink}">Réinitialiser mon mot de passe</a>
      <p>Ce lien expirera dans 15 minutes.</p>
    `
  };
  const sent= await transporter.sendMail(mailOptions);
  if (sent){
    return res.status(200).json({
      message: "Un email de réinitialisation a été envoyé ✅",
    });
  }
      
  }
  else res.status(400).json({message :"utilisateur non trouvé avec cet email❌"})
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur ❌" });
  }
}
];

