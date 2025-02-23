const pool = require("../db");
const bcrypt = require('bcryptjs');

exports.ajouterUtilisateur = async (nom, email, motDePasse,type) => {
    const result = await pool.query(
        "INSERT INTO public.utilisateurs (nom, email, mot_de_passe,type) VALUES ($1, $2, $3,$4) RETURNING *",
        [nom, email, motDePasse,type]
    );
    return result.rows[0];  
};

exports.loginmodel = async (email, motDePasse) => {
    const result = await pool.query(
        "SELECT * FROM public.utilisateurs WHERE email = $1",
        [email]
    );

    if (result.rows.length > 0) {
        const utilisateur = result.rows[0];
        const isPasswordValid = await bcrypt.compare(motDePasse, utilisateur.mot_de_passe);

        if (isPasswordValid) {
            return utilisateur;
        }
    }
    else return null; 
};

exports.changemodel = async (email) => {
    let result = await pool.query(
        "SELECT * FROM public.utilisateurs WHERE email = $1",
        [email]
    );

    return result.rows[0]
};
