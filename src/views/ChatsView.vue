<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import NewChatDialog from "@/components/chat/NewChatDialog.vue";
import AppLogo from "@/components/ui/AppLogo.vue";
import UserAvatar from "@/components/ui/UserAvatar.vue";
import mark from "@/assets/landing/logo-mark.svg";
import { dayLabel, shortStamp, timeOf } from "@/lib/format";
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

const search = ref("");
const visible = computed(() => {
  const q = search.value.trim().toLowerCase();
  return q ? store.conversations.filter((c) => c.other.name.toLowerCase().includes(q)) : store.conversations;
});
const unreadTotal = computed(() => store.conversations.reduce((n, c) => n + c.unread, 0));

/** Mensagens com separador de dia; "first" marca o início de cada sequência do mesmo remetente. */
const timeline = computed(() => {
  const conv = store.active;
  if (!conv) return [];
  const list = conv.chat.chatData;
  return list.map((m, i) => {
    const prev = list[i - 1];
    const day = dayLabel(m.timestamp);
    const newDay = Boolean(day) && day !== dayLabel(prev?.timestamp);
    return {
      ...m,
      mine: m.sender === conv.myRole,
      day: newDay ? day : "",
      first: newDay || prev?.sender !== m.sender,
    };
  });
});
</script>

<template>
  <div class="chats" :class="{ 'has-active': Boolean(routeId) }">
    <nav class="rail" aria-label="Navegação">
      <RouterLink to="/" class="rail-logo" aria-label="The Chat — início"><img :src="mark" alt="" width="40" height="34" /></RouterLink>
      <RouterLink to="/chats" class="rail-btn on" aria-label="Conversas">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z" /></svg>
        <span v-if="unreadTotal" class="dot-badge"></span>
      </RouterLink>
      <button class="rail-btn" type="button" aria-label="Nova conversa" @click="showNew = true">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
      </button>
      <RouterLink to="/perfil" class="rail-me" aria-label="Meu perfil">
        <UserAvatar :name="session.me?.name ?? 'Você'" :src="session.me?.img_profile" :size="42" />
      </RouterLink>
    </nav>

    <aside class="sidebar" aria-label="Conversas">
      <header class="side-top">
        <RouterLink to="/" class="logo" aria-label="The Chat — início"><AppLogo /></RouterLink>
        <RouterLink to="/perfil" aria-label="Meu perfil">
          <UserAvatar :name="session.me?.name ?? 'Você'" :src="session.me?.img_profile" :size="38" />
        </RouterLink>
      </header>
      <div class="side-head">
        <h1>Conversas<span class="dot">.</span></h1>
        <button class="new" type="button" aria-label="Nova conversa" @click="showNew = true">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
      </div>
      <label class="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></svg>
        <span class="sr-only">Buscar conversa</span>
        <input v-model="search" type="search" placeholder="Buscar conversa" />
      </label>

      <ul v-if="store.loading && !store.conversations.length" class="skeleton" aria-label="Carregando conversas">
        <li v-for="n in 4" :key="n"><span class="sk-av"></span><span class="sk-lines"><span></span><span></span></span></li>
      </ul>
      <div v-else-if="!store.conversations.length" class="side-empty">
        <p>Nenhuma conversa ainda.</p>
        <button class="btn btn-solid" type="button" @click="showNew = true">Mandar o primeiro oi</button>
      </div>
      <p v-else-if="!visible.length" class="hint">Ninguém com esse nome.</p>
      <ul class="conv-list">
        <li v-for="(c, i) in visible" :key="c.chat._id" :style="{ '--i': Math.min(i, 8) }">
          <RouterLink :to="`/chats/${c.chat._id}`" class="conv" :class="{ active: c.chat._id === routeId, unread: c.unread }">
            <UserAvatar :name="c.other.name" :src="c.other.img_profile" :size="48" />
            <span class="conv-body">
              <span class="conv-top">
                <strong>{{ c.other.name }}</strong>
                <small>{{ shortStamp(lastOf(c)?.timestamp) }}</small>
              </span>
              <span class="conv-last">
                <span>{{ lastOf(c) ? (lastOf(c)!.sender === c.myRole ? "Você: " : "") + lastOf(c)!.message : "Conversa nova. Diga oi!" }}</span>
                <span v-if="c.unread" class="badge" :aria-label="`${c.unread} não lidas`">{{ c.unread }}</span>
              </span>
            </span>
          </RouterLink>
        </li>
      </ul>
    </aside>

    <main class="pane">
      <template v-if="store.active">
        <header :key="routeId" class="pane-head">
          <RouterLink to="/chats" class="back" aria-label="Voltar para as conversas">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7" /></svg>
          </RouterLink>
          <UserAvatar :name="store.active.other.name" :src="store.active.other.img_profile" :size="44" />
          <div class="who">
            <strong>{{ store.active.other.name }}</strong>
            <small>{{ store.active.chat.chatData.length }} {{ store.active.chat.chatData.length === 1 ? "mensagem" : "mensagens" }}</small>
          </div>
        </header>

        <div ref="scroller" :key="routeId" class="messages" role="log" aria-live="polite">
          <div v-if="!timeline.length" class="say-hi">
            <UserAvatar :name="store.active.other.name" :src="store.active.other.img_profile" :size="72" />
            <p>Esse é o começo da sua conversa com <strong>{{ store.active.other.name }}</strong>.</p>
            <div class="chips">
              <button v-for="t in ['Oi! 👋', 'Tudo bem?', 'Bora conversar?']" :key="t" type="button" @click="draft = t">{{ t }}</button>
            </div>
          </div>
          <template v-for="(m, i) in timeline" :key="i">
            <p v-if="m.day" class="day"><span>{{ m.day }}</span></p>
            <p class="msg" :class="{ mine: m.mine, first: m.first }">
              <span class="text">{{ m.message }}</span>
              <time>{{ timeOf(m.timestamp) }}</time>
            </p>
          </template>
        </div>

        <form class="composer" @submit.prevent="send">
          <label for="draft" class="sr-only">Mensagem</label>
          <textarea id="draft" v-model="draft" rows="1" maxlength="4000" placeholder="Escreva uma mensagem…" @keydown.enter="onEnter"></textarea>
          <button class="send" type="submit" :disabled="!draft.trim() || sending" aria-label="Enviar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 20 4l-6 16-3-7z" /></svg>
          </button>
        </form>
        <p v-if="error" class="error pane-error" role="alert">{{ error }}</p>
      </template>
      <div v-else class="empty">
        <p v-if="error" class="error">{{ error }}</p>
        <template v-else>
          <div class="art" aria-hidden="true">
            <span class="disc"></span>
            <span class="b b1"><i></i><i></i></span>
            <span class="b b2"><i></i><i></i></span>
            <span class="b b3"><em></em><em></em><em></em></span>
          </div>
          <h2>Mandar mensagens nunca foi tão fácil<span class="dot">.</span></h2>
          <p>Escolha uma conversa ao lado ou comece uma nova. A resposta chega na hora.</p>
          <button class="btn btn-solid" type="button" @click="showNew = true">Nova conversa</button>
        </template>
      </div>
    </main>

    <NewChatDialog v-if="showNew" @pick="pick" @close="showNew = false" />
  </div>
