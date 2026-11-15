<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import linksIcons from "@/assets/landing/about/links.svg";
import pedro from "@/assets/landing/about/pedro.png";
import underline from "@/assets/landing/phone/5a5ac.svg";
import cardBg from "@/assets/landing/phone/43a84.svg";
import dotsA from "@/assets/landing/phone/d2be1.svg";
import dotsB from "@/assets/landing/phone/0633b.svg";
import { publicApi } from "@/api";
import { tokenStore } from "@/api/http";
import HeroIllustration from "@/components/landing/HeroIllustration.vue";
import PhoneMockup from "@/components/landing/PhoneMockup.vue";
import SectionDots from "@/components/landing/SectionDots.vue";
import SiteHeader from "@/components/landing/SiteHeader.vue";
import SocialRail from "@/components/landing/SocialRail.vue";
import { useI18n } from "@/lib/i18n";

/**
 * Landing do Figma "The Chat - Portfólio": três telas 1920×1080
 * (Home 1:976, Home 1:1073, Section 3 1:1247). No desktop cada seção é
 * um quadro na proporção do Figma (1px = var(--u)); no celular empilha.
 */
const { t, lang } = useI18n();
const sections = ["inicio", "introducao", "contato"];
const active = ref("inicio");
const stats = ref<{ users: number; messages: number } | null>(null);
const cta = tokenStore.get() ? "/chats" : "/entrar";
const fmt = (n: number) => n.toLocaleString(lang.value === "pt" ? "pt-BR" : "en-US");

let observer: IntersectionObserver | null = null;
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) active.value = e.target.id;
    },
    { threshold: 0.55 },
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

