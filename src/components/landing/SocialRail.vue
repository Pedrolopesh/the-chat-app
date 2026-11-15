<script setup lang="ts">
import rail from "@/assets/landing/social-rail.svg";
import { useI18n } from "@/lib/i18n";

const { t } = useI18n();
const url = encodeURIComponent("https://thechat.pedrolopes.tech");
const text = encodeURIComponent("Mandar mensagens nunca foi tão fácil — The Chat");
// ícones do Figma: Facebook, Instagram e Twitter (de cima para baixo)
const links = [
  { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${url}` },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "X (Twitter)", href: `https://x.com/intent/post?url=${url}&text=${text}` },
];
</script>

<template>
  <aside class="social-rail" :aria-label="t('social')">
    <img :src="rail" alt="" width="67" height="230" />
    <a v-for="l in links" :key="l.label" :href="l.href" target="_blank" rel="noopener noreferrer" :aria-label="l.label"></a>
  </aside>
</template>

<style scoped>
/* Figma: 67×230 em (35,148), fixo na lateral */
.social-rail {
  position: fixed;
  left: calc(35 * var(--u));
  top: calc(148 * var(--u));
  z-index: 15;
  width: calc(67 * var(--u));
  display: grid;
  grid-template-rows: repeat(3, 1fr);
}
.social-rail img {
  grid-area: 1 / 1 / 4 / 2;
  width: 100%;
  height: auto;
}
.social-rail a {
  grid-column: 1;
  border-radius: 8px;
}
.social-rail a:nth-of-type(1) {
  grid-row: 1;
}
.social-rail a:nth-of-type(2) {
  grid-row: 2;
}
.social-rail a:nth-of-type(3) {
  grid-row: 3;
}
.social-rail a:hover {
  background: rgba(238, 124, 131, 0.12);
}
@media (max-width: 900px) {
  .social-rail {
    display: none;
  }
}
</style>
