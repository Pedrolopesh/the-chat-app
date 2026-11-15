import { io, type Socket } from "socket.io-client";
import { API_URL, tokenStore } from "@/api/http";

let socket: Socket | null = null;

/** Uma conexão por sessão, autenticada pelo token. */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, {
      auth: (cb) => cb({ token: tokenStore.get() }),
      transports: ["websocket", "polling"],
    });
  }
  return socket;
}

export function joinChat(chatId: string): Promise<boolean> {
  return new Promise((resolve) => getSocket().emit("join", chatId, (ok: boolean) => resolve(ok)));
}

export function closeSocket() {
  socket?.disconnect();
  socket = null;
}
