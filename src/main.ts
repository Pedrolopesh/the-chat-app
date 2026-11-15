import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { setUnauthorizedHandler } from "./api/http";
import { useSession } from "./stores/session";
import "./styles/base.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);

// token expirado/inválido: sai e volta para o login
setUnauthorizedHandler(() => {
  useSession().logout();
  void router.push({ name: "login" });
});

app.mount("#app");
