<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { usersApi } from "@/api";
import type { PublicUser } from "@/api/types";
import UserAvatar from "@/components/ui/UserAvatar.vue";
import { useSession } from "@/stores/session";

const emit = defineEmits<{ pick: [userId: string]; close: [] }>();
const session = useSession();
const users = ref<PublicUser[]>([]);
const query = ref("");
const loading = ref(true);
const error = ref("");
const dialog = ref<HTMLDialogElement | null>(null);

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return users.value.filter((u) => u._id !== session.userId && (!q || u.name.toLowerCase().includes(q)));
});

onMounted(async () => {
  dialog.value?.showModal();
  try {
    users.value = await usersApi.list();
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <dialog ref="dialog" class="dialog" aria-labelledby="new-chat-title" @close="emit('close')" @click.self="dialog?.close()">
    <div class="inner">
      <header>
        <h2 id="new-chat-title">Nova conversa</h2>
        <button class="close" type="button" aria-label="Fechar" @click="dialog?.close()">×</button>
      </header>
      <input v-model="query" class="input" type="search" placeholder="Buscar pelo nome" aria-label="Buscar pelo nome" autofocus />
      <p v-if="loading" class="hint">Carregando pessoas…</p>
      <p v-else-if="error" class="error">{{ error }}</p>
      <p v-else-if="!filtered.length" class="hint">Ninguém encontrado.</p>
      <ul v-else class="list">
        <li v-for="u in filtered" :key="u._id">
          <button type="button" @click="emit('pick', u._id)">
            <UserAvatar :name="u.name" :src="u.img_profile" :size="40" />
            <span>{{ u.name }}</span>
          </button>
        </li>
      </ul>
    </div>
  </dialog>
</template>

<style scoped>
.dialog {
  width: min(440px, calc(100vw - 32px));
  max-height: min(600px, calc(100dvh - 48px));
  padding: 0;
  border: 3px solid var(--brand);
  border-radius: var(--radius);
}
.dialog::backdrop {
  background: rgba(57, 32, 84, 0.35);
  backdrop-filter: blur(3px);
  animation: fade 0.25s ease both;
}
.dialog[open] {
  animation: dialog-in 0.32s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
@keyframes dialog-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
}
@keyframes fade {
  from {
    opacity: 0;
  }
}
.list li {
  animation: rise-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.list li:nth-child(2) {
  animation-delay: 30ms;
}
.list li:nth-child(3) {
  animation-delay: 60ms;
}
.list li:nth-child(n + 4) {
  animation-delay: 90ms;
}
.inner {
  display: grid;
  gap: 14px;
  padding: 20px;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--title);
}
.close {
  border: 0;
  background: none;
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  color: var(--muted);
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: auto;
  max-height: 380px;
}
.list button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border: 0;
  border-radius: 12px;
  background: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s, transform 0.2s;
}
.list button:hover {
  background: var(--surface);
}
.hint {
  margin: 0;
  color: var(--muted);
  text-align: center;
}
</style>
