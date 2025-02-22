const pool =require("../db");

exports.demandeModel = async (livre_id,emprunteur_id) => {
    const result = await pool.query(
        "INSERT INTO public.emprunts (livre_id, emprunteur_id) VALUES ($1, $2) RETURNING *",
        [livre_id, emprunteur_id]
    );
    return result.rows[0];  
};
exports.trouverEmprunt = async (id) => {
    const result = await pool.query(
        "SELECT * FROM public.emprunts WHERE id = $1 ",
        [id]
    );
    return result.rows[0];  
};
exports.accepteModel = async (id) => {
    const result = await pool.query(
        "UPDATE public.emprunts SET statut = $1, date_debut = CURRENT_DATE WHERE id = $2 RETURNING *",
        ["accepté", id]
    );

    if (result.rows.length > 0) {
        return result.rows[0]; 
    } else {
        return null;
    }   
};
exports.refusModel = async (id) => {
    const result = await pool.query(
        "UPDATE public.emprunts SET statut = $1 WHERE id = $2 RETURNING *",
        ["refusée", id]
    );

    if (result.rows.length > 0) {
        return result.rows[0];
    } else {
        return null;
    }
};
exports.finModel = async (id) => {
    const result = await pool.query(
        "UPDATE public.emprunts SET statut = $1 , date_fin = CURRENT_DATE  WHERE id = $2 RETURNING *",
        ["termineé", id]
    );

    if (result.rows.length > 0) {
        return result.rows[0];
    } else {
        return null;
    }
};
exports.supprimerEmprunt = async (id) => {
    const result = await pool.query(
        "DELETE FROM public.emprunts WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];  
};