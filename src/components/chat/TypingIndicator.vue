<script setup lang="ts">
defineProps<{
  /** Nome do usuário que está digitando */
  name: string;
  /** Se true, usa o estilo especial de agente IA (pulsação + gradiente) */
  isAgent?: boolean;
}>();
</script>

<template>
  <div class="typing" :class="{ agent: isAgent }" role="status" :aria-label="`${name} está digitando`">
    <span class="dots">
      <span></span>
      <span></span>
      <span></span>
    </span>
    <span class="label">{{ name }} está digitando<span v-if="isAgent" class="ai-tag">✨</span></span>
  </div>
</template>

<style scoped>
.typing {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px 6px;
  margin-top: 4px;
  align-self: flex-start;
  animation: fade-in 0.3s ease both;
}

.dots {
  display: flex;
  gap: 4px;
}

.dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--muted);
  animation: bounce 1.4s infinite ease-in-out both;
}

.dots span:nth-child(1) { animation-delay: -0.32s; }
.dots span:nth-child(2) { animation-delay: -0.16s; }
.dots span:nth-child(3) { animation-delay: 0s; }

.label {
  font-size: 0.78rem;
  color: var(--muted);
  letter-spacing: 0.01em;
}

/* ── Agente IA: efeito distinto ── */
.agent .dots span {
  background: var(--brand-strong, #ee7c83);
  box-shadow: 0 0 6px rgba(238, 124, 131, 0.5);
  animation: ai-pulse 1.8s infinite ease-in-out both;
}

.agent .label {
  color: var(--brand-strong, #ee7c83);
  font-weight: 500;
}

.ai-tag {
  display: inline-block;
  margin-left: 4px;
  animation: sparkle 2s infinite ease-in-out;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

@keyframes ai-pulse {
  0%, 100% {
    transform: scale(0.7);
    opacity: 0.5;
    box-shadow: 0 0 4px rgba(238, 124, 131, 0.3);
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
    box-shadow: 0 0 12px rgba(238, 124, 131, 0.7), 0 0 20px rgba(168, 85, 247, 0.3);
  }
}

@keyframes sparkle {
  0%, 100% { opacity: 0.6; transform: scale(0.9) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(15deg); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>