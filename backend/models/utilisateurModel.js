const bcrypt = require("bcrypt");
const pool =require("../db");


exports.trouverUtilisateur = async (id) => {
    const result = await pool.query(
        "SELECT * FROM public.utilisateurs WHERE id = $1 ",
        [id]
    );
    return result.rows[0];  
};

exports.supprimerUtilisateur = async (id) => {
    await pool.query(
        "UPDATE livres SET disponibilite = false, utilisateur_id = NULL WHERE utilisateur_id = $1",
        [id]
    );
    const result = await pool.query(
        "DELETE FROM public.utilisateurs WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];  
};

exports.modifyEmail = async (email, id) => {
    const result = await pool.query(
        "UPDATE public.utilisateurs SET email = $1 WHERE id = $2 RETURNING *",
        [email, id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
};

exports.modifyNom = async (nom,id) => {
    const result = await pool.query(
        "UPDATE public.utilisateurs SET nom = $1 WHERE id = $2 RETURNING *",
        [nom,id]
    );

    if (result.rows.length > 0) {
        return result.rows[0]; 
    } else {
        return null;
    }  
};

exports.modifyDate = async (date_naissance,id) => {
    const result = await pool.query(
        "UPDATE public.utilisateurs SET date_naissance = $1 WHERE id = $2 RETURNING *",
        [date_naissance,id]
    );

    if (result.rows.length > 0) {
        return result.rows[0]; 
    } else {
        return null;
    }  
};

exports.testInitial = async (InitialMotDePasse, id) => { 
    
    const result1 = await pool.query(
        "SELECT mot_de_passe FROM public.utilisateurs WHERE id = $1",
        [id]
    );

    const isMatch = await bcrypt.compare(InitialMotDePasse, result1.rows[0].mot_de_passe);
    return isMatch;  
};

exports.modifyMotdepasse = async (motDePasse, id) => { 

    const hashedPassword = await bcrypt.hash(motDePasse, 10);
    const result =await pool.query(
        "UPDATE public.utilisateurs SET mot_de_passe = $1 WHERE id = $2 RETURNING *",
        [hashedPassword, id]
    );
    return result.rows[0];
};


exports.modifyLieux = async (lieu_naissance,id) => {
    const result = await pool.query(
        "UPDATE public.utilisateurs SET lieu_naissance = $1 WHERE id = $2 RETURNING *",
        [lieu_naissance,id]
    );

    if (result.rows.length > 0) {
        return result.rows[0]; 
    } else {
        return null;
    }  
};