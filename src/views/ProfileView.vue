<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { pushApi, usersApi } from "@/api";
import type { Me } from "@/api/types";
import AuthShell from "@/components/ui/AuthShell.vue";
import AvatarPicker from "@/components/ui/AvatarPicker.vue";
import { enablePush, pushSupported } from "@/lib/push";
import { useChats } from "@/stores/chats";
import { useSession } from "@/stores/session";

const session = useSession();
const chats = useChats();
const router = useRouter();
const name = ref("");
const saved = ref(false);
const busy = ref(false);
const error = ref("");
const pushState = ref("");

onMounted(async () => {
  const me = session.me ?? (await session.loadMe());
  name.value = me?.name ?? "";
});

async function save() {
  if (!session.userId || !name.value.trim()) return;
  busy.value = true;
  error.value = "";
  saved.value = false;
  try {
    session.me = await usersApi.rename(session.userId, name.value.trim());
    saved.value = true;
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    busy.value = false;
  }
}

async function notifications() {
  pushState.value = "Ativando…";
  try {
    const r = await enablePush();
    if (r === "ok") {
      await pushApi.test();
      pushState.value = "Notificações ativadas. Enviamos uma de teste.";
    } else pushState.value = r === "denied" ? "Permissão negada no navegador." : "Notificações indisponíveis neste navegador.";
  } catch (e) {
    pushState.value = (e as Error).message;
  }
}

function logout() {
  session.logout();
  chats.reset();
  void router.replace("/");
}
const onAvatar = (me: Me) => (session.me = { ...session.me!, img_profile: me.img_profile });
</script>

<template>
  <AuthShell>
    <h1>Seu perfil</h1>
    <p class="lead">{{ session.me?.email }}</p>
    <form class="form" @submit.prevent="save">
      <AvatarPicker :name="name || 'Você'" :src="session.me?.img_profile ?? ''" @updated="onAvatar" />
      <div class="field">
        <label for="name">Nome</label>
        <input id="name" v-model="name" class="input" maxlength="80" required autocomplete="name" />
      </div>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="saved" class="ok" role="status">Nome atualizado.</p>
      <button class="btn btn-solid" type="submit" :disabled="busy">{{ busy ? "Salvando…" : "Salvar" }}</button>
    </form>
    <div class="extra">
      <button v-if="pushSupported()" type="button" class="btn" @click="notifications">Ativar notificações</button>
      <p v-if="pushState" class="hint" role="status">{{ pushState }}</p>
      <RouterLink to="/chats" class="btn btn-ghost">Voltar às conversas</RouterLink>
      <button type="button" class="btn btn-ghost logout" @click="logout">Sair</button>
    </div>
  </AuthShell>
</template>

<style scoped>
.form,
.extra {
  display: grid;
  gap: 16px;
}
.extra {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
  gap: 10px;
}
.ok {
  margin: 0;
  color: #2f8a4e;
}
.hint {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}
.logout {
  color: var(--danger);
}
</style>
