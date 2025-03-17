const express = require("express")
const app = express()
app.use(express.json());
require('dotenv').config();


app.get('/', (req, res) => {
    res.send('Hello, World!');  
});

const authRoute=require("./routes/auth");
app.use("/authentification",authRoute);

const utilisateurRoute = require("./routes/utilisateurs");
app.use("/utilisateurs",utilisateurRoute);

const livreRoute=require("./routes/livres");
app.use("/livres",livreRoute);

const empruntRoute=require("./routes/emprunts");
app.use("/emprunts",empruntRoute);

const echangeRoute=require("./routes/echanges");
app.use("/echanges",echangeRoute);

const passwordRoute=require("./routes/passwordRoute");
app.use("/reset-password",passwordRoute);

const hachage=require("./routes/hachage");
app.use("/hachage",hachage);   // pas pour site mais pour les administrateurs

// Exporter l'application pour les tests
module.exports = app;
/*
app.listen( process.env.PORT, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});
*/
// Lancer le serveur uniquement si le fichier est exécuté directement
/*if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}*/


// Lancer le serveur uniquement si le fichier est exécuté directement
if (require.main === module) {
    app.listen( process.env.PORT, () => {
        console.log("Serveur démarré sur http://localhost:3000")
    });
};
