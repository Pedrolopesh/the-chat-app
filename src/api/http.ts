/** Cliente HTTP da API: base URL, token e erros num lugar só. */
export const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:3333").replace(/\/$/, "");

const TOKEN_KEY = "thechat.token";
const USER_KEY = "thechat.userId";

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  userId: () => localStorage.getItem(USER_KEY),
  set(token: string, userId: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, userId);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body: unknown = null,
  ) {
    super(message);
  }
}

let onUnauthorized: () => void = () => {};
export const setUnauthorizedHandler = (fn: () => void) => (onUnauthorized = fn);

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = tokenStore.get();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");

  let res: Response;
  try {
    res = await fetch(`${API_URL}/api${path}`, { ...init, headers });
  } catch {
    throw new ApiError(0, "Sem conexão com o servidor. Tente de novo.");
  }
  const text = await res.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* texto puro */
  }
  if (!res.ok) {
    if (res.status === 401 && token) onUnauthorized();
    const message =
      res.status === 429
        ? "Muitas tentativas. Espere alguns minutos e tente de novo."
        : ((body as { message?: string; error?: string })?.message ??
          (body as { error?: string })?.error ??
          "Algo deu errado.");
    throw new ApiError(res.status, message, body);
  }
  return body as T;
}

export const json = (method: string, data?: unknown): RequestInit => ({
  method,
  body: data === undefined ? undefined : JSON.stringify(data),
});
