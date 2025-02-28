const pool =require("../db");

exports.ajoutL = async (Titre, Auteur, Genre,date_publication) => {
    const result = await pool.query(
        "INSERT INTO public.livres (titre, auteur, genre,date_publication) VALUES ($1, $2, $3,$4) RETURNING *",
        [Titre, Auteur, Genre,date_publication]
    );
    return result.rows[0];  
};
exports.trouverLivre = async (id) => {
    const result = await pool.query(
        "SELECT * FROM public.livres WHERE id = $1 ",
        [id]
    );
    return result.rows[0];  
};
exports.supprimerLivre = async (id) => {
    const result = await pool.query(
        "DELETE FROM public.livres WHERE id = $1 RETURNING *",
        [id]
    );

    return result.rows[0];  
};
exports.modifieLivre = async (Titre, Auteur, Genre,date_publicationn,id) => {
    const result = await pool.query(
        "UPDATE public.livres SET titre = $1, auteur = $2 ,genre=$3 , date_publication=$4 WHERE id = $5 RETURNING *",
        [Titre, Auteur, Genre,date_publicationn,id]
    );

    if (result.rows.length > 0) {
        return result.rows[0]; 
    } else {
        return null;
    }  
};
exports.empLivre = async (id_livre,id) => {
    const result =await pool.query(
        "UPDATE public.livres SET utilisateur_id = $1,disponibilite=false  WHERE id = $2 RETURNING *",
        [id,id_livre]
    );
    if (result.rows.length > 0) {
        return result.rows[0]; 
    } else {
        return null;
    }  
};
