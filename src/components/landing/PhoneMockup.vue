<script setup lang="ts">
import backArrow from "@/assets/landing/phone/b426d.svg";
import logoMark from "@/assets/landing/logo-mark.svg";
import notch from "@/assets/landing/phone/20c57.svg";
import sendIcon from "@/assets/landing/phone/0fa6a.svg";
import userAvatar from "@/assets/landing/phone/avatar-user.png";
import { useI18n } from "@/lib/i18n";

/**
 * Celular da seção 2 do Figma ("Home", nó 1:1189), em coordenadas do
 * próprio celular (433×870) escaladas pela largura do contêiner.
 * O "bot" da conversa usa a marca do The Chat (no Figma era o ChatGPT).
 */
const { t } = useI18n();
type Bubble = { who: "user" | "bot"; x: number; y: number; h: number; text: string; avatar: string; ax: number };
const bubbles: Bubble[] = [
  { who: "user", x: 143.01, y: 131.95, h: 69.05, ax: 354.98, avatar: userAvatar, text: "qual o melhor aplicativo para trocas de mensagens?" },
  { who: "bot", x: 93.05, y: 213, h: 65.8, ax: 58.15, avatar: logoMark, text: "Olá, o melhor aplicativo web para trocas de mensagens é o the chat." },
  { who: "user", x: 142.15, y: 287, h: 43.42, ax: 354.12, avatar: userAvatar, text: "quais os benefícios de se utilizar o the chat?" },
  {
    who: "bot",
    x: 96.19,
    y: 339.66,
    h: 309.34,
    ax: 61.29,
    avatar: logoMark,
    text: "O the chat oferece diversos benefícios para troca de mensagens com, você pode se conectar instantaneamente com amigos, familiares e colegas, onde quer que estejam. Com uma interface intuitiva e recursos avançados de privacidade. Experimente o The Chat e descubra uma nova forma de se comunicar, rápida, fácil e divertida!",
  },
  { who: "user", x: 142.15, y: 661, h: 73.28, ax: 354.12, avatar: userAvatar, text: "Muito obrigado, vou começar a utilizar agora mesmo." },
];
const px = (n: number) => `calc(${n} * var(--p))`;
</script>

<template>
  <figure class="phone-wrap" role="img" :aria-label="t('phone')">
    <div class="phone" aria-hidden="true">
      <span class="btn-side" :style="{ left: 0, top: px(175.36), height: px(30.65) }"></span>
      <span class="btn-side" :style="{ left: 0, top: px(236.65), height: px(64.7) }"></span>
      <span class="btn-side" :style="{ left: 0, top: px(320.08), height: px(64.7) }"></span>
      <span class="btn-side right" :style="{ left: px(424.78), top: px(250.27), height: px(102.15) }"></span>
      <span class="shell"></span>
      <span class="bezel"></span>
      <span class="screen"></span>
      <img class="notch" :src="notch" alt="" />

      <div class="panel">
        <img class="back" :src="backArrow" alt="" />
        <span class="head-avatar bot-badge"><img :src="logoMark" alt="" /></span>
        <span class="head-name">The Chat</span>
        <span class="head-status">Online</span>
      </div>

      <template v-for="(b, i) in bubbles" :key="i">
        <p class="bubble" :class="b.who" :style="{ left: px(b.x), top: px(b.y), minHeight: px(b.h) }">{{ b.text }}</p>
        <img v-if="b.who === 'user'" class="mini-avatar user" :src="b.avatar" alt="" :style="{ left: px(b.ax), top: px(b.y) }" />
        <span v-else class="mini-avatar bot-badge" :style="{ left: px(b.ax), top: px(b.y) }"><img :src="b.avatar" alt="" /></span>
      </template>

      <span class="composer"></span>
      <span class="send"><img :src="sendIcon" alt="" /></span>
    </div>
  </figure>
</template>

