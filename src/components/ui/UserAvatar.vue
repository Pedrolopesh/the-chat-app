<script setup lang="ts">
import { computed } from "vue";
import { initials } from "@/lib/format";

const props = withDefaults(defineProps<{ name: string; src?: string; size?: number }>(), { src: "", size: 44 });
// só imagens https vindas da API; o resto vira iniciais
const safeSrc = computed(() => (props.src.startsWith("https://") ? props.src : ""));
</script>

<template>
  <span class="avatar" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.38}px` }">
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
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
