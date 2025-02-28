const authModel = require("../models/authModel");
const { param ,body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { verifyToken } = require("../middlewares/authMiddleware");
const { v4: uuidv4 } = require('uuid');




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});
const hashPassword = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds); 
    const hashedPassword = await bcrypt.hash(password, salt); 
    return hashedPassword;
  } catch (err) {
    throw new Error('Error during password hashing: ' + err.message);
  }
};

const disallowedPasswords = [
  "password",
  "123456",
  "qwerty",
  "abcdef",
  "654321"
];

exports.FuncInscription = [
  body('nom')
    .notEmpty().withMessage("Le nom est requis.")
    .isAlpha('fr-FR', { ignore: " " }).withMessage("Le nom ne doit contenir que des lettres et espaces.")
    .escape()
    .trim(),

  body('email')
    .notEmpty().withMessage("L'email est requis.")
    .isEmail().withMessage("Email invalide.")
    .normalizeEmail(),

  body('motDePasse')
    .notEmpty().withMessage("Le mot de passe est requis.")
    .isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères.")
    .custom(value => {
      if (disallowedPasswords.includes(value.toLowerCase())) {
        throw new Error('Veuillez choisir un mot de passe plus sécurisé.');
      }
      if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)) {
        throw new Error("Doit contenir au moins une majuscule et un chiffre.");
      }
      return true;
    }),

  body('date_naissance')
    .notEmpty().withMessage("La date de naissance est requise.")
    .isISO8601().withMessage("La date de naissance doit être au format AAAA-MM-JJ."),

  body('lieu_naissance')
    .notEmpty().withMessage("Le lieu de naissance est requis.")
    .isLength({ min: 2, max: 100 }).withMessage("Ne dépasse pas 100 caractères.")
    .trim()
    .custom(value => {
      if (value.includes('<script>') || value.includes('javascript:')) {
        throw new Error('Le lieu de naissance ne doit contenir aucun code ni balise JavaScript.');
      }
      return true;
    })
    .escape(),
     
async (req, res) => {
  const errors=validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const { nom, email, motDePasse, date_naissance,lieu_naissance } = req.body;


  try {       
      const id = uuidv4();
      const motDePasseSecurise = await hashPassword(motDePasse, 10);
      const Nutilisateur = await authModel.ajouterUtilisateur(id,nom,email,motDePasseSecurise,date_naissance,lieu_naissance);
      res.status(201).json({ message: "Inscription réussie ✅", utilisateur: Nutilisateur });

  } catch (error) {
      console.error(error); 
      if (error.code === "23505") {  // 23505 = Violation d'unicité d'email
          return res.status(400).json({ message: "Cet email est déjà utilisé ❌" });
      }

      res.status(500).json({ message: "Erreur serveur ❌" });
  }
}
];

exports.FuncLogin = [
  body('email')
    .notEmpty().withMessage("L'email est requis.")
    .isEmail().withMessage("Email invalide.")
    .normalizeEmail(),
  
  body('motDePasse')
    .notEmpty().withMessage("Le mot de passe est requis."),

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
            role: utilisateur.role
          },
          process.env.JWT_SECRET, 
          { expiresIn: process.env.JWT_EXPIRES_IN } 
        );
        res.cookie("token", token, {
            httpOnly: true, 
            secure: true,  
            maxAge: 3600000,
            sameSite: 'strict' //Send cookies only to to the server if the request originates from the same site as the cookie's domain
          });
          

        return res.status(200).json({
          message: "Connexion réussie ✅",
          token: token,
          utilisateur: {
            id: utilisateur.id,
            email: utilisateur.email,
            role: utilisateur.role
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

    return res.redirect('/');

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
      message: "Un email de réinitialisation a été envoyé , veuillez verifier spam✅",
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


exports.resetPassword = [
  verifyToken,
  body('motDePasse1')
    .notEmpty().withMessage("Le mot de passe est requis.")
    .isLength({ min: 8 }).withMessage("Le mot de passe doit contenir au moins 8 caractères.")
    .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage("Doit contenir au moins une majuscule et un chiffre."),
  body('motDePasse2')
    .notEmpty().withMessage("Le mot de passe est requis.")
    .custom((value, { req }) => {
      if (value !== req.body.motDePasse1) {
        throw new Error("Veuillez entrer le même mot de passe.");
      }
      return true;
    }),
  body('date_naissance')
    .notEmpty().withMessage("La date de naissance est requise."),
  body('lieu_naissance')
    .notEmpty().withMessage("Le lieu de naissance est requis.")
    .trim()
    .escape(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { motDePasse1,date_naissance,lieu_naissance } = req.body;
    const test1 = await authModel.verification(motDePasse1,req.user.id);
    const test2 = await authModel.test(date_naissance,lieu_naissance,req.user.id);
    try {
      if (test1===1) {
        return res.status(401).json({ message: "Ce mot de passe est déjà utilisé !!" });
      }
      if(test2==0){
        return res.status(401).json({ message: "Le lieu ou la date de naissance sont pas valide !!" });
      }
      const motDePasseSecurise = await bcrypt.hash(motDePasse1, 10);
      const result = await authModel.changement(motDePasseSecurise, req.user.id);
      if (result) {
        return res.status(201).json({ message: "Le mot de passe a été modifié avec succès" });
      } else {
        return res.status(400).json({ message: "La mise à jour a échoué." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur ❌" });
    }
  }
];
