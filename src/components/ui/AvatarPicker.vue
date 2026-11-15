<script setup lang="ts">
import { ref } from "vue";
import { usersApi } from "@/api";
import type { Me } from "@/api/types";
import UserAvatar from "./UserAvatar.vue";

const props = defineProps<{ name: string; src: string }>();
const emit = defineEmits<{ updated: [me: Me] }>();
const busy = ref(false);
const error = ref("");
const input = ref<HTMLInputElement | null>(null);
const preview = ref("");

async function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  error.value = "";
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return void (error.value = "Use uma imagem JPG, PNG ou WebP.");
  if (file.size > 2 * 1024 * 1024) return void (error.value = "A imagem precisa ter até 2 MB.");
  preview.value = URL.createObjectURL(file);
  busy.value = true;
  try {
    emit("updated", await usersApi.uploadAvatar(file));
  } catch (err) {
    error.value = (err as Error).message === "Upload unavailable" ? "Upload de foto indisponível no momento." : (err as Error).message;
    preview.value = "";
  } finally {
    busy.value = false;
    if (input.value) input.value.value = "";
  }
}
</script>

<template>
  <div class="picker">
    <img v-if="preview" class="preview" :src="preview" alt="" />
    <UserAvatar v-else :name="props.name" :src="props.src" :size="96" />
    <label class="btn btn-ghost">
      {{ busy ? "Enviando…" : "Escolher foto" }}
      <input ref="input" class="sr-only" type="file" accept="image/jpeg,image/png,image/webp" :disabled="busy" @change="onFile" />
    </label>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.picker {
  display: grid;
  justify-items: center;
  gap: 10px;
}
.preview {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
}
label.btn:focus-within {
  outline: 3px solid var(--brand-strong);
}
</style>
