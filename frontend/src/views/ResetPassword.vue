<template>
  <div>
    <h2>Réinitialiser le mot de passe</h2>
    <form @submit.prevent="resetPassword">
      <input v-model="email" type="email" placeholder="Entrez votre email" required />
      <input  v-model="dateNaissance" type="text" placeholder="Enter votre date naissance">
      <button type="submit">Envoyer le lien</button>
    </form>
    <p v-if="message" style="color: green;">{{ message }}</p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      dateNaissance:"",
      message: null,
      errorMessage: null,
    };
  },
  methods: {
    async resetPassword() {
      try {
        const response = await axios.post( `http://localhost:3000/reset-password?token=${resetToken}`, { email: this.email });
        this.message = response.data.message;
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = "Erreur lors de l'envoi du lien ❌";
        this.message = null;
      }
    },
  },
};
</script>
