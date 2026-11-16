import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authApi, usersApi } from "@/api";
import { tokenStore } from "@/api/http";
import type { Me } from "@/api/types";
import { closeSocket } from "@/lib/socket";

export const useSession = defineStore("session", () => {
  const userId = ref<string | null>(tokenStore.userId());
  const me = ref<Me | null>(null);
  const loggedIn = computed(() => Boolean(userId.value && tokenStore.get()));

  async function confirm(email: string, code: string) {
    const res = await authApi.confirm(email, code);
    tokenStore.set(res.token, res.user_id);
    userId.value = res.user_id;
    await loadMe();
    return res.isNew;
  }

  async function loadMe() {
    if (!userId.value) return null;
    me.value = await usersApi.me(userId.value);
    return me.value;
  }

  function logout() {
    tokenStore.clear();
    closeSocket();
    userId.value = null;
    me.value = null;
  }

  return { userId, me, loggedIn, confirm, loadMe, logout };
});
