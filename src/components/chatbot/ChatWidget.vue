<script setup>
import { nextTick, ref, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import ChatMessage from './ChatMessage.vue'

const store = useChatStore()
const input = ref('')
const listRef = ref(null)

async function send() {
  const q = input.value
  input.value = ''
  await store.send(q)
  await nextTick()
  listRef.value?.scrollTo({ top: listRef.value.scrollHeight, behavior: 'smooth' })
}

watch(
  () => store.isOpen,
  async (open) => {
    if (open) {
      await nextTick()
      listRef.value?.scrollTo({ top: listRef.value.scrollHeight })
    }
  }
)
</script>

<template>
  <!-- 펼친 상태: 대화창 (모바일에서는 전체 화면으로 표시) -->
  <div v-if="store.isOpen" class="chat-panel card">
    <header class="chat-header">
      <span>LocalHub 챗봇</span>
      <button class="close-btn" aria-label="닫기" @click="store.toggle">✕</button>
    </header>

    <div ref="listRef" class="chat-body">
      <ChatMessage v-for="(m, i) in store.messages" :key="i" :role="m.role" :content="m.content" />
      <p v-if="store.loading" class="loading">답변을 준비하고 있어요...</p>
    </div>

    <form class="chat-input" @submit.prevent="send">
      <input v-model="input" type="text" placeholder="메시지를 입력하세요" :disabled="store.loading" />
      <button class="btn btn-primary" type="submit" :disabled="store.loading || !input.trim()">전송</button>
    </form>
  </div>

  <!-- 접힌 상태: 플로팅 버튼 -->
  <button
    v-else
    class="fab"
    aria-label="챗봇 열기"
    @click="store.toggle"
  >
    💬
    <span class="fab-label">챗봇</span>
  </button>
</template>

<style scoped>
.fab {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-river);
  color: #fff;
  font-size: 22px;
  border: none;
  box-shadow: var(--shadow-1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
}
.fab-label {
  position: absolute;
  bottom: -18px;
  font-size: 10px;
  color: var(--color-river);
}

.chat-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 340px;
  height: 460px;
  display: flex;
  flex-direction: column;
  z-index: 40;
  overflow: hidden;
}
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-river);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}
.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
}
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}
.loading {
  font-size: 12px;
  color: var(--color-ink-soft);
}
.chat-input {
  display: flex;
  gap: 6px;
  padding: 10px;
  border-top: 1px solid var(--color-line);
}
.chat-input input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--color-line);
  border-radius: 8px;
  font-size: 13px;
}

@media (max-width: 480px) {
  /* 모바일에서는 전체 화면으로 표시 */
  .chat-panel {
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100dvh;
    border-radius: 0;
  }
}
</style>
