<script setup lang="ts">
/**
 * Ilustração do hero (celular, balões e aviões de papel), montada com as
 * peças vetoriais exportadas do Figma ("Home", nó 1:976). As posições
 * foram convertidas do frame 1920×1080 para a caixa da ilustração, então
 * ela escala inteira mantendo a proporção.
 */
import a0 from "@/assets/landing/hero/84801.svg";
import a1 from "@/assets/landing/hero/242f9.svg";
import a2 from "@/assets/landing/hero/93616.svg";
import a3 from "@/assets/landing/hero/5bdcf.svg";
import a4 from "@/assets/landing/hero/3a7b4.svg";
import a5 from "@/assets/landing/hero/f984c.svg";
import a6 from "@/assets/landing/hero/e49dd.svg";
import a7 from "@/assets/landing/hero/f3bb8.svg";
import a8 from "@/assets/landing/hero/90cbd.svg";
import a9 from "@/assets/landing/hero/0e9c2.svg";
import a10 from "@/assets/landing/hero/972ac.svg";
import a11 from "@/assets/landing/hero/f2c50.svg";
import a12 from "@/assets/landing/hero/d86a5.svg";
import a13 from "@/assets/landing/hero/9dc7b.svg";
import a14 from "@/assets/landing/hero/f8bfc.svg";
import a15 from "@/assets/landing/hero/82ce7.svg";
import a16 from "@/assets/landing/hero/e0e00.svg";
import a17 from "@/assets/landing/hero/00f52.svg";
import a18 from "@/assets/landing/hero/d729e.svg";
import a19 from "@/assets/landing/hero/7502c.svg";
import a20 from "@/assets/landing/hero/c233c.svg";
import a21 from "@/assets/landing/hero/62458.svg";
import a22 from "@/assets/landing/hero/063e3.svg";
import a23 from "@/assets/landing/hero/307f8.svg";
import a24 from "@/assets/landing/hero/9e151.svg";
import a25 from "@/assets/landing/hero/30209.svg";
import a26 from "@/assets/landing/hero/7356c.svg";
import a27 from "@/assets/landing/hero/b9681.svg";
import a28 from "@/assets/landing/hero/9e032.svg";
import a29 from "@/assets/landing/hero/33dae.svg";
import a30 from "@/assets/landing/hero/61ec7.svg";
import a31 from "@/assets/landing/hero/c6706.svg";
import a32 from "@/assets/landing/hero/08830.svg";
import a33 from "@/assets/landing/hero/341e6.svg";
import a34 from "@/assets/landing/hero/9a696.svg";
import a35 from "@/assets/landing/hero/b1ffd.svg";
import a36 from "@/assets/landing/hero/0266a.svg";
import a37 from "@/assets/landing/hero/cec1a.svg";
import a38 from "@/assets/landing/hero/6970d.svg";
import a39 from "@/assets/landing/hero/9971e.svg";
import a40 from "@/assets/landing/hero/27167.svg";
import a41 from "@/assets/landing/hero/206b4.svg";
import a42 from "@/assets/landing/hero/c80a3.svg";
import a43 from "@/assets/landing/hero/90a67.svg";
import a44 from "@/assets/landing/hero/50b85.svg";
import a45 from "@/assets/landing/hero/1eecf.svg";
import a46 from "@/assets/landing/hero/5fd84.svg";
import a47 from "@/assets/landing/hero/f9765.svg";
import a48 from "@/assets/landing/hero/28bd3.svg";
import a49 from "@/assets/landing/hero/7a223.svg";
import a50 from "@/assets/landing/hero/8527d.svg";

type Piece = { src: string; inset: string; blend?: boolean; rotate?: { width: string; height: string; transform: string } };