<style scoped>
.phone-wrap {
  margin: 0;
  width: 100%;
  container-type: inline-size;
}
.phone {
  --p: calc(100cqw / 433.3);
  position: relative;
  width: 100%;
  aspect-ratio: 433.3 / 870;
  font-family: var(--font);
}
.phone > * {
  position: absolute;
}
.btn-side {
  width: calc(6.81 * var(--p));
  background: linear-gradient(#f6d3cd, #e3d4d1);
}
.btn-side.right {
  width: calc(8.51 * var(--p));
  border-radius: 2px;
}
.shell {
  left: calc(4.26 * var(--p));
  top: 0;
  width: calc(422.23 * var(--p));
  height: 100%;
  border-radius: calc(77 * var(--p));
  background: conic-gradient(from 90deg at 59% 50%, #e9cbc8, rgba(203, 176, 172, 0.9) 43%, rgba(212, 183, 178, 0.9) 90%, #f6d3cd);
}
.bezel {
  left: calc(13.62 * var(--p));
  top: calc(6.81 * var(--p));
  width: calc(406.06 * var(--p));
  height: calc(853.83 * var(--p));
  border-radius: calc(71 * var(--p));
  background: #000101;
}
.screen {
  left: calc(22.13 * var(--p));
  top: calc(17.03 * var(--p));
  width: calc(389.03 * var(--p));
  height: calc(834.25 * var(--p));
  border-radius: calc(65 * var(--p));
  background: #d9d9d9;
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.25);
}
.notch {
  left: calc(131.95 * var(--p));
  top: calc(6.81 * var(--p));
  width: calc(175.79 * var(--p));
  height: calc(41.71 * var(--p));
}
.panel {
  left: calc(39.15 * var(--p));
  top: calc(72 * var(--p));
  width: calc(356 * var(--p));
  height: calc(673 * var(--p));
  border-radius: 8px;
  background: #fff;
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.25);
}
.panel > * {
  position: absolute;
}
.back {
  left: calc(15.35 * var(--p));
  top: calc(23.3 * var(--p));
  width: calc(7.7 * var(--p));
  height: calc(13.7 * var(--p));
}
.head-avatar {
  left: calc(35.76 * var(--p));
  top: calc(15.68 * var(--p));
  width: calc(25.54 * var(--p));
  height: calc(25.54 * var(--p));
}
.head-name {
  left: calc(68 * var(--p));
  top: calc(16 * var(--p));
  font-size: calc(13 * var(--p));
  color: #000;
}
.head-status {
  left: calc(68 * var(--p));
  top: calc(30 * var(--p));
  font-size: calc(10 * var(--p));
  color: #aeaeae;
}
.bubble {
  margin: 0;
  width: calc(199.2 * var(--p));
  padding: calc(4 * var(--p)) calc(8.5 * var(--p));
  border: 1px solid #bcbcbc;
  border-radius: 8px;
  background: #fff;
  font-size: calc(13 * var(--p));
  line-height: 1.5;
  color: #252525;
}
.bubble.user {
  border-color: var(--brand-strong);
}
.mini-avatar {
  width: calc(25.54 * var(--p));
  height: calc(25.54 * var(--p));
}
.bot-badge {
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #fdeeee;
}
.bot-badge img {
  width: 72%;
  height: auto;
}
.mini-avatar.user {
  border-radius: 50%;
  object-fit: cover;
}
.composer {
  left: calc(39.16 * var(--p));
  top: calc(763.59 * var(--p));
  width: calc(315.82 * var(--p));
  height: calc(49.37 * var(--p));
  border-radius: 8px;
  background: #fff;
  box-shadow: -10px 10px 30px rgba(0, 0, 0, 0.25);
}
.send {
  left: calc(360.94 * var(--p));
  top: calc(771.25 * var(--p));
  width: calc(34.05 * var(--p));
  height: calc(34.05 * var(--p));
  border-radius: 8px;
  background: #1c92ff;
  box-shadow: -5px 5px 6px rgba(0, 0, 0, 0.25);
  display: grid;
  place-items: center;
}
.send img {
  width: 85%;
  height: 85%;
}
</style>