const aboutLinks = [
  { label: "GitHub", href: "https://github.com/Pedrolopesh" },
  { label: "Portfólio", href: "https://www.pedrolopes.tech" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/pedro-l-50b3b818a/" },
];
</script>

<template>
  <div class="landing">
    <SiteHeader :active="active" />
    <SocialRail />
    <SectionDots :sections="sections" :active="active" />

    <main>
      <!-- 1. Hero (Figma 1:976) -->
      <section id="inicio" class="frame hero">
        <div class="hero-copy">
          <h1>
            <span>{{ t("hero_1") }}</span>
            <span>{{ t("hero_2") }}<span class="dot">.</span></span>
          </h1>
          <RouterLink class="hero-cta" :to="cta">{{ t("hero_cta") }}</RouterLink>
        </div>
        <div class="hero-art"><HeroIllustration /></div>
      </section>

      <!-- 2. Introdução (Figma 1:1073) -->
      <section id="introducao" class="frame intro">
        <div class="intro-copy">
          <h2>{{ t("intro_title") }}<span class="dot">.</span></h2>
          <img class="underline" :src="underline" alt="" />
          <div class="cards">
            <article class="stat stat-a">
              <img class="dots" :src="dotsA" alt="" />
              <strong>{{ stats ? fmt(stats.users) : "—" }}</strong>
              <p>{{ t("stat_users") }}</p>
            </article>
            <article class="stat stat-b">
              <img class="bg" :src="cardBg" alt="" />
              <img class="dots" :src="dotsB" alt="" />
              <strong>{{ stats ? fmt(stats.messages) : "—" }}</strong>
              <p>{{ t("stat_messages") }}</p>
            </article>
          </div>
        </div>
        <div class="intro-phone"><PhoneMockup /></div>
      </section>

      <!-- 3. Sobre o autor (Figma 1:1247, variante da esquerda) -->
      <section id="contato" class="frame about">
        <div class="about-box">
          <img class="about-photo" :src="pedro" :alt="t('about_photo')" width="315" height="420" loading="lazy" />
          <div class="about-card">
            <p>{{ t("about_text") }}</p>
          </div>
          <div class="about-links">
            <img :src="linksIcons" alt="" />
            <a v-for="l in aboutLinks" :key="l.label" :href="l.href" target="_blank" rel="noopener noreferrer" :aria-label="l.label"></a>
          </div>
        </div>
      </section>
    </main>

    <footer class="footer">
      <span>{{ t("footer") }} · <a href="https://www.pedrolopes.tech" target="_blank" rel="noopener noreferrer">pedrolopes.tech</a></span>
    </footer>
  </div>
</template>

<style scoped>
.landing :deep(.site-header) {
  position: fixed;
  inset: 0 0 auto 0;
}
.frame {
  position: relative;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  height: calc(1080 * var(--u));
  min-height: 560px;
  scroll-margin-top: 0;
}
.frame > * {
  position: absolute;
}
.dot {
  color: var(--brand);
}

/* ---------- hero ---------- */
.hero-copy {
  left: calc(228 * var(--u));
  top: calc(335 * var(--u));
}
.hero h1 {
  margin: 0;
  display: grid;
  font-weight: 400;
  font-size: calc(70 * var(--u));
  line-height: calc(80 * var(--u));
  letter-spacing: 0.3px;
  color: var(--title);
}
.hero-cta {
  /* Figma: título em y=335 (2 linhas de 80) e botão em y=573 */
  margin-top: calc(78 * var(--u));
  width: calc(335 * var(--u));
  height: calc(91 * var(--u));
  display: grid;
  place-items: center;
  border: calc(4 * var(--u)) solid var(--brand);
  border-radius: calc(45 * var(--u));
  font-size: calc(30 * var(--u));
  color: var(--brand);
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}
.hero-cta:hover {
  background: var(--brand);
  color: #fff;
}
.hero-art {
  left: calc(970.9 * var(--u));
  top: calc(273 * var(--u));
  width: calc(787.4 * var(--u));
}

/* ---------- introdução ---------- */
.intro-copy {
  inset: 0;
}
.intro-copy > * {
  position: absolute;
}
.intro h2 {
  left: calc(181 * var(--u));
  top: calc(240 * var(--u));
  width: calc(560 * var(--u));
  margin: 0;
  font-weight: 400;
  font-size: calc(40 * var(--u));
  line-height: calc(55 * var(--u));
  letter-spacing: 0.3px;
  color: var(--ink-strong);
}
.underline {
  left: calc(177.5 * var(--u));
  top: calc(480 * var(--u));
  width: calc(311 * var(--u));
  height: calc(6 * var(--u));
}
.cards {
  left: calc(162 * var(--u));
  top: calc(523 * var(--u));
  width: calc(709 * var(--u));
  height: calc(271 * var(--u));
}
.stat {
  position: absolute;
  top: 0;
  width: calc(350 * var(--u));
  height: calc(270 * var(--u));
  color: #fff;
  font-family: var(--font-number);
}
.stat-a {
  left: 0;
  border: calc(8 * var(--u)) solid var(--line);
  border-radius: calc(20 * var(--u));
  background: var(--brand-gradient);
  box-shadow: calc(-40 * var(--u)) calc(40 * var(--u)) calc(50 * var(--u)) rgba(85, 85, 85, 0.14);
}
.stat-b {
  left: calc(359 * var(--u));
  top: calc(1 * var(--u));
}
.stat-b .bg {
  position: absolute;
  top: -3.7%;
  right: -2.86%;
  bottom: -33.33%;
  left: -25.71%;
  width: auto;
  height: auto;
  max-width: none;
}
.stat .dots {
  position: absolute;
  width: calc(61 * var(--u));
  height: calc(61 * var(--u));
  transform: rotate(-90deg);
}
.stat-a .dots {
  left: calc(260 * var(--u));
  top: calc(12 * var(--u));
}
.stat-b .dots {
  left: calc(268 * var(--u));
  top: calc(20 * var(--u));
}
.stat strong {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(34 * var(--u));
  font-size: calc(90 * var(--u));
  line-height: calc(100 * var(--u));
  font-weight: 700;
}
.stat-a strong {
  left: calc(32 * var(--u));
  top: calc(26 * var(--u));
}
.stat p {
  position: absolute;
  left: calc(40 * var(--u));
  top: calc(148 * var(--u));
  width: calc(270 * var(--u));
  margin: 0;
  font-size: calc(14 * var(--u));
  line-height: calc(22 * var(--u));
  letter-spacing: -0.3px;
}
.stat-a p {
  left: calc(32 * var(--u));
  top: calc(150 * var(--u));
}
.intro-phone {
  left: calc(1201 * var(--u));
  top: calc(145 * var(--u));
  width: calc(433.3 * var(--u));
}

/* ---------- sobre ---------- */
.about-box {
  /* só a variante da esquerda do Figma, centralizada no quadro */
  left: calc((1920 - 566) / 2 * var(--u));
  top: calc(218 * var(--u));
  width: calc(566 * var(--u));
  height: calc(699 * var(--u));
}
.about-box > * {
  position: absolute;
}
.about-photo {
  left: 0;
  top: 0;
  width: calc(315 * var(--u));
  height: calc(420 * var(--u));
  border-radius: var(--radius);
  object-fit: cover;
}
.about-card {
  left: calc(203 * var(--u));
  top: calc(110 * var(--u));
  width: calc(315 * var(--u));
  height: calc(420 * var(--u));
  border: calc(4 * var(--u)) solid var(--brand);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: calc(-12 * var(--u)) calc(-12 * var(--u)) 0 0 var(--brand);
}
.about-card p {
  margin: 0;
  padding: calc(17 * var(--u)) calc(17 * var(--u)) 0;
  font-size: calc(25 * var(--u));
  color: #000;
}
.about-links {
  left: calc(56.15 * var(--u));
  top: calc(579 * var(--u));
  width: calc(362.85 * var(--u));
  height: calc(120 * var(--u));
  border: calc(4 * var(--u)) solid var(--brand);
  border-radius: var(--radius);
  background: #fff;
  box-shadow: calc(-10.15 * var(--u)) calc(-10 * var(--u)) 0 0 var(--brand);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 0 calc(29.85 * var(--u)) 0 calc(29.85 * var(--u));
}
.about-links img {
  position: absolute;
  left: calc(29.85 * var(--u));
  top: calc(22 * var(--u));
  width: calc(296 * var(--u));
  height: calc(67.7 * var(--u));
  pointer-events: none;
}
.about-links a {
  border-radius: 10px;
}
.about-links a:hover {
  background: rgba(238, 149, 145, 0.12);
}

.footer {
  padding: 2rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--muted);
}

