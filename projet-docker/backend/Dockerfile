# Utiliser une image officielle de Node.js
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package.json ./
RUN npm install

# Copier tout le reste des fichiers
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer le serveur Node.js
CMD ["npm", "start"]
