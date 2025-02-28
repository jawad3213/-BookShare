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

app.listen( process.env.PORT, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});