const pieces: Piece[] = [
  { src: a0, inset: "12.424% 0.000% 75.151% 85.613%", rotate: { width: "hypot(90.53cqw, 32.3282cqh)", height: "hypot(-9.47001cqw, 67.6718cqh)", transform: "rotate(12.6deg)" } },
  { src: a1, inset: "17.776% 13.387% 81.581% 85.638%" },
  { src: a2, inset: "19.440% 15.752% 51.967% 77.323%" },
  { src: a3, inset: "48.752% 24.238% 50.492% 74.787%" },
  { src: a4, inset: "0.359% 51.378% 77.477% 29.968%" },
  { src: a5, inset: "0.000% 51.378% 77.477% 29.968%" },
  { src: a6, inset: "14.486% 55.109% 77.194% 27.993%" },
  { src: a7, inset: "16.679% 55.109% 77.194% 27.993%" },
  { src: a8, inset: "9.455% 26.116% 3.650% 39.283%" },
  { src: a9, inset: "63.654% 39.332% 0.000% 37.284%", blend: true },
  { src: a10, inset: "16.358% 27.896% 10.552% 41.063%" },
  { src: a11, inset: "13.143% 36.747% 85.949% 49.963%" },
  { src: a12, inset: "90.866% 41.917% 4.917% 55.035%" },
  { src: a13, inset: "92.095% 42.794% 6.146% 55.938%" },
  { src: a14, inset: "85.117% 27.896% 10.552% 41.063%" },
  { src: a15, inset: "16.358% 27.896% 79.766% 41.063%" },
  { src: a16, inset: "67.946% 58.742% 30.957% 40.015%" },
  { src: a17, inset: "29.425% 23.092% 45.045% 44.843%", blend: true },
  { src: a18, inset: "25.038% 21.726% 49.414% 46.208%" },
  { src: a19, inset: "27.723% 42.477% 56.411% 46.013%", rotate: { width: "hypot(63.8474cqw, -36.1526cqh)", height: "hypot(36.1526cqw, 63.8474cqh)", transform: "rotate(-29.52deg)" } },
  { src: a20, inset: "38.597% 47.574% 59.701% 51.183%" },
  { src: a21, inset: "38.597% 47.574% 60.306% 51.183%" },
  { src: a22, inset: "32.564% 45.355% 60.590% 48.891%" },
  { src: a23, inset: "31.014% 45.940% 64.448% 49.208%" },
  { src: a24, inset: "37.538% 47.427% 61.857% 51.183%" },
  { src: a25, inset: "29.784% 25.750% 69.194% 57.449%" },
  { src: a26, inset: "32.451% 38.576% 66.528% 57.449%" },
  { src: a27, inset: "32.451% 25.725% 66.528% 62.911%" },
  { src: a28, inset: "35.136% 33.870% 63.862% 57.449%" },
  { src: a29, inset: "35.136% 25.725% 63.862% 67.398%" },
  { src: a30, inset: "37.803% 25.750% 61.195% 57.449%" },
  { src: a31, inset: "59.663% 33.114% 15.753% 36.552%", blend: true },
  { src: a32, inset: "55.673% 34.236% 19.724% 35.430%" },
  { src: a33, inset: "58.056% 53.255% 26.721% 35.699%", rotate: { width: "hypot(29.2893cqw, -70.7107cqh)", height: "hypot(70.7107cqw, 29.2893cqh)", transform: "rotate(-67.5deg)" } },
  { src: a34, inset: "61.706% 56.401% 34.172% 38.942%" },
  { src: a35, inset: "68.608% 58.108% 29.690% 40.649%" },
  { src: a36, inset: "62.576% 55.889% 30.579% 38.356%" },
  { src: a37, inset: "67.530% 57.961% 31.846% 40.649%" },
  { src: a38, inset: "62.027% 57.157% 34.436% 38.942%" },
  { src: a39, inset: "60.098% 59.254% 37.311% 37.674%" },
  { src: a40, inset: "61.744% 59.108% 37.557% 39.698%" },
  { src: a41, inset: "60.647% 48.061% 38.332% 46.281%" },
  { src: a42, inset: "63.313% 49.890% 35.666% 46.281%" },
  { src: a43, inset: "63.313% 44.526% 35.666% 50.768%" },
  { src: a44, inset: "63.313% 37.527% 35.666% 56.133%" },
  { src: a45, inset: "60.647% 37.527% 38.332% 52.865%" },
  { src: a46, inset: "68.551% 37.527% 30.427% 46.281%" },
  { src: a47, inset: "65.998% 45.355% 32.999% 46.281%" },
  { src: a48, inset: "65.998% 37.527% 32.999% 55.864%" },
  { src: a49, inset: "30.635% 67.252% 39.315% 15.752%" },
  { src: a50, inset: "22.750% 80.614% 50.454% 0.000%", rotate: { width: "hypot(51.8793cqw, -46.2678cqh)", height: "hypot(48.1207cqw, 53.7322cqh)", transform: "rotate(-41.79deg)" } },
];
</script>

<template>
  <div class="hero-illustration" aria-hidden="true">
    <template v-for="(p, i) in pieces" :key="i">
      <div v-if="p.rotate" class="piece rotated" :style="{ inset: p.inset }">
        <div class="rot" :style="p.rotate">
          <img :src="p.src" alt="" />
        </div>
      </div>
      <div v-else class="piece" :class="{ blend: p.blend }" :style="{ inset: p.inset }">
        <img :src="p.src" alt="" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.hero-illustration {
  position: relative;
  width: 100%;
  aspect-ratio: 787.39 / 571.10;
}
.piece {
  position: absolute;
}
.piece img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  max-width: none;
}
.blend {
  mix-blend-mode: multiply;
}
.rotated {
  display: flex;
  align-items: center;
  justify-content: center;
  container-type: size;
}
.rot {
  position: relative;
  flex: none;
}
</style>
