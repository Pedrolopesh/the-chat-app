<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { usersApi } from "@/api";
import type { Me } from "@/api/types";
import AuthShell from "@/components/ui/AuthShell.vue";
import AvatarPicker from "@/components/ui/AvatarPicker.vue";
import { useSession } from "@/stores/session";

const session = useSession();
const router = useRouter();
const name = ref("");
const busy = ref(false);
const error = ref("");

onMounted(async () => {
  const me = session.me ?? (await session.loadMe());
  name.value = me?.name ?? "";
});

async function save() {
  if (!session.userId || !name.value.trim()) return;
  busy.value = true;
  error.value = "";
  try {
    session.me = await usersApi.rename(session.userId, name.value.trim());
    await router.replace("/chats");
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}
const onAvatar = (me: Me) => (session.me = { ...session.me!, img_profile: me.img_profile });
</script>

<template>
  <AuthShell>
    <h1>Bem-vindo! 👋</h1>
    <p class="lead">Como você quer aparecer para as outras pessoas?</p>
    <form class="form" @submit.prevent="save">
      <AvatarPicker :name="name || 'Você'" :src="session.me?.img_profile ?? ''" @updated="onAvatar" />
      <div class="field">
        <label for="name">Seu nome</label>
        <input id="name" v-model="name" class="input" maxlength="80" required autocomplete="name" />
      </div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <button class="btn btn-solid" type="submit" :disabled="busy || !name.trim()">{{ busy ? "Salvando…" : "Começar a conversar" }}</button>
    </form>
  </AuthShell>
</template>

<style scoped>
.form {
  display: grid;
  gap: 18px;
}
</style>
