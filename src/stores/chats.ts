import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { chatsApi } from "@/api";
import type { Chat, ChatEvent, PublicUser } from "@/api/types";
import { nowStamp } from "@/lib/format";
import { getSocket, joinChat } from "@/lib/socket";
import { useSession } from "./session";

export type Conversation = { chat: Chat; other: PublicUser; myRole: "origin" | "response"; unread: number };

export const useChats = defineStore("chats", () => {
  const session = useSession();
  const chats = ref<Chat[]>([]);
  const unread = ref<Record<string, number>>({});
  const activeId = ref<string | null>(null);
  const loading = ref(false);
  let listening = false;

  const conversations = computed<Conversation[]>(() => {
    const me = session.userId;
    return chats.value
      .map((chat) => {
        const mine = chat.user_origin[0]?._id === me;
        const other = (mine ? chat.user_response[0] : chat.user_origin[0]) ?? { _id: "", name: "Usuário removido", img_profile: "" };
        return { chat, other, myRole: mine ? ("origin" as const) : ("response" as const), unread: unread.value[chat._id] ?? 0 };
      })
      .sort((a, b) => b.chat.updatedAt.localeCompare(a.chat.updatedAt));
  });

  const active = computed(() => conversations.value.find((c) => c.chat._id === activeId.value) ?? null);

  function upsert(chat: Chat) {
    const i = chats.value.findIndex((c) => c._id === chat._id);
    if (i === -1) chats.value.push(chat);
    else chats.value[i] = chat;
  }

  /** Recebe mensagens de todas as conversas pelo socket. */
  function listen() {
    if (listening) return;
    listening = true;
    const socket = getSocket();
    // o servidor já coloca a conexão na sala do usuário: conversas novas e
    // mensagens de todas as conversas chegam por ela
    socket.on("chatCreated", () => void load());
    socket.on("messageRecived", (ev: ChatEvent) => {
      const chat = chats.value.find((c) => c._id === ev.chat_id);
      if (!chat) return void load();
      const last = chat.chatData.at(-1);
      // a própria mensagem já entrou pela resposta do PUT
      if (last && last.message === ev.message && last.sender === ev.sender && last.timestamp === ev.timestamp) return;
      chat.chatData.push({ sender: ev.sender, message: ev.message, timestamp: ev.timestamp });
      chat.updatedAt = new Date().toISOString();
      if (ev.chat_id !== activeId.value) unread.value[ev.chat_id] = (unread.value[ev.chat_id] ?? 0) + 1;
    });
  }

  async function load() {
    if (!session.userId) return;
    loading.value = true;
    try {
      chats.value = await chatsApi.mine(session.userId);
      listen();
    } finally {
      loading.value = false;
    }
  }

  async function open(id: string) {
    activeId.value = id;
    unread.value[id] = 0;
    upsert(await chatsApi.get(id));
    void joinChat(id);
  }

  async function send(text: string) {
    const conv = active.value;
    if (!conv) return;
    const { data } = await chatsApi.send(conv.chat._id, text, nowStamp());
    // resposta do PUT não vem populada: mantém os participantes já carregados
    conv.chat.chatData = data.chatData;
    conv.chat.updatedAt = data.updatedAt;
  }

  async function startWith(userId: string): Promise<string> {
    const res = await chatsApi.create(userId);
    const chat = res.doc ?? (typeof res.message === "object" ? res.message : undefined);
    if (!chat) throw new Error("Não foi possível abrir a conversa");
    await load();
    return chat._id;
  }

  function reset() {
    chats.value = [];
    unread.value = {};
    activeId.value = null;
  }

  return { chats, conversations, active, activeId, loading, load, open, send, startWith, reset };
});
