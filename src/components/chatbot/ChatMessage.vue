<script setup>
defineProps({
  role: { type: String, required: true }, // 'user' | 'assistant'
  content: { type: String, required: true },
})
</script>

<template>
  <div class="msg-row" :class="role">
    <p class="bubble">{{ content }}</p>
  </div>
</template>

<style scoped>
.msg-row {
  display: flex;
  margin-bottom: 10px;
}
.msg-row.user {
  justify-content: flex-end;
}
.bubble {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 13px;
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.5;
}
.msg-row.assistant .bubble {
  background: var(--color-paper-dim);
  color: var(--color-ink);
  border-bottom-left-radius: 4px;
}
.msg-row.user .bubble {
  background: var(--color-river);
  color: #fff;
  border-bottom-right-radius: 4px;
}
</style>