</template>

<style scoped>
/* Layout: trilho roxo | lista de conversas | conversa */
.chats {
  height: 100dvh;
  display: grid;
  grid-template-columns: 84px minmax(290px, 360px) 1fr;
  background: var(--purple);
}
svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* trilho */
.rail {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 22px 0;
}
.rail-logo {
  margin-bottom: 18px;
}
.rail-logo img {
  width: 42px;
  height: auto;
}
.rail-btn {
  position: relative;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.rail-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.rail-btn.on {
  background: var(--brand-gradient);
  color: #fff;
  box-shadow: 0 8px 20px rgba(238, 124, 131, 0.35);
}
.dot-badge {
  position: absolute;
  top: 9px;
  right: 9px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--cyan);
  box-shadow: 0 0 0 2px var(--purple);
}
.rail-me {
  margin-top: auto;
  border-radius: 50%;
  box-shadow: 0 0 0 3px var(--brand);
}

/* lista */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 26px 18px 18px;
  background: var(--surface);
  border-radius: 28px 0 0 28px;
  margin: 10px 0 10px;
  min-height: 0;
}
.side-top {
  display: none;
  align-items: center;
  justify-content: space-between;
}
.logo {
  text-decoration: none;
  --logo-size: 18px;
}
.side-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}
.side-head h1 {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--title);
}
.dot {
  color: var(--brand-strong);
}
.new {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 2px solid var(--brand);
  border-radius: 14px;
  background: #fff;
  color: var(--brand-strong);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.new:hover {
  background: var(--brand);
  color: #fff;
}
.search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 16px;
  height: 46px;
  border-radius: 999px;
  background: #fff;
  border: 2px solid transparent;
  color: var(--muted);
  transition: border-color 0.2s;
}
.search:focus-within {
  border-color: var(--brand);
}
.search svg {
  width: 18px;
  height: 18px;
}
.search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: none;
}
.hint {
  color: var(--muted);
  text-align: center;
  font-size: 0.9rem;
  margin: 8px 0;
}
.side-empty {
  display: grid;
  gap: 12px;
  justify-items: center;
  padding: 24px 8px;
  color: var(--muted);
  text-align: center;
}
.side-empty p {
  margin: 0;
}
.conv-list li {
  animation: rise-in 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: calc(var(--i, 0) * 40ms);
}
.skeleton {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
}
.skeleton li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}
.sk-av,
.sk-lines span {
  background: linear-gradient(90deg, #f3e8e8 25%, #fbf2f2 50%, #f3e8e8 75%) 0 0 / 200% 100%;
  animation: shimmer 1.4s linear infinite;
}
.sk-av {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  flex: none;
}
.sk-lines {
  flex: 1;
  display: grid;
  gap: 8px;
}
.sk-lines span {
  height: 10px;
  border-radius: 6px;
}
.sk-lines span + span {
  width: 65%;
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
.conv-list {
  list-style: none;
  margin: 0 -6px;
  padding: 0 6px;
  overflow: auto;
  flex: 1;
  display: grid;
  align-content: start;
  gap: 4px;
}
.conv {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 18px;
  text-decoration: none;
  transition: background 0.2s, box-shadow 0.2s;
}
.conv:hover {
  background: rgba(255, 255, 255, 0.7);
}
.conv.active {
  background: #fff;
  box-shadow: 0 8px 24px rgba(57, 32, 84, 0.08);
}
.conv.active::before {
  content: "";
  position: absolute;
  left: -6px;
  top: 18px;
  bottom: 18px;
  width: 4px;
  border-radius: 4px;
  background: var(--brand-strong);
}
.conv-body {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 3px;
}
.conv-top,
.conv-last {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: 0.75rem;
  flex: none;
}
.conv-last span:first-child {
  color: var(--muted);
  font-size: 0.86rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.conv.unread .conv-last span:first-child {
  color: var(--ink);
  font-weight: 500;
}
.conv.unread .conv-top small {
  color: var(--brand-strong);
}
.badge {
  flex: none;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 999px;
  background: var(--brand-gradient);
  color: #fff;
  font-size: 0.75rem;
  line-height: 22px;
  text-align: center;
}

/* conversa */
.pane {
  display: flex;
  flex-direction: column;
  min-height: 0;
  margin: 10px 10px 10px 0;
  border-radius: 0 28px 28px 0;
  background: #fff;
  overflow: hidden;
  position: relative;
}
.pane-head {
  animation: rise-in 0.3s ease both;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 26px;
  border-bottom: 1px solid var(--line);
}
.who {
  display: grid;
}
.who strong {
  font-weight: 500;
  font-size: 1.05rem;
}
.who small {
  color: var(--muted);
  font-size: 0.78rem;
}
.back {
  display: none;
  color: var(--brand-strong);
  margin-left: -6px;
}
.messages {
  animation: rise-in 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 24px 26px 12px;
  background:
    radial-gradient(rgba(238, 149, 145, 0.22) 1px, transparent 1.3px) 0 0 / 20px 20px,
    #fff;
}
.day {
  align-self: center;
  margin: 14px 0 10px;
}
.day span {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  background: var(--lilac);
  color: var(--purple);
  font-size: 0.75rem;
  font-weight: 500;
}
.msg {
  margin: 0;
  max-width: min(68%, 520px);
  align-self: flex-start;
  padding: 9px 14px 7px;
  /* lado de quem enviou fica "colado" entre mensagens seguidas */
  border-radius: 6px 20px 20px 6px;
  background: var(--surface);
  border: 1px solid #f0e2e2;
  display: grid;
  gap: 2px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: 1.45;
  animation: pop-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  transform-origin: left bottom;
}
.msg.first {
  margin-top: 8px;
  border-top-left-radius: 20px;
}
.msg.mine {
  transform-origin: right bottom;
  align-self: flex-end;
  border: 0;
  background: var(--brand-gradient);
  color: #fff;
  border-radius: 20px 6px 6px 20px;
}
.msg.mine.first {
  border-top-right-radius: 20px;
}
.msg time {
  justify-self: end;
  font-size: 0.68rem;
  color: var(--muted);
}
.msg.mine time {
  color: rgba(255, 255, 255, 0.85);
}
.say-hi {
  margin: auto;
  display: grid;
  justify-items: center;
  gap: 12px;
  text-align: center;
  color: var(--muted);
  max-width: 340px;
}
.say-hi p {
  margin: 0;
}
.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}
.chips button {
  border: 2px solid var(--brand);
  border-radius: 999px;
  background: #fff;
  color: var(--brand-strong);
  padding: 6px 14px;
  cursor: pointer;
}
.chips button:hover {
  background: var(--brand);
  color: #fff;
}
.composer {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin: 10px 22px 20px;
  padding: 6px 6px 6px 20px;
  border-radius: 28px;
  background: var(--surface);
  border: 2px solid transparent;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.composer:focus-within {
  border-color: var(--brand);
  box-shadow: 0 10px 30px rgba(238, 124, 131, 0.15);
}
.composer textarea {
  flex: 1;
  resize: none;
  border: 0;
  background: none;
  padding: 11px 0;
  max-height: 140px;
  outline: none;
  field-sizing: content;
}
.send {
  flex: none;
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: var(--brand-gradient);
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
}
.send svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
  stroke-width: 1.5;
}
.send:not(:disabled):hover {
  transform: scale(1.06);
}
.send:disabled {
  opacity: 0.45;
  cursor: default;
}
.pane-error {
  padding: 0 26px 12px;
}

/* estado vazio */
.empty {
  animation: rise-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  flex: 1;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 14px;
  text-align: center;
  padding: 24px;
  color: var(--muted);
}
.empty h2 {
  margin: 0;
  max-width: 520px;
  font-weight: 400;
  font-size: clamp(1.5rem, 2.6vw, 2.2rem);
  line-height: 1.25;
  color: var(--title);
}
.empty p {
  margin: 0 0 8px;
  max-width: 420px;
}
.art {
  position: relative;
  width: 260px;
  height: 200px;
  margin-bottom: 10px;
}
.art .disc {
  position: absolute;
  inset: 10px 30px;
  border-radius: 50%;
  background: var(--lilac);
}
.art .b {
  position: absolute;
  display: grid;
  gap: 7px;
  padding: 14px 16px;
  border-radius: 18px;
  box-shadow: var(--shadow);
}
.art .b i {
  display: block;
  height: 6px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.85);
}
.art .b i + i {
  width: 60%;
}
.art .b1 {
  left: 0;
  top: 26px;
  width: 150px;
  background: var(--cyan);
  border-bottom-left-radius: 4px;
}
.art .b2 {
  right: 0;
  top: 86px;
  width: 160px;
  background: var(--brand-gradient);
  border-bottom-right-radius: 4px;
}
.art .b3 {
  left: 34px;
  bottom: 6px;
  display: flex;
  gap: 5px;
  background: var(--purple);
}
.art .b3 em {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  animation: blink 1.2s infinite;
}
.art .b3 em:nth-child(2) {
  animation-delay: 0.2s;
}
.art .b3 em:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0.3;
  }
  40% {
    opacity: 1;
  }
}

@media (max-width: 960px) {
  .chats {
    grid-template-columns: 72px minmax(260px, 320px) 1fr;
  }
}
@media (max-width: 760px) {
  .chats {
    grid-template-columns: 1fr;
    background: var(--surface);
  }
  .rail {
    display: none;
  }
  .sidebar,
  .pane {
    margin: 0;
    border-radius: 0;
  }
  .side-top {
    display: flex;
  }
  .chats.has-active .sidebar,
  .chats:not(.has-active) .pane {
    display: none;
  }
  .back {
    display: block;
  }
  .pane-head {
    padding: 12px 16px;
  }
  .messages {
    padding: 16px 14px 8px;
  }
  .msg {
    max-width: 84%;
  }
  .composer {
    margin: 8px 10px 12px;
  }
}
</style>
