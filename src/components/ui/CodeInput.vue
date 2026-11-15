<script setup lang="ts">
import { nextTick, ref } from "vue";

/** 6 caixas para o código; aceita colar o código inteiro. */
const model = defineModel<string>({ required: true });
const emit = defineEmits<{ complete: [code: string] }>();
defineProps<{ disabled?: boolean }>();
const boxes = ref<HTMLInputElement[]>([]);

function setDigits(digits: string, from = 0) {
  const arr = model.value.padEnd(6, " ").split("");
  for (let i = 0; i < digits.length && from + i < 6; i++) arr[from + i] = digits[i]!;
  // o defineModel só reflete o valor novo depois do pai atualizar: usa o local
  const value = arr.join("").replace(/\s+$/, "");
  model.value = value;
  const next = Math.min(from + digits.length, 5);
  void nextTick(() => boxes.value[next]?.focus());
  if (/^\d{6}$/.test(value)) emit("complete", value);
}

function onInput(i: number, e: Event) {
  const el = e.target as HTMLInputElement;
  const digits = el.value.replace(/\D/g, "");
  el.value = model.value[i]?.trim() ?? "";
  if (digits) setDigits(digits, i);
}

function onKey(i: number, e: KeyboardEvent) {
  if (e.key === "Backspace") {
    e.preventDefault();
    const arr = model.value.padEnd(6, " ").split("");
    const at = arr[i]?.trim() ? i : Math.max(0, i - 1);
    arr[at] = " ";
    model.value = arr.join("").replace(/\s+$/, "");
    boxes.value[at]?.focus();
  } else if (e.key === "ArrowLeft") boxes.value[i - 1]?.focus();
  else if (e.key === "ArrowRight") boxes.value[i + 1]?.focus();
}

function onPaste(e: ClipboardEvent) {
  const digits = (e.clipboardData?.getData("text") ?? "").replace(/\D/g, "").slice(0, 6);
  if (digits) {
    e.preventDefault();
    setDigits(digits, 0);
  }
}
</script>

<template>
  <div class="code-input" role="group" aria-label="Código de 6 dígitos" @paste="onPaste">
    <input
      v-for="i in 6"
      :key="i"
      :ref="(el) => (boxes[i - 1] = el as HTMLInputElement)"
      :value="model[i - 1]?.trim() ?? ''"
      :aria-label="`Dígito ${i}`"
      :autocomplete="i === 1 ? 'one-time-code' : 'off'"
      inputmode="numeric"
      maxlength="6"
      :disabled="disabled"
      @input="onInput(i - 1, $event)"
      @keydown="onKey(i - 1, $event)"
      @focus="($event.target as HTMLInputElement).select()"
    />
  </div>
</template>

<style scoped>
.code-input {
  display: flex;
  justify-content: center;
  gap: 8px;
}
input {
  width: 48px;
  height: 58px;
  border: 2px solid var(--border);
  border-radius: 12px;
  text-align: center;
  font-size: 1.5rem;
  font-family: var(--font-number);
  outline: none;
}
input:focus {
  border-color: var(--brand);
}
@media (max-width: 400px) {
  input {
    width: 40px;
    height: 50px;
  }
}
</style>
