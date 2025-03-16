<template>
  <div class="login-container">
    <div class="login-image">
      <img src="@/assets/login-image.jpg" alt="Login Illustration" />
    </div>
    <div class="login-form">
      <div class="tiltle">
      <h2>Welcome back 👋</h2>
      <p> Dive into your world of endless stories and embark on your next great adventure.</p>
      </div>
      <form @submit.prevent="logine">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="motDePasse" type="password" placeholder="Password" required />
        <button type="submit">Sign in<router-link to="/"></router-link></button>
        <p class="register-link">
          Not registered yet? <router-link to="/register">Create an account</router-link>
        </p>
        <p class="forgot-password">
          <router-link to="/reset-password">Forgot password?</router-link>
        </p>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      email: "",
      motDePasse: "",
      errorMessage: null,
    };
  },
  methods: {
    ...mapActions("auth", ["login"]),
    async logine() {
      try {
        console.log('Helloooo');
        const credentials = { email: this.email, motDePasse: this.motDePasse };
        await this.login(credentials);
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error?.message || "Login failed ❌";
      }
    },
  },
};
</script>

<style scoped>

.login-container, .register-container {
  display: flex;
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}


.login-image {
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
}

.login-image img {
  max-width: 80%;
  height: auto;
  border-radius: 10px;
}

/* 📝 Formulaire à droite */
.login-form, .register-container form {
  width: 50%;
  max-width: 400px;
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 🔹 Titre */
h2 {
  font-size: 28px;
  color: #22469C;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 📩 Inputs */
input {
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
}

/* 🔘 Bouton */
button {
  width: 100%;
  background: #22469C;
  color: white;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  background: #1a347b;
}

/* 🔗 Liens */
.register-link, .login-link, .forgot-password {
  margin-top: 10px;
  font-size: 14px;
}

.register-link a, .login-link a, .forgot-password a {
  color: #22469C;
  font-weight: bold;
  text-decoration: none;
}

.register-link a:hover, .login-link a:hover, .forgot-password a:hover {
  text-decoration: underline;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

</style>