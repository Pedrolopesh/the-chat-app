<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authApi } from "@/api";
import { ApiError } from "@/api/http";
import AuthShell from "@/components/ui/AuthShell.vue";
import CodeInput from "@/components/ui/CodeInput.vue";
import { useSession } from "@/stores/session";

/** Entrada sem senha: e-mail → código de 6 dígitos (mesmo fluxo do Next Journey). */
const route = useRoute();
const router = useRouter();
const session = useSession();

const step = ref<"email" | "code">("email");
const email = ref("");
const code = ref("");
const busy = ref(false);
const error = ref("");
const cooldown = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

function startCooldown() {
  cooldown.value = 60;
  clearInterval(timer);
  timer = setInterval(() => {
    cooldown.value--;
    if (cooldown.value <= 0) clearInterval(timer);
  }, 1000);
}
onBeforeUnmount(() => clearInterval(timer));

async function sendCode() {
  error.value = "";
  busy.value = true;
  try {
    await authApi.start(email.value.trim());
    step.value = "code";
    code.value = "";
    startCooldown();
  } catch (e) {
    error.value = e instanceof ApiError && e.status === 400 ? "Confira o e-mail digitado." : (e as Error).message;
  } finally {
    busy.value = false;
  }
}

async function confirm(typed?: string) {
  if (typeof typed === "string") code.value = typed;
  if (!/^\d{6}$/.test(code.value) || busy.value) return;
  error.value = "";
  busy.value = true;
  try {
    const isNew = await session.confirm(email.value.trim(), code.value);
    const next = typeof route.query.next === "string" && route.query.next.startsWith("/") ? route.query.next : "/chats";
    await router.replace(isNew ? "/bem-vindo" : next);
  } catch (e) {
    error.value = e instanceof ApiError && e.status === 400 ? "Código inválido ou expirado." : (e as Error).message;
    code.value = "";
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <AuthShell>
    <template v-if="step === 'email'">
      <h1>Entrar no The Chat</h1>
      <p class="lead">Sem senha: enviamos um código de acesso para o seu e-mail. Se for a primeira vez, a conta é criada na hora.</p>
      <form class="form" @submit.prevent="sendCode">
        <div class="field">
          <label for="email">E-mail</label>
          <input id="email" v-model="email" class="input" type="email" autocomplete="email" required maxlength="254" placeholder="voce@exemplo.com" />
        </div>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <button class="btn btn-solid" type="submit" :disabled="busy">{{ busy ? "Enviando…" : "Receber código" }}</button>
      </form>
    </template>

    <template v-else>
      <h1>Confira seu e-mail</h1>
      <p class="lead">Digite o código de 6 dígitos que enviamos para <strong>{{ email }}</strong>. Ele vale por 15 minutos.</p>
      <form class="form" @submit.prevent="confirm()">
        <CodeInput v-model="code" :disabled="busy" @complete="confirm" />
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <button class="btn btn-solid" type="submit" :disabled="busy || code.length !== 6">{{ busy ? "Entrando…" : "Entrar" }}</button>
        <div class="links">
          <button type="button" class="link" :disabled="cooldown > 0 || busy" @click="sendCode">
            {{ cooldown > 0 ? `Reenviar em ${cooldown}s` : "Reenviar código" }}
          </button>
          <button type="button" class="link" @click="step = 'email'">Trocar e-mail</button>
        </div>
      </form>
    </template>
  </AuthShell>
</template>

<style scoped>
.form {
  display: grid;
  gap: 18px;
}
.links {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
.link {
  border: 0;
  background: none;
  color: var(--brand-strong);
  cursor: pointer;
  padding: 4px 0;
  font-size: 0.9rem;
}
.link:disabled {
  color: var(--muted);
  cursor: default;
}
</style>
