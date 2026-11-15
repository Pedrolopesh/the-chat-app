<script setup lang="ts">
import { RouterLink } from "vue-router";
import AppLogo from "./AppLogo.vue";
</script>

<template>
  <div class="auth-shell">
    <RouterLink to="/" class="logo-link" aria-label="The Chat — início"><AppLogo /></RouterLink>
    <main class="card">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-shell {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 28px;
  padding: 32px 18px;
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 196, 216, 0.45), transparent 40%),
    radial-gradient(circle at 85% 80%, rgba(238, 149, 145, 0.25), transparent 45%),
    #fff;
}
.logo-link {
  text-decoration: none;
  --logo-size: 26px;
}
.card {
  width: min(440px, 100%);
  padding: 36px 32px;
  border: 3px solid var(--brand);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: -12px -12px 0 0 var(--brand);
  text-align: center;
}
.card :deep(h1) {
  margin: 0 0 8px;
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--title);
}
.card :deep(.lead) {
  margin: 0 0 24px;
  color: var(--muted);
  font-size: 0.95rem;
}
@media (max-width: 480px) {
  .card {
    padding: 28px 20px;
  }
}
</style>
