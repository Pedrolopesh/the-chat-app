# The Chat — app

Front do The Chat: landing + chat em tempo real com entrada sem senha
(código de 6 dígitos por e-mail).

Vue 3 · Vite · TypeScript · Vue Router · Pinia · socket.io-client.
API: [the-chat-api](https://github.com/Pedrolopesh/the-chat-api).

Produção: `https://thechat.pedrolopes.tech` (Vercel) → API em
`https://thechat-api.pedrolopes.tech`.

## Rodando localmente

```bash
cp .env.example .env.local     # VITE_API_URL=http://localhost:3333
npm ci
npm run dev                    # http://localhost:8080
```

Com a API local sem `RESEND_API_KEY`, o código de acesso aparece no log da API.

| Comando | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | checagem de tipos + build de produção em `dist/` |
| `npm test` | testes (Vitest + Vue Test Utils) |
| `npm run lint` | ESLint |

## Telas

| Rota | Tela |
|---|---|
| `/` | landing (layout do Figma *The Chat - Portfólio*: hero, introdução com números reais da API, sobre o autor), em pt/en |
| `/entrar` | e-mail → código de 6 dígitos (aceita colar) |
| `/bem-vindo` | primeiro acesso: nome e foto |
| `/chats/:id?` | lista de conversas + conversa aberta, mensagens em tempo real |
| `/perfil` | nome, foto, notificações push e sair |

## Organização

```
src/
  api/          cliente HTTP (token, erros) e chamadas da API
  stores/       sessão e conversas (Pinia); socket por usuário
  lib/          socket, push, i18n da landing, formatação
  components/   landing/ (peças do Figma), chat/, ui/
  views/        uma por rota
public/sw.js    service worker só para notificações push
```

## Segurança

- Token só em `localStorage` do próprio domínio; 401 desloga e volta ao login.
- Imagens de perfil só de URL `https`; textos sempre como texto (sem `v-html`).
- `vercel.json`: CSP restrita (scripts só do próprio domínio, conexões só com a API), HSTS, `X-Frame-Options`, `nosniff`.
