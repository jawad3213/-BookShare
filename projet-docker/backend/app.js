// Importation du module Express et création d'une application Express
const express = require("express");

// Création d'une instance du serveur Express
const app = express();

// Définition du port sur lequel le serveur va écouter les requêtes
const PORT = 3000;

// Définition d'une route GET pour la racine "/"
app.get("/", (req, res) => {
  // req : objet représentant la requête du client
  // res : objet permettant d'envoyer une réponse au client
  res.send("🚀 Hello from Backend !"); // Envoi de la réponse au client
});

// Démarrage du serveur et mise à l'écoute sur le port défini
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`); // Affichage du message de confirmation dans la console
});


