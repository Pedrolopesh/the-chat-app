<script setup lang="ts">
import { RouterLink } from "vue-router";
import AuthShell from "@/components/ui/AuthShell.vue";
</script>

<template>
  <AuthShell>
    <h1>Página não encontrada</h1>
    <p class="lead">Essa conversa não existe por aqui.</p>
    <RouterLink class="btn btn-solid" to="/">Voltar ao início</RouterLink>
  </AuthShell>
</template>
