<script setup lang="ts">
import { RouterLink } from "vue-router";
import translateIcon from "@/assets/landing/translate.svg";
import { tokenStore } from "@/api/http";
import AppLogo from "@/components/ui/AppLogo.vue";
import { useI18n } from "@/lib/i18n";

defineProps<{ active: string }>();
const { t, toggle } = useI18n();
const logged = Boolean(tokenStore.get());
const links = [
  { id: "inicio", key: "nav_home" },
  { id: "introducao", key: "nav_intro" },
  { id: "contato", key: "nav_contact" },
] as const;
</script>

<template>
  <header class="site-header">
    <a href="#inicio" class="brand" aria-label="The Chat — início"><AppLogo /></a>
    <nav aria-label="Principal">
      <a v-for="l in links" :key="l.id" :href="`#${l.id}`" :class="{ active: active === l.id }" :aria-current="active === l.id ? 'true' : undefined">
        {{ t(l.key) }}
      </a>
      <RouterLink class="enter" :to="logged ? '/chats' : '/entrar'">{{ logged ? t("nav_open") : t("nav_enter") }}</RouterLink>
    </nav>
    <button type="button" class="translate" :title="t('translate')" :aria-label="t('translate')" @click="toggle">
      <img :src="translateIcon" alt="" width="21" height="19" />
    </button>
  </header>
</template>

<style scoped>
/* Figma: logo em (29,28); nav Poppins 25px em y=38, ativo #ee7c83; botão 35×35 #ee9591 r5 */
.site-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: calc(28 * var(--u)) calc(29 * var(--u));
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
}
.brand {
  text-decoration: none;
  --logo-size: calc(31 * var(--u));
}
nav {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: calc(110 * var(--u));
}
nav a {
  font-size: calc(25 * var(--u));
  color: #000;
  text-decoration: none;
  transition: color 0.2s;
}
nav a:hover,
nav a.active {
  color: var(--brand-strong);
}
nav .enter {
  border: 2px solid var(--brand);
  border-radius: 999px;
  padding: 0.25em 0.9em;
  color: var(--brand);
}
nav .enter:hover {
  background: var(--brand);
  color: #fff;
}
.translate {
  margin-left: calc(80 * var(--u));
  margin-right: calc(180 * var(--u));
  width: 35px;
  height: 35px;
  border: 0;
  border-radius: 5px;
  background: var(--brand);
  display: grid;
  place-items: center;
  cursor: pointer;
}
@media (max-width: 900px) {
  .site-header {
    padding: 14px 18px;
    gap: 1rem;
  }
  .brand {
    --logo-size: 20px;
  }
  nav a:not(.enter) {
    display: none;
  }
  nav a {
    font-size: 15px;
  }
  .translate {
    margin: 0;
    width: 32px;
    height: 32px;
  }
}
</style>
