import axios from "axios";

const API_URL = "http://localhost:3000"; // Remplace par l'URL de ton backend

const bookService = {
  // ✅ Récupérer la liste des livres
  async getBooks() {
    try {
      const response = await axios.get(`${API_URL}/books`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur de connexion au serveur" };
    }
  },

  // ✅ Ajouter un livre
  async addBook(book) {
    try {
      const response = await axios.post(`${API_URL}/books`, book);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Erreur de connexion au serveur" };
    }
  }
};

export default bookService;
