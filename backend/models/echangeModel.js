const pool =require("../db");


exports.demandeModel = async (livre1_id, livre2_id, id1_uti, id2_uti) => {
    const result1 = await pool.query(
        "SELECT * FROM public.livres WHERE id = $1",
        [livre1_id]
    );
    const result2 = await pool.query(
        "SELECT * FROM public.livres WHERE id = $1",
        [livre2_id]
    );

    if (result1.rows[0].utilisateur_id === id1_uti && result2.rows[0].utilisateur_id === id2_uti) {
        const resultFinal = await pool.query(
            "INSERT INTO public.echanges (livre_preteur_id, livre_emprunteur_id, utilisateur_preteur_id, utilisateur_emprunteur_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [livre1_id, livre2_id, id1_uti, id2_uti]
        );

        return resultFinal.rows[0]; 
    } else {
        return null; 
    }
};


exports.trouverEchange = async (id) => {
    const result = await pool.query(
        "SELECT * FROM public.echanges WHERE id = $1 ",
        [id]
    );
    return result.rows[0];  
};

exports.refusModel = async (id) => {
    const result = await pool.query(
        "UPDATE public.echanges SET statut = $1 WHERE id = $2 RETURNING *",
        ["refusée", id]
    );
    return result.rows[0];
};

exports.accepteModel = async (id) => {
    const result = await pool.query(
        "UPDATE public.echanges SET statut = $1, date_de_creation = CURRENT_DATE WHERE id = $2 RETURNING * ",
        ["accepte", id]
    );
    const livrePreteurId = result.rows[0].livre_preteur_id;
    const livreEmprunteurId = result.rows[0].livre_emprunteur_id;
    const utilisateurPreteurId = result.rows[0].utilisateur_preteur_id;
    const utilisateurEmprunteurId = result.rows[0].utilisateur_emprunteur_id;

    await pool.query(
        "UPDATE public.livres SET utilisateur_id = $1 WHERE id = $2 ",
        [utilisateurEmprunteurId, livrePreteurId]
    );

    await pool.query(
        "UPDATE public.livres SET utilisateur_id = $1 WHERE id = $2 ",
        [utilisateurPreteurId, livreEmprunteurId]
    );

    return result.rows[0];
};

exports.finModel = async (id) => {
    const result = await pool.query(
        "UPDATE public.echanges SET statut = $1, date_de_finalisation = CURRENT_DATE WHERE id = $2 RETURNING * ",
        ["fin", id]
    );
    return result.rows[0];
};
exports.supprimerEchange = async (id) => {
    const result = await pool.query(
        "DELETE FROM public.echanges WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];  
};

