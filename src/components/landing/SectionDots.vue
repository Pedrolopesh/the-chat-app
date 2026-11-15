<script setup lang="ts">
import { useI18n } from "@/lib/i18n";

defineProps<{ sections: string[]; active: string }>();
const { t } = useI18n();
</script>

<template>
  <nav class="section-dots" :aria-label="t('sections')">
    <a
      v-for="(id, i) in sections"
      :key="id"
      :href="`#${id}`"
      :class="{ active: active === id }"
      :aria-label="`${t('section_n')} ${i + 1}`"
      :aria-current="active === id ? 'true' : undefined"
    ></a>
  </nav>
</template>

<style scoped>
/* Figma: bolinhas de 13px #ee7c83; a ativa com anel de 23px (traço 2) */
.section-dots {
  position: fixed;
  right: calc(28 * var(--u));
  top: 50%;
  transform: translateY(-50%);
  z-index: 15;
  display: grid;
  gap: calc(21 * var(--u));
  justify-items: center;
}
.section-dots a {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.section-dots a::before {
  content: "";
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--brand-strong);
}
.section-dots a.active {
  box-shadow: inset 0 0 0 2px var(--brand-strong);
}
@media (max-width: 900px) {
  .section-dots {
    display: none;
  }
}
</style>