/* ---------- celular ---------- */
@media (max-width: 900px) {
  .frame {
    height: auto;
    min-height: 0;
    padding: 96px 22px 56px;
    display: grid;
    gap: 36px;
  }
  .frame > *,
  .intro-copy > *,
  .about-box > * {
    position: static;
  }
  .hero h1 {
    font-size: 38px;
    line-height: 46px;
  }
  .hero-cta {
    width: 200px;
    height: 56px;
    margin-top: 28px;
    border-width: 3px;
    border-radius: 999px;
    font-size: 19px;
  }
  .hero-art {
    width: 100%;
  }
  .intro {
    padding-top: 40px;
  }
  .intro-copy {
    display: grid;
    gap: 20px;
  }
  .intro h2 {
    width: auto;
    font-size: 28px;
    line-height: 38px;
  }
  .underline {
    width: 160px;
    height: 4px;
  }
  .cards {
    position: static;
    width: auto;
    height: auto;
    display: grid;
    gap: 18px;
  }
  .stat,
  .stat-b {
    position: relative;
    left: 0;
    top: 0;
    width: 100%;
    height: auto;
    min-height: 190px;
    padding: 20px 24px;
    border-radius: 20px;
    overflow: hidden;
  }
  .stat-a {
    border-width: 6px;
    box-shadow: var(--shadow);
  }
  .stat-b {
    border: 6px solid var(--line);
    background: var(--brand-gradient);
    box-shadow: var(--shadow);
  }
  .stat-b .bg {
    display: none;
  }
  .stat .dots {
    left: auto !important;
    right: 14px;
    top: 14px !important;
    width: 50px;
    height: 50px;
  }
  .stat strong,
  .stat p {
    position: static;
    width: auto;
  }
  .stat strong {
    display: block;
    font-size: 60px;
    line-height: 72px;
  }
  .stat p {
    margin-top: 8px;
    font-size: 14px;
    line-height: 21px;
  }
  .intro-phone {
    width: min(320px, 82vw);
    justify-self: center;
  }
  .about-box {
    width: auto;
    height: auto;
    display: grid;
    gap: 28px;
    justify-items: center;
  }
  .about-photo {
    width: min(300px, 80vw);
    height: auto;
    aspect-ratio: 3 / 4;
  }
  .about-card,
  .about-links {
    width: min(340px, 86vw);
    height: auto;
    border-width: 3px;
    box-shadow: -10px -10px 0 0 var(--brand);
  }
  .about-card p {
    padding: 18px;
    font-size: 18px;
  }
  .about-links {
    height: 96px;
    padding: 0 22px;
    position: relative;
  }
  .about-links img {
    position: absolute;
    left: 22px;
    right: 22px;
    top: 50%;
    transform: translateY(-50%);
    width: calc(100% - 44px);
    height: auto;
  }
}
</style>
