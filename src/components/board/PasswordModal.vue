<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '비밀번호 확인' },
})
const emit = defineEmits(['confirm', 'cancel'])

const password = ref('')
const error = ref('')

function confirm() {
  if (!password.value) {
    error.value = '비밀번호를 입력해주세요.'
    return
  }
  emit('confirm', password.value)
}
</script>

<template>
  <div class="overlay" @click.self="emit('cancel')">
    <div class="modal card" role="dialog" aria-modal="true" :aria-label="title">
      <h3>{{ title }}</h3>
      <div class="field">
        <input
          v-model="password"
          type="password"
          placeholder="비밀번호 입력"
          autofocus
          @keyup.enter="confirm"
        />
      </div>
      <p v-if="error" class="error-text">{{ error }}</p>
      <div class="actions">
        <button class="btn btn-primary" @click="confirm">확인</button>
        <button class="btn btn-ghost" @click="emit('cancel')">취소</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(34, 40, 43, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.modal {
  width: 320px;
  padding: 24px;
}
.modal h3 {
  font-size: 16px;
  margin-bottom: 14px;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.actions .btn {
  flex: 1;
}
.error-text {
  color: var(--color-bad);
  font-size: 12px;
  margin: 4px 0 0;
}
</style>
