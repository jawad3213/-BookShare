const express = require("express")
const app = express()
app.use(express.json());


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


app.listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});
