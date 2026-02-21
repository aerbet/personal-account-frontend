import { createWebHistory, createRouter } from "vue-router";
import Register from "./components/Register.vue";
import { initCsrf } from "./services/csrf";
import Main from "./components/Main.vue";

const routes = [
  {
    path: "/",
    name: "Register",
    component: Register,
  },
  {
    path: "/main",
    name: "Main",
    component: Main,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path === "/" || to.path === "/profile") {
    await initCsrf();
  }
  next();
});


export default router;
