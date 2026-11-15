import { createRouter, createWebHistory } from "vue-router";
import { tokenStore } from "@/api/http";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to) => (to.hash ? { el: to.hash, behavior: "smooth" } : { top: 0 }),
  routes: [
    { path: "/", name: "home", component: () => import("@/views/LandingView.vue") },
    { path: "/entrar", name: "login", component: () => import("@/views/LoginView.vue"), meta: { guest: true } },
    { path: "/bem-vindo", name: "onboarding", component: () => import("@/views/OnboardingView.vue"), meta: { auth: true } },
    { path: "/chats/:id?", name: "chats", component: () => import("@/views/ChatsView.vue"), meta: { auth: true } },
    { path: "/perfil", name: "profile", component: () => import("@/views/ProfileView.vue"), meta: { auth: true } },
    // rotas antigas do app em Vue 2
    { path: "/Home", redirect: "/" },
    { path: "/ChatList", redirect: "/chats" },
    { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("@/views/NotFoundView.vue") },
  ],
});

router.beforeEach((to) => {
  const logged = Boolean(tokenStore.get());
  if (to.meta.auth && !logged) return { name: "login", query: { next: to.fullPath } };
  if (to.meta.guest && logged) return { name: "chats" };
});

export default router;
