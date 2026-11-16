<script setup lang="ts">
import { computed } from "vue";
import { initials } from "@/lib/format";

const props = withDefaults(defineProps<{ name: string; src?: string; size?: number }>(), { src: "", size: 44 });
// só imagens https vindas da API; o resto vira iniciais
const safeSrc = computed(() => (props.src.startsWith("https://") ? props.src : ""));
// cada pessoa ganha sempre a mesma cor da paleta, pelo nome
const tones = ["tone-0", "tone-1", "tone-2", "tone-3"];
const tone = computed(() => tones[[...props.name].reduce((n, ch) => n + ch.charCodeAt(0), 0) % tones.length]);
</script>

<template>
  <span class="avatar" :class="tone" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.38}px` }">
    <img v-if="safeSrc" :src="safeSrc" :alt="name" loading="lazy" referrerpolicy="no-referrer" />
    <span v-else aria-hidden="true">{{ initials(name) }}</span>
  </span>
</template>

<style scoped>
.avatar {
  flex: none;
  display: inline-grid;
  place-items: center;
  border-radius: 50%;
  overflow: hidden;
  background: var(--brand-soft);
  color: var(--brand-strong);
  font-weight: 600;
}
.tone-1 {
  background: var(--lilac, #eadcff);
  color: var(--purple, #392054);
}
.tone-2 {
  background: #c9f5f8;
  color: #11808a;
}
.tone-3 {
  background: var(--purple, #392054);
  color: #fff;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
