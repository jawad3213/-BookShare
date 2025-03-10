import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";
import Bookshelf from "@/views/Bookshelf.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import ResetPassword from "@/views/ResetPassword.vue";
import Circulation from "@/views/Circulation.vue";
import AboutUs from "@/views/AboutUs.vue";
import Contact from "@/views/Contact.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/library", component: Bookshelf },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/reset-password", component: ResetPassword },
  { path: "/circulation", component: Circulation },
  { path: "/about", component: AboutUs},
  { path: "/contact", component: Contact},

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/* //  Vérification d'auth avant chaque navigation
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters["auth/isAuthenticated"]) {
    next("/login"); //  Rediriger vers login si non connecté
  } else {
    next();
  }
}); */

export default router;