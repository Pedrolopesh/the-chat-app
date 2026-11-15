import { computed, ref } from "vue";

/** Textos da landing em pt/en (o botão de tradução do Figma). */
const dict = {
  pt: {
    nav_home: "Início",
    nav_intro: "Introdução",
    nav_contact: "Contato",
    nav_enter: "Entrar",
    nav_open: "Abrir o chat",
    translate: "Ver em inglês",
    hero_1: "Mandar mensagens",
    hero_2: "nunca foi tão fácil",
    hero_cta: "Chat now",
    intro_title: "Conecte-se. Comunique-se. Transforme-se e Compartilhe emoções com novas pessoas",
    stat_users: "Usuários cadastrados atualmente trocando mensagens e se conectando com novas pessoas todos os dias",
    stat_messages: "Total de mensagens que já foram trocadas entre os usuários do the chat",
    about_text:
      "Olá, sou Pedro Lopes, engenheiro de software com 5 anos de experiência no mercado de TI, fique a vontade para conhecer mais sobre mim e meus trabalhos e entrar em contato",
    about_photo: "Foto de Pedro Lopes",
    social: "Compartilhe o The Chat",
    sections: "Seções da página",
    section_n: "Ir para a seção",
    phone: "Exemplo de conversa no The Chat",
    footer: "Feito por Pedro Lopes",
  },
  en: {
    nav_home: "Home",
    nav_intro: "Introduction",
    nav_contact: "Contact",
    nav_enter: "Sign in",
    nav_open: "Open chat",
    translate: "Ver em português",
    hero_1: "Sending messages",
    hero_2: "has never been easier",
    hero_cta: "Chat now",
    intro_title: "Connect. Communicate. Transform yourself and share emotions with new people",
    stat_users: "Registered users exchanging messages and meeting new people every day",
    stat_messages: "Messages already exchanged between the chat users",
    about_text:
      "Hi, I'm Pedro Lopes, a software engineer with 5 years of experience in tech. Feel free to learn more about me and my work, and get in touch",
    about_photo: "Photo of Pedro Lopes",
    social: "Share The Chat",
    sections: "Page sections",
    section_n: "Go to section",
    phone: "Sample conversation on The Chat",
    footer: "Made by Pedro Lopes",
  },
} as const;

export type Lang = keyof typeof dict;
type Key = keyof (typeof dict)["pt"];

const stored = typeof localStorage !== "undefined" ? localStorage.getItem("thechat.lang") : null;
const lang = ref<Lang>(stored === "en" ? "en" : "pt");

export function useI18n() {
  const t = (key: Key) => dict[lang.value][key];
  const toggle = () => {
    lang.value = lang.value === "pt" ? "en" : "pt";
    localStorage.setItem("thechat.lang", lang.value);
    document.documentElement.lang = lang.value === "pt" ? "pt-BR" : "en";
  };
  return { t, lang: computed(() => lang.value), toggle };
}
