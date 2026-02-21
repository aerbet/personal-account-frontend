import { createWebHistory, createRouter } from "vue-router";
import Login from "./components/Login.vue";
import { initCsrf } from "./services/csrf";

const routes = [
  {
    path: "/login",
    component: Login,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path === "/login" || to.path === "/customers") {
    await initCsrf();
  }
  next();
});


export default router;
