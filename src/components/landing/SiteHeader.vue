<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import translateIcon from "@/assets/landing/translate.svg";
import { tokenStore } from "@/api/http";
import AppLogo from "@/components/ui/AppLogo.vue";
import { useI18n } from "@/lib/i18n";

defineProps<{ active: string }>();
const { t, toggle } = useI18n();
const logged = Boolean(tokenStore.get());
const links = [
  { id: "recursos", key: "nav_features" },
  { id: "como", key: "nav_how" },
  { id: "faq", key: "nav_faq" },
] as const;

// cabeçalho ganha fundo e sombra depois que a página rola
const scrolled = ref(false);
const onScroll = () => (scrolled.value = window.scrollY > 8);
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="inner">
      <a href="#inicio" class="brand" aria-label="The Chat — início"><AppLogo /></a>
      <nav aria-label="Principal">
        <a v-for="l in links" :key="l.id" class="link" :href="`#${l.id}`" :class="{ active: active === l.id }" :aria-current="active === l.id ? 'true' : undefined">
          {{ t(l.key) }}
        </a>
        <RouterLink class="enter pill" :to="logged ? '/chats' : '/entrar'">{{ logged ? t("nav_open") : t("nav_enter") }}</RouterLink>
        <button type="button" class="translate" :title="t('translate')" :aria-label="t('translate')" @click="toggle">
          <img :src="translateIcon" alt="" width="18" height="16" />
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  transition: background 0.3s, box-shadow 0.3s, backdrop-filter 0.3s;
}
.site-header.scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 rgba(238, 149, 145, 0.18), 0 10px 30px rgba(57, 32, 84, 0.06);
}
.inner {
  width: min(1200px, 100% - 48px);
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 18px 0;
  transition: padding 0.3s;
}
.scrolled .inner {
  padding: 12px 0;
}
.brand {
  text-decoration: none;
  --logo-size: 22px;
}
nav {
  display: flex;
  align-items: center;
  gap: 36px;
}
.link {
  position: relative;
  text-decoration: none;
  color: var(--ink);
  transition: color 0.2s;
}
.link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  border-radius: 2px;
  background: var(--brand-strong);
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.link:hover,
.link.active {
  color: var(--brand-strong);
}
.link:hover::after,
.link.active::after {
  transform: scaleX(1);
}
.translate {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 10px;
  background: var(--brand);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}
.translate:hover {
  background: var(--brand-strong);
}
@media (max-width: 860px) {
  .link {
    display: none;
  }
  nav {
    gap: 12px;
  }
  .brand :deep(.name) {
    display: none;
  }
}
</style>
