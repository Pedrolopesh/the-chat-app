<script setup lang="ts">
import mark from "@/assets/landing/logo-mark.svg";
</script>

<template>
  <span class="logo">
    <span class="mark">
      <img :src="mark" alt="" width="54" height="46" />
      <span class="tc" aria-hidden="true">Tc</span>
    </span>
    <span class="name">the chat</span>
  </span>
</template>

<style scoped>
/* Figma: marca 54×46 com "Tc" (Bungee Shade 23, branco) e "the chat" (31, #ee7c83) */
.logo {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  font-family: var(--font-logo);
  font-size: var(--logo-size, 31px);
  color: var(--brand-strong);
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
}
.mark {
  position: relative;
  width: 1.74em;
  flex: none;
}
.mark img {
  width: 100%;
  height: auto;
}
.tc {
  position: absolute;
  left: 0.19em;
  top: 0.02em;
  font-size: 0.74em;
  color: #fff;
}
.name {
  text-transform: uppercase;
}
</style>
