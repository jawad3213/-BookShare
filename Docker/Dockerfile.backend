# Étape 1 : Utiliser l'image officielle Node.js
FROM node:18

# Étape 2 : Définir où l'application sera installée dans le conteneur
WORKDIR /app

# Étape 3 : Copier le fichier package.json pour installer les dépendances
COPY package.json ./

# Étape 4 : Installer les dépendances avec npm
RUN npm install

# Étape 5 : Copier tous les fichiers du projet dans le conteneur
COPY . .

# Étape 6 : Dire à Docker que l'application écoute sur le port 3000
EXPOSE 3000

# Étape 7 : Démarrer l'application Node.js
CMD ["npm", "start"]

