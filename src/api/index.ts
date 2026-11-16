import { json, request } from "./http";
import type { Chat, Me, PublicUser } from "./types";

export const authApi = {
  start: (email: string, name?: string) => request<{ success: boolean }>("/auth/email/start", json("POST", { email, name })),
  confirm: (email: string, code: string) =>
    request<{ success: boolean; user_id: string; token: string; isNew: boolean }>(
      "/auth/email/confirm",
      json("POST", { email, code }),
    ),
};

export const usersApi = {
  me: (id: string) => request<{ content: Me }>(`/user/${id}`).then((r) => r.content),
  list: () => request<PublicUser[]>("/list/users"),
  rename: (id: string, name: string) => request<{ data: Me }>(`/update/user/${id}`, json("PUT", { name })).then((r) => r.data),
  uploadAvatar(file: File) {
    const fd = new FormData();
    fd.append("photo", file);
    return request<{ data: Me }>("/upload/user/image", { method: "PATCH", body: fd }).then((r) => r.data);
  },
};

export const chatsApi = {
  mine: (userId: string) =>
    request<{ user_response_mesage: Chat[]; user_origin_message: Chat[] }>(`/chats/userid/${userId}`).then((r) => [
      ...r.user_response_mesage,
      ...r.user_origin_message,
    ]),
  get: (id: string) => request<Chat>(`/chat/messages/${id}`),
  create: (userId: string) =>
    request<{ success: boolean; doc?: Chat; message?: Chat | string }>("/create/chat", json("POST", { user_response: userId })),
  send: (chatId: string, message: string, timestamp: string) =>
    request<{ data: Chat }>("/send/message", json("PUT", { chat_id: chatId, chatData: { message, timestamp } })),
};

export const publicApi = {
  stats: () => request<{ users: number; messages: number }>("/stats"),
  pushKey: () => request<{ success: boolean; publicKey: string | null }>("/push/key"),
};

export const pushApi = {
  subscribe: (sub: PushSubscriptionJSON) => request("/subscribe", json("POST", { subscribeData: sub })),
  test: () => request("/notification/send", json("POST")),
};
