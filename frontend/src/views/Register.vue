<template>
  <div class="register-container">
    <div class="register-image">
      <img src="@/assets/register-image.jpg" alt="register Illustration" />
    </div>
    <form @submit.prevent="register">
      <h2>Welcome back 👋</h2>
      <p>Dive into your world of endless stories and embark on your next great adventure.</p>
      <input v-model="nom" type="text" placeholder="fullName" required />
      <input v-model="email" type="email" placeholder="email" required />
      <input v-model="dateNaissance" type="date" placeholder="Date of Birth" required />
      <input  v-model="lieuNaissance" type="text" placeholder="Place of Birth" required />
      <input v-model="motDePasse" type="password" placeholder="Password" required />
      <input v-model="confirmPassword" type="password" placeholder="Confirm password" required />
      <button type="submit">Sign Up</button>
      <p class="login-link">
        Already have an account?<router-link to="/login">Sign In</router-link>
      </p>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { mapActions } from "vuex"; // Import Vuex pour appeler l'action

export default {
  data() {
    return {
      nom: "",
      email: "",
      motDePasse: "",
      confirmPassword: "",
      errorMessage: null,
      dateNaissance:"",
      lieuNaissance:"",    };
  },
  methods: {
    ...mapActions("auth", ["register"]), // Connecte la méthode register() à l'action Vuex
    async register() {
      if (this.motDePasse !== this.confirmPassword) {
        this.errorMessage = "Les mots de passe ne correspondent pas ❌";
        return;
      }

      try {
        await this.register({ nom: this.nom, email: this.email, motDePasse: this.motDePasse, dateNaissance: this.dateNaissance, lieuNaissance: this.lieuNaissance});
        this.$router.push("/login"); // Redirection après inscription
      } catch (error) {
        this.errorMessage = error?.message || "Erreur d'inscription ❌";
      }
    },
  },
};
</script>


<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f7fc;
  padding: 20px;
}

.register-image {
  flex: 1;
  max-width: 500px;
  padding-right: 20px;
}

.register-image img {
  width: 100%;
  border-radius: 10px;
}

form {
  flex: 1;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 450px;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

button {
  background: #1a73e8;
  color: white;
  border: none;
  padding: 12px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.3s;
}

button:hover {
  background: #1669c1;
}

.login-link {
  margin-top: 15px;
  font-size: 14px;
  text-align: center;
}

.login-link a {
  color: #1a73e8;
  text-decoration: none;
}

</style>