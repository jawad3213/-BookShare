<template>
    <header class="header">
      <div class="logo">
        <img src="@/assets/logo.png" alt="Logo" />
      </div>
      <nav>
        <router-link to="/" exact-active-class="active">Home</router-link>
        <router-link to="/library" exact-active-class="active">Bookshelf</router-link>
        <router-link to="/circulation" exact-active-class="active">Book Circulation</router-link>
        <router-link to="/about" exact-active-class="active">About</router-link>
        <router-link to="/contact" exact-active-class="active">Contact Us</router-link>
      </nav>
      <div class="auth-links">
      <!-- Affiche Sign In et Sign Up si l'utilisateur n'est PAS connecté -->
      <router-link v-if="!isAuthenticated" to="/login">Sign In</router-link>
      <router-link v-if="!isAuthenticated" to="/register">Sign Up</router-link>
  
      <!-- Affiche Logout si l'utilisateur est connecté -->
      <button v-if="isAuthenticated" @click="logout">Logout</button>
      </div>
    </header>
  </template>
  
  
  
  <script>
  export default {
    computed: {
      isAuthenticated() {
        return this.$store.state.user !== null && this.$store.state.user !== undefined;
      }
    },
    methods: {
      logout() {
        if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
          this.$store.dispatch("logout");
          this.$router.push("/login");
        }
      }
    },
    mounted() {
      console.log("User status:", this.$store.state.user); // Debugging
    }
  };
  </script>
  
  
  
  <style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 26px;
    width: 97%;
    height: 128px;
    background: #EBEBEB;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3), 
                0px 2px 6px 2px rgba(0, 0, 0, 0.15);
          
  }
  
  .logo img {
    width: 156px;
    height: auto;
  }
  
  nav {
    display: flex;
    gap: 25px;
    font-size: 17px;
  }
  
  .auth-links {
    display: flex;
    gap: 35px;
  }
  
  .auth-links a, .auth-links button {
    padding: 16px;
    background: #22469C;
    color: white;
    font-weight: 600;
    font-size: 17px;
    border-radius: 50px;
    transition: 0.3s;
    border: none;
    cursor: pointer;
    text-decoration: none;
  }
  
  .auth-links a:hover, .auth-links button:hover {
    background: #1a347b;
  }
  </style>