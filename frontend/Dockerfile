# Utiliser l’image officielle de Nginx
FROM nginx:latest

# Copier la page HTML vers le serveur Nginx
COPY index.html /usr/share/nginx/html/index.html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
