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
exports.modifieUtilisateur = async (nom,email,motDePasse,id) => {
    const result = await pool.query(
        "UPDATE public.utilisateurs SET nom = $1, email = $2 ,mot_de_passe=$3 WHERE id = $4 RETURNING *",
        [nom,email,motDePasse,id]
    );

    if (result.rows.length > 0) {
        return result.rows[0]; 
    } else {
        return null;
    }  
};