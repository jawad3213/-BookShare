const pool = require("../db");
const bcrypt = require('bcryptjs');

exports.ajouterUtilisateur = async (id,nom,email,motDePasse,date_naissance,lieu_naissance) => {
    const result = await pool.query(
        "INSERT INTO public.utilisateurs (id,nom,email,mot_de_passe,date_naissance,lieu_naissance) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
        [id,nom,email,motDePasse,date_naissance,lieu_naissance]
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
    const result = await pool.query(
        "SELECT * FROM public.utilisateurs WHERE email = $1",
        [email]
    );

    return result.rows[0]
};
exports.changement = async (motDePasseSecurise, id) => {
    const result = await pool.query(
      "UPDATE public.utilisateurs SET mot_de_passe = $1 WHERE id = $2 RETURNING *",
      [motDePasseSecurise, id]
    );
    return result.rows[0];
  };  


exports.verification = async (motDePasse, id) => {
    const result = await pool.query(
        "SELECT ancien_mot_de_passe FROM histo_mot_de_passe WHERE utilisateur_id = $1;",
        [id]
    );

    if (result.rows.length === 0) {
        return 0;
    }

    for (let row of result.rows) {
        const test = await bcrypt.compare(motDePasse, row.ancien_mot_de_passe);
        if (test) {
            return 1; 
        }
    } 
    return 0; 
};

exports.test = async (date_naissance, lieu_naissance, id) => {
    const result = await pool.query(
        "SELECT date_naissance, lieu_naissance FROM public.utilisateurs WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        return 0; // utilisateur nexiste pas
    }

    const user = result.rows[0];

    // date en format "YYYY-MM-DD"
    const dateDB = user.date_naissance.toISOString().split('T')[0];

    return (
        dateDB === date_naissance &&
        user.lieu_naissance.trim().toLowerCase() === lieu_naissance.trim().toLowerCase()
    ) ? 1 : 0;
};




  
