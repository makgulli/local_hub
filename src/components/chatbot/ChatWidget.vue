<script setup>
import { nextTick, ref, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import ChatMessage from './ChatMessage.vue'

const store = useChatStore()
const input = ref('')
const inputRef = ref(null)
const chatScrollContainer = ref(null)

function scrollToBottom() {
  const el = chatScrollContainer.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

function focusInput() {
  nextTick(() => {
    inputRef.value?.focus()
  })
}

async function sendChatMessage() {
  const q = input.value
  if (!q.trim() || store.loading) return

  input.value = ''
  await nextTick()
  scrollToBottom()

  await store.send(q)

  await nextTick()
  scrollToBottom()
  focusInput()
}

watch(
  () => store.isOpen,
  async (open) => {
    if (open) {
      await nextTick()
      scrollToBottom()
      focusInput()
    }
  }
)

watch(
  () => store.messages.length,
  async () => {
    await nextTick()
    scrollToBottom()
  }
)
</script>

<template>
  <div class="fixed bottom-6 right-6 z-40 flex flex-col items-end">
    <!-- Floating Bubble Toggle Button -->
    <button
      v-if="!store.isOpen"
      @click="store.toggle"
      class="bg-[#FF6467] hover:bg-[#E53B47] text-white p-4.5 rounded-full shadow-2xl shadow-[#FF6467]/30 transition-all hover:scale-105 flex items-center justify-center w-14 h-14 relative group"
      aria-label="AI 가이드 호출"
    >
      <i class="fa-solid fa-robot text-lg"></i>
      <span class="absolute right-16 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow duration-200">
        AI 가이드 호출
      </span>
    </button>

    <!-- Expanded AI Chatbot Window -->
    <div
      v-else
      class="bg-white shadow-2xl border border-slate-200 rounded-3xl w-[360px] sm:w-[420px] h-[550px] max-h-[85vh] flex flex-col fixed bottom-0 right-0 sm:bottom-6 sm:right-6 overflow-hidden transition-all duration-300"
      :class="{ 'w-full h-full max-h-none bottom-0 right-0 rounded-none z-50': store.isFullscreen }"
    >
      <!-- Chat Window Header -->
      <div class="bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 text-white px-5 py-4 flex justify-between items-center shadow-md border-b border-white/10">
        <div class="flex items-center space-x-3">
          <div class="bg-white/10 p-2 rounded-xl text-white">
            <i class="fa-solid fa-robot"></i>
          </div>
          <div>
            <h4 class="font-bold text-xs sm:text-sm">LocalHub 구미·경북 도우미</h4>
            <p class="text-[10px] text-slate-300">제공 데이터 기반 실시간 어시스턴트</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button @click="store.toggleFullscreen" class="text-slate-300 hover:text-white text-xs hidden sm:block" aria-label="화면 크기 전환">
            <i :class="store.isFullscreen ? 'fa-solid fa-minimize' : 'fa-solid fa-maximize'"></i>
          </button>
          <button @click="store.toggle" class="text-slate-300 hover:text-white text-lg font-bold" aria-label="닫기">×</button>
        </div>
      </div>

      <!-- Chat History Area -->
      <div ref="chatScrollContainer" class="flex-grow p-4 overflow-y-auto space-y-3 bg-slate-50">
        <ChatMessage v-for="(m, i) in store.messages" :key="i" :role="m.role" :content="m.content" />

        <div v-if="store.loading" class="flex justify-start">
          <div class="bg-white border border-slate-200/60 p-3 rounded-2xl text-xs rounded-bl-none flex items-center space-x-1.5 shadow-sm text-slate-400">
            <span class="animate-bounce">●</span>
            <span class="animate-bounce" style="animation-delay: 0.2s">●</span>
            <span class="animate-bounce" style="animation-delay: 0.4s">●</span>
          </div>
        </div>
      </div>

      <!-- Chatbot Input Form -->
      <form @submit.prevent="sendChatMessage" class="p-3 border-t border-slate-200/80 bg-white flex items-center gap-2">
        <input
  ref="inputRef"
  v-model="input"
  type="text"
  placeholder="예: 구미 금오산 근처 맛집 추천해줘"
  :disabled="store.loading"
  class="flex-grow border border-slate-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#FF6467]/20 focus:border-[#FF6467] transition-all"
/>
        <button
          type="submit"
          :disabled="store.loading || !input.trim()"
          class="bg-[#FF6467] hover:bg-[#E53B47] disabled:bg-slate-300 text-white p-2.5 rounded-2xl transition-colors flex items-center justify-center"
        >
          <i class="fa-solid fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>
  </div>
</template>
