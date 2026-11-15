<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import NewChatDialog from "@/components/chat/NewChatDialog.vue";
import AppLogo from "@/components/ui/AppLogo.vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";
import { shortStamp } from "@/lib/format";
import { useChats } from "@/stores/chats";
import { useSession } from "@/stores/session";

const route = useRoute();
const router = useRouter();
const session = useSession();
const store = useChats();

const draft = ref("");
const sending = ref(false);
const error = ref("");
const showNew = ref(false);
const scroller = ref<HTMLElement | null>(null);
const routeId = computed(() => (typeof route.params.id === "string" ? route.params.id : ""));

async function scrollToEnd() {
  await nextTick();
  scroller.value?.scrollTo({ top: scroller.value.scrollHeight });
}

onMounted(async () => {
  if (!session.me) await session.loadMe().catch(() => null);
  await store.load();
});

watch(
  routeId,
  async (id) => {
    error.value = "";
    if (!id) return void (store.activeId = null);
    try {
      await store.open(id);
      await scrollToEnd();
    } catch {
      error.value = "Conversa não encontrada.";
    }
  },
  { immediate: true },
);

watch(() => store.active?.chat.chatData.length, scrollToEnd);

async function send() {
  const text = draft.value.trim();
  if (!text || sending.value) return;
  sending.value = true;
  error.value = "";
  try {
    await store.send(text);
    draft.value = "";
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    sending.value = false;
  }
}

function onEnter(e: KeyboardEvent) {
  if (!e.shiftKey) {
    e.preventDefault();
    void send();
  }
}

async function pick(userId: string) {
  showNew.value = false;
  const id = await store.startWith(userId);
  await router.push(`/chats/${id}`);
}

const lastOf = (c: (typeof store.conversations)[number]) => c.chat.chatData.at(-1);
</script>

<template>
  <div class="chats" :class="{ 'has-active': Boolean(routeId) }">
    <aside class="sidebar" aria-label="Conversas">
      <header class="side-head">
        <RouterLink to="/" class="logo" aria-label="The Chat — início"><AppLogo /></RouterLink>
        <RouterLink to="/perfil" class="me" aria-label="Meu perfil">
          <UserAvatar :name="session.me?.name ?? 'Você'" :src="session.me?.img_profile" :size="38" />
        </RouterLink>
      </header>
      <button class="btn btn-solid new" type="button" @click="showNew = true">+ Nova conversa</button>

      <p v-if="store.loading && !store.conversations.length" class="hint">Carregando…</p>
      <p v-else-if="!store.conversations.length" class="hint">Nenhuma conversa ainda. Comece uma nova! 💬</p>
      <ul class="conv-list">
        <li v-for="c in store.conversations" :key="c.chat._id">
          <RouterLink :to="`/chats/${c.chat._id}`" class="conv" :class="{ active: c.chat._id === routeId }">
            <UserAvatar :name="c.other.name" :src="c.other.img_profile" :size="46" />
            <span class="conv-body">
              <span class="conv-top">
                <strong>{{ c.other.name }}</strong>
                <small>{{ shortStamp(lastOf(c)?.timestamp) }}</small>
              </span>
              <span class="conv-last">
                <span>{{ lastOf(c) ? (lastOf(c)!.sender === c.myRole ? "Você: " : "") + lastOf(c)!.message : "Conversa nova" }}</span>
                <span v-if="c.unread" class="badge" :aria-label="`${c.unread} não lidas`">{{ c.unread }}</span>
              </span>
            </span>
          </RouterLink>
        </li>
      </ul>
    </aside>

    <main class="pane">
      <template v-if="store.active">
        <header class="pane-head">
          <RouterLink to="/chats" class="back" aria-label="Voltar para as conversas">‹</RouterLink>
          <UserAvatar :name="store.active.other.name" :src="store.active.other.img_profile" :size="42" />
          <div>
            <strong>{{ store.active.other.name }}</strong>
          </div>
        </header>

        <div ref="scroller" class="messages" role="log" aria-live="polite">
          <p v-for="(m, i) in store.active.chat.chatData" :key="i" class="msg" :class="{ mine: m.sender === store.active.myRole }">
            <span class="text">{{ m.message }}</span>
            <time>{{ shortStamp(m.timestamp) }}</time>
          </p>
        </div>

        <form class="composer" @submit.prevent="send">
          <label for="draft" class="sr-only">Mensagem</label>
          <textarea id="draft" v-model="draft" rows="1" maxlength="4000" placeholder="Escreva uma mensagem" @keydown.enter="onEnter"></textarea>
          <button class="send" type="submit" :disabled="!draft.trim() || sending" aria-label="Enviar">➤</button>
        </form>
        <p v-if="error" class="error pane-error" role="alert">{{ error }}</p>
      </template>
      <div v-else class="empty">
        <p v-if="error" class="error">{{ error }}</p>
        <template v-else>
          <h1>Mandar mensagens nunca foi tão fácil<span class="dot">.</span></h1>
          <p>Escolha uma conversa ao lado ou comece uma nova.</p>
        </template>
      </div>
    </main>

    <NewChatDialog v-if="showNew" @pick="pick" @close="showNew = false" />
  </div>
