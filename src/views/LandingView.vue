<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import pedro from "@/assets/landing/about/pedro.png";
import { publicApi } from "@/api";
import { tokenStore } from "@/api/http";
import SiteHeader from "@/components/landing/SiteHeader.vue";
import { useI18n } from "@/lib/i18n";

/** Landing "Bento": título grande, recursos em blocos, 3 passos, dúvidas e CTA. */
const { t, lang } = useI18n();
const sections = ["inicio", "recursos", "como", "faq"];
const active = ref("inicio");
const stats = ref<{ users: number; messages: number } | null>(null);
const cta = tokenStore.get() ? "/chats" : "/entrar";
const fmt = (n: number) => n.toLocaleString(lang.value === "pt" ? "pt-BR" : "en-US");
const faqs = ["1", "2", "3", "4"] as const;
const openFaq = ref("1");

let observer: IntersectionObserver | null = null;
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) active.value = e.target.id;
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer!.observe(el);
  });
  publicApi
    .stats()
    .then((s) => (stats.value = s))
    .catch(() => (stats.value = null));
});
onBeforeUnmount(() => observer?.disconnect());

const links = [
  { label: "GitHub", href: "https://github.com/Pedrolopesh" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pedro-l-50b3b818a/" },
];
</script>

<template>
  <div class="landing">
    <SiteHeader :active="active" />

    <main>
      <section id="inicio" class="wrap hero">
        <span class="eyebrow rise" style="--d: 0ms">{{ t("eyebrow") }} <b>{{ t("free") }}</b></span>
        <h1 class="rise" style="--d: 80ms">
          {{ t("hero_a") }}
          <span class="typing-chip" aria-hidden="true"><i></i><i></i><i></i></span>
          {{ t("hero_b") }} <span class="shade">{{ t("hero_nada") }}</span> {{ t("hero_c") }}<span class="dot">.</span>
        </h1>
        <p class="lead rise" style="--d: 160ms">{{ t("hero_lead") }}</p>
        <div class="ctas rise" style="--d: 240ms">
          <RouterLink class="pill big solid" :to="cta">{{ t("cta_create") }}</RouterLink>
          <a class="pill big" href="#como">{{ t("cta_how") }}</a>
        </div>
      </section>

      <section id="recursos" class="wrap bento" :aria-label="t('features')">
        <article v-reveal class="tile t-live">
          <span class="dots"></span>
          <h2>{{ t("f_live_t") }}</h2>
          <p>{{ t("f_live_p") }}</p>
          <div class="chatbox" aria-hidden="true">
            <span class="b in">{{ t("f_live_1") }}</span>
            <span class="b out">{{ t("f_live_2") }}</span>
            <span class="b in">{{ t("f_live_3") }}</span>
            <span class="b out">{{ t("f_live_4") }}</span>
          </div>
        </article>
        <article v-reveal="80" class="tile t-code">
          <h2>{{ t("f_code_t") }}</h2>
          <p>{{ t("f_code_p") }}</p>
          <div class="code" aria-hidden="true">
            <span class="f">3</span><span class="f">9</span><span class="f">0</span><span class="c"></span><span></span><span></span>
          </div>
        </article>
        <article v-reveal="160" class="tile t-push">
          <h2>{{ t("f_push_t") }}</h2>
          <p>{{ t("f_push_p") }}</p>
          <div class="note" aria-hidden="true">
            <b>💬</b>
            <span>Mateus<small>{{ t("f_push_msg") }}</small></span>
          </div>
        </article>
        <article v-reveal class="tile t-stats">
          <h2>{{ t("f_stats_t") }}</h2>
          <div class="nums">
            <div>
              <strong>{{ stats ? fmt(stats.users) : "—" }}</strong><span>{{ t("stat_users") }}</span>
            </div>
            <div>
              <strong>{{ stats ? fmt(stats.messages) : "—" }}</strong><span>{{ t("stat_messages") }}</span>
            </div>
          </div>
        </article>
        <article v-reveal="80" class="tile t-web">
          <h2>{{ t("f_web_t") }}</h2>
          <p>{{ t("f_web_p") }}</p>
          <div class="win" aria-hidden="true"><span>The Chat</span></div>
        </article>
        <article v-reveal="160" class="tile t-me">
          <h2>{{ t("f_me_t") }}</h2>
          <p>{{ t("f_me_p") }}</p>
          <div class="stack" aria-hidden="true"><span>A</span><span>P</span><span>M</span><span>+</span></div>
        </article>
      </section>

      <section id="como" class="steps-sec">
        <div class="wrap">
          <h2 v-reveal class="sec-title">{{ t("how_title") }}<span class="dot">.</span></h2>
          <div v-reveal class="rule"></div>
          <ol class="steps">
            <li v-for="(n, i) in ['1', '2', '3'] as const" :key="n" v-reveal="i * 120" class="step">
              <span class="num">{{ n }}</span>
              <h3>{{ t(`s${n}_t`) }}</h3>
              <p>{{ t(`s${n}_p`) }}</p>
            </li>
          </ol>
        </div>
      </section>

      <section id="faq" class="wrap faq">
        <h2 v-reveal class="sec-title">{{ t("faq_title") }}<span class="dot">.</span></h2>
        <div v-reveal class="rule"></div>
        <div class="list">
          <div v-for="(n, i) in faqs" :key="n" v-reveal="i * 80" class="qa" :class="{ open: openFaq === n }">
            <h3>
              <button type="button" :aria-expanded="openFaq === n" :aria-controls="`faq-${n}`" @click="openFaq = openFaq === n ? '' : n">
                {{ t(`q${n}`) }}<span class="plus" aria-hidden="true"></span>
              </button>
            </h3>
            <div :id="`faq-${n}`" class="answer" role="region">
              <div>
                <p>{{ t(`a${n}`) }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-reveal class="wrap cta">
        <span class="dots d1"></span><span class="dots d2"></span>
        <h2>{{ t("end_title") }}<span class="dot-p">.</span></h2>
        <p>{{ t("end_p") }}</p>
        <RouterLink class="pill big light" :to="cta">{{ t("end_cta") }}</RouterLink>
        <small>
          <img :src="pedro" :alt="t('about_photo')" width="28" height="28" loading="lazy" />
          {{ t("made_by") }} ·
          <template v-for="(l, i) in links" :key="l.label">
            <a :href="l.href" target="_blank" rel="noopener noreferrer">{{ l.label }}</a><template v-if="i < links.length - 1"> · </template>
          </template>
          · <a href="https://www.pedrolopes.tech" target="_blank" rel="noopener noreferrer">pedrolopes.tech</a>
        </small>
      </section>
    </main>
  </div>
</template>

<style scoped>
.wrap {
  width: min(1200px, 100% - 48px);
  margin-inline: auto;
}
.dot {
  color: var(--brand-strong);
}
section[id] {
  scroll-margin-top: 80px;
}
.dots {
  position: absolute;
  background-image: radial-gradient(rgba(255, 255, 255, 0.7) 1.4px, transparent 1.6px);
  background-size: 9px 9px;
}

/* entrada do hero ao carregar */
.rise {
  animation: rise-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: var(--d, 0ms);
}

/* ---------- hero ---------- */
.hero {
  padding: 48px 0 40px;
  text-align: center;
}
.eyebrow {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 6px 6px 6px 16px;
  border: 2px solid var(--brand);
  border-radius: 999px;
  font-size: 0.82rem;
  color: var(--brand-strong);
}
.eyebrow b {
  background: var(--brand);
  color: #fff;
  border-radius: 999px;
  padding: 3px 10px;
  font-weight: 500;
}
.hero h1 {
  margin: 26px auto 0;
  max-width: 1100px;
  font-weight: 400;
  font-size: clamp(2.5rem, 7vw, 6.4rem);
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--title);
}
.shade {
  font-family: var(--font-logo);
  color: var(--brand-strong);
  letter-spacing: 0;
  font-size: 0.9em;
}
.typing-chip {
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  gap: 0.06em;
  height: 0.8em;
  padding: 0 0.25em;
  margin: 0 0.05em;
  border-radius: 999px;
  background: var(--lilac);
}
.typing-chip i {
  width: 0.14em;
  height: 0.14em;
  border-radius: 50%;
  background: var(--purple);
  animation: blink 1.2s infinite;
}
.typing-chip i:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-chip i:nth-child(3) {
  animation-delay: 0.4s;
}
.lead {
  margin: 26px auto 32px;
  max-width: 600px;
  color: var(--muted);
  font-size: 1.15rem;
  line-height: 1.6;
}
.ctas {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ---------- bento ---------- */
.bento {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 210px;
  gap: 20px;
  padding: 40px 0 110px;
}
.tile {
  position: relative;
  border-radius: 28px;
  padding: 26px;
  overflow: hidden;
  background: var(--surface);
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s, opacity 0.7s ease;
}
.tile.reveal.is-visible:hover,
.tile:not(.reveal):hover {
  transform: translateY(-4px);
}
.tile h2 {
  position: relative;
  z-index: 1;
  margin: 0 0 6px;
  font-weight: 500;
  font-size: 1.25rem;
}
.tile p {
  position: relative;
  z-index: 1;
  margin: 0;
  max-width: 300px;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.55;
}
.t-live {
  grid-column: span 3;
  grid-row: span 2;
  background: var(--brand-gradient);
  color: #fff;
}
.t-live p {
  color: rgba(255, 255, 255, 0.88);
}
.t-live .dots {
  right: 24px;
  top: 24px;
  width: 120px;
  height: 90px;
}
.chatbox {
  position: absolute;
  left: 26px;
  right: 26px;
  bottom: 26px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 0.9rem;
}
.chatbox .b {
  max-width: 72%;
  padding: 8px 14px;
  border-radius: 14px;
  background: #fff;
  color: var(--ink);
  border-bottom-left-radius: 4px;
  align-self: flex-start;
  animation: chat-loop 9s infinite both;
}
.chatbox .b.out {
  align-self: flex-end;
  background: var(--purple);
  color: #fff;
  border-radius: 14px 14px 4px 14px;
}
.chatbox .b:nth-child(2) {
  animation-delay: 0.8s;
}
.chatbox .b:nth-child(3) {
  animation-delay: 1.6s;
}
.chatbox .b:nth-child(4) {
  animation-delay: 2.4s;
}
@keyframes chat-loop {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  8%,
  88% {
    opacity: 1;
    transform: none;
  }
  100% {
    opacity: 0;
  }
}
.t-code {
  grid-column: span 3;
  background: #fff;
  border: 2px solid var(--brand);
  box-shadow: 12px 12px 0 var(--brand-soft);
}
.code {
  position: absolute;
  right: 26px;
  bottom: 26px;
  display: flex;
  gap: 8px;
}
.code span {
  width: 42px;
  height: 52px;
  border-radius: 12px;
  border: 2px solid var(--border);
  display: grid;
  place-items: center;
  font-family: var(--font-number);
  font-size: 1.4rem;
  color: var(--brand-strong);
}
.code span.f,
.code span.c {
  border-color: var(--brand);
}
.code span.c::after {
  content: "";
  width: 2px;
  height: 24px;
  background: var(--brand-strong);
  animation: blink 1s infinite;
}
.t-push {
  grid-column: span 3;
  background: var(--purple);
  color: #fff;
}
.t-push p {
  color: rgba(255, 255, 255, 0.72);
}
.note {
  position: absolute;
  left: 22px;
  right: 22px;
  bottom: 22px;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  font-size: 0.82rem;
  animation: nudge 4s ease-in-out infinite;
}
.note b {
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: var(--brand-gradient);
  display: grid;
  place-items: center;
}
.note small {
  display: block;
  color: rgba(255, 255, 255, 0.65);
}
@keyframes nudge {
  0%,
  70%,
  100% {
    transform: none;
  }
  75% {
    transform: translateY(-4px);
  }
  80% {
    transform: none;
  }
}
.t-stats {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.nums {
  display: flex;
  gap: 28px;
}
.nums strong {
  display: block;
  font-family: var(--font-number);
  font-size: 3.4rem;
  line-height: 1;
  color: var(--brand-strong);
}
.nums span {
  font-size: 0.8rem;
  color: var(--muted);
}
.t-web {
  grid-column: span 2;
  background: var(--lilac);
}
.win {
  position: absolute;
  left: 26px;
  right: -30px;
  bottom: -30px;
  height: 90px;
  background: #fff;
  border-radius: 14px 14px 0 0;
  box-shadow: var(--shadow);
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.t-web:hover .win {
  transform: translateY(-8px);
}
.win::before {
  content: "";
  position: absolute;
  left: 14px;
  top: 12px;
  width: 44px;
  height: 10px;
  background: radial-gradient(circle, #f59e9a 4px, transparent 4.5px) 0 0 / 15px 10px repeat-x;
}
.win span {
  position: absolute;
  left: 70px;
  top: 9px;
  right: 50px;
  height: 16px;
  border-radius: 8px;
  background: var(--surface);
  font-size: 10px;
  line-height: 16px;
  color: var(--muted);
  padding-left: 10px;
}
.t-me {
  grid-column: span 2;
  background: #fff;
  border: 2px solid var(--brand);
}
.stack {
  position: absolute;
  right: 22px;
  bottom: 22px;
  display: flex;
}
.stack span {
  width: 52px;
  height: 52px;
  margin-left: -14px;
  border-radius: 50%;
  border: 3px solid #fff;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 600;
  transition: margin 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.t-me:hover .stack span {
  margin-left: -6px;
}
.stack span:nth-child(1) {
  background: var(--cyan);
}
.stack span:nth-child(2) {
  background: var(--brand-strong);
}
.stack span:nth-child(3) {
  background: var(--purple);
}
.stack span:nth-child(4) {
  background: var(--lilac);
  color: var(--purple);
}

/* ---------- títulos de seção ---------- */
.sec-title {
  margin: 0;
  font-weight: 400;
  font-size: clamp(1.75rem, 3.4vw, 2.75rem);
  color: var(--title);
  text-align: center;
}
.rule {
  width: 190px;
  height: 4px;
  border-radius: 4px;
  background: var(--brand);
  margin: 24px auto 64px;
}

/* ---------- 3 passos ---------- */
.steps-sec {
  background: var(--surface);
  padding: 110px 0;
}
.steps {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.steps::before {
  content: "";
  position: absolute;
  left: 16%;
  right: 16%;
  top: 32px;
  border-top: 2px dashed var(--brand);
}
.step {
  position: relative;
  text-align: center;
}
.num {
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  margin: 0 auto 22px;
  border-radius: 50%;
  background: var(--brand-gradient);
  color: #fff;
  font-family: var(--font-number);
  font-size: 1.6rem;
  box-shadow: 0 0 0 10px var(--surface);
}
.step h3 {
  margin: 0 0 8px;
  font-weight: 500;
  font-size: 1.25rem;
}
.step p {
  max-width: 300px;
  margin: 0 auto;
  color: var(--muted);
  line-height: 1.6;
}

/* ---------- dúvidas (acordeão com altura animada) ---------- */
.faq {
  padding: 110px 0;
}
.list {
  max-width: 760px;
  margin: 0 auto;
  display: grid;
  gap: 14px;
}
.qa {
  border: 2px solid var(--brand);
  border-radius: var(--radius);
  background: #fff;
  transition: box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.qa.open {
  box-shadow: 10px 10px 0 var(--brand-soft);
}
.qa h3 {
  margin: 0;
  font: inherit;
}
.qa button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  border: 0;
  background: none;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  border-radius: var(--radius);
}
.qa button:active {
  transform: none;
}
.plus {
  position: relative;
  flex: none;
  width: 16px;
  height: 16px;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.plus::before,
.plus::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 7px;
  height: 2px;
  border-radius: 2px;
  background: var(--brand-strong);
}
.plus::after {
  transform: rotate(90deg);
}
.open .plus {
  transform: rotate(45deg);
}
.answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.open .answer {
  grid-template-rows: 1fr;
}
.answer > div {
  overflow: hidden;
}
.answer p {
  margin: 0;
  padding: 0 24px 20px;
  color: var(--muted);
  line-height: 1.65;
  opacity: 0;
  transition: opacity 0.3s;
}
.open .answer p {
  opacity: 1;
  transition-delay: 0.1s;
}

/* ---------- CTA final ---------- */
.cta {
  position: relative;
  overflow: hidden;
  margin-bottom: 80px;
  padding: 70px 40px;
  border-radius: 40px;
  background: var(--brand-gradient);
  color: #fff;
  text-align: center;
}
.cta h2 {
  margin: 0;
  font-weight: 400;
  font-size: clamp(1.75rem, 4vw, 3.25rem);
}
.dot-p {
  color: var(--purple);
}
.cta p {
  margin: 14px 0 30px;
  opacity: 0.92;
}
.pill.light {
  background: #fff;
  border-color: #fff;
  color: var(--brand-strong);
}
.pill.light:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(57, 32, 84, 0.2);
}
.cta .d1 {
  left: 30px;
  top: 30px;
  width: 160px;
  height: 120px;
}
.cta .d2 {
  right: 30px;
  bottom: 30px;
  width: 160px;
  height: 120px;
}
.cta small {
  position: relative;
  display: block;
  margin-top: 22px;
  font-size: 0.82rem;
  opacity: 0.92;
}
.cta small img {
  display: inline-block;
  width: 28px;
  height: 28px;
  margin-right: 6px;
  border-radius: 50%;
  object-fit: cover;
  vertical-align: middle;
}
.cta small a {
  color: #fff;
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
  .bento {
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: 200px;
  }
  .t-live,
  .t-code,
  .t-push,
  .t-stats {
    grid-column: span 2;
  }
  .t-web,
  .t-me {
    grid-column: span 1;
  }
  .steps {
    grid-template-columns: 1fr;
    gap: 44px;
  }
  .steps::before {
    display: none;
  }
}
@media (max-width: 600px) {
  .bento {
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(200px, auto);
  }
  .tile {
    grid-column: auto !important;
  }
  .t-live {
    min-height: 420px;
  }
  .t-live .dots {
    display: none;
  }
  .code {
    position: static;
    margin-top: 18px;
  }
  .code span {
    width: 34px;
    height: 44px;
    font-size: 1.1rem;
  }
  .pill.big {
    padding: 14px 30px;
    font-size: 1.05rem;
  }
  .cta .dots {
    display: none;
  }
  .cta {
    border-radius: 28px;
    padding: 54px 22px;
  }
}
</style>
