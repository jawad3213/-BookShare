import axios from "axios";

const API_URL = "http://localhost:3000"; // Remplace par l'URL de ton backend

const authService = {
  // ✅ Inscription d'un nouvel utilisateur
  async register(nom, email, motDePasse, dateNaissance, lieuNaissance) {
    try {
      const response = await axios.post(`${API_URL}/inscription`, {
        nom,
        email,
        motDePasse,
        dateNaissance,
        lieuNaissance
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur de connexion au serveur" };
    }
  },

  // ✅ Connexion utilisateur
  async login(email, motDePasse) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        motDePasse
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur de connexion au serveur" };
    }
  },

  // ✅ Déconnexion
  async logout() {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (error) {
      throw error.response?.data || { message: "Erreur de connexion au serveur" };
    }
  },

  // ✅ Récupération des infos utilisateur
  async getUser(id) {
    try {
      const response = await axios.get(`${API_URL}/utilisateur/${id}/get`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur de connexion au serveur" };
    }
  },

  // ✅ Modification du compte utilisateur
  async updateUser(id, nom, email, motDePasse) {
    try {
      const response = await axios.put(`${API_URL}/utilisateur/${id}/changement`, {
        nom,
        email,
        motDePasse
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur de connexion au serveur" };
    }
  },

  // ✅ Suppression du compte utilisateur
  async deleteUser(id) {
    try {
      const response = await axios.delete(`${API_URL}/utilisateur/${id}/delete`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur de connexion au serveur" };
    }
  }
};

export default authService;