</template>

<style scoped>
.chats {
  height: 100dvh;
  display: grid;
  grid-template-columns: minmax(280px, 360px) 1fr;
  background: var(--surface);
}
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 14px;
  background: #fff;
  border-right: 1px solid var(--border);
  min-height: 0;
}
.side-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  text-decoration: none;
  --logo-size: 18px;
}
.me {
  border-radius: 50%;
}
.new {
  width: 100%;
}
.hint {
  color: var(--muted);
  text-align: center;
  font-size: 0.9rem;
}
.conv-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: auto;
  flex: 1;
}
.conv {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 12px;
  text-decoration: none;
}
.conv:hover {
  background: var(--surface);
}
.conv.active {
  background: #fdeeee;
}
.conv-body {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 2px;
}
.conv-top,
.conv-last {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.conv-top strong {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.conv-top small {
  color: var(--muted);
  flex: none;
}
.conv-last span:first-child {
  color: var(--muted);
  font-size: 0.88rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.badge {
  flex: none;
  min-width: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--brand);
  color: #fff;
  font-size: 0.75rem;
  text-align: center;
}
.pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.pane-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid var(--border);
}
.pane-head strong {
  font-weight: 500;
}
.back {
  display: none;
  font-size: 2rem;
  line-height: 1;
  text-decoration: none;
  color: var(--brand-strong);
}
.messages {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
}
.msg {
  margin: 0;
  max-width: min(70%, 520px);
  align-self: flex-start;
  padding: 8px 12px;
  border: 1px solid #bcbcbc;
  border-radius: 8px;
  background: #fff;
  display: grid;
  gap: 2px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.msg.mine {
  align-self: flex-end;
  border-color: var(--brand-strong);
  background: #fff6f6;
}
.msg time {
  justify-self: end;
  font-size: 0.7rem;
  color: var(--muted);
}
.composer {
  display: flex;
  gap: 10px;
  padding: 14px 20px;
  background: #fff;
  border-top: 1px solid var(--border);
}
.composer textarea {
  flex: 1;
  resize: none;
  border: 2px solid var(--border);
  border-radius: 12px;
  padding: 10px 14px;
  max-height: 140px;
  outline: none;
  field-sizing: content;
}
.composer textarea:focus {
  border-color: var(--brand);
}
.send {
  width: 46px;
  border: 0;
  border-radius: 12px;
  background: var(--brand);
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
}
.send:disabled {
  opacity: 0.5;
  cursor: default;
}
.pane-error {
  padding: 0 20px 10px;
  background: #fff;
}
.empty {
  flex: 1;
  display: grid;
  place-content: center;
  text-align: center;
  padding: 24px;
  color: var(--muted);
}
.empty h1 {
  margin: 0 0 8px;
  font-weight: 400;
  font-size: clamp(1.5rem, 3vw, 2.4rem);
  color: var(--title);
}
.dot {
  color: var(--brand);
}
@media (max-width: 760px) {
  .chats {
    grid-template-columns: 1fr;
  }
  .chats.has-active .sidebar,
  .chats:not(.has-active) .pane {
    display: none;
  }
  .back {
    display: block;
  }
  .msg {
    max-width: 85%;
  }
}
</style>
