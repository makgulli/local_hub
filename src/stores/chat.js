import { defineStore } from 'pinia'
import { askChatbot } from '@/services/chatService'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    '안녕하세요! LocalHub 챗봇입니다 😊\n구미/경북의 관광지, 맛집, 축제 정보를 물어보세요.',
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    isOpen: false,
    messages: [WELCOME_MESSAGE],
    loading: false,
    error: null,
  }),
  actions: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    async send(question) {
      if (!question?.trim()) return
      this.error = null
      this.messages.push({ role: 'user', content: question })
      this.loading = true
      try {
        // 대화 히스토리 유지: 직전 메시지들을 함께 전달
        const history = this.messages
          .filter((m) => m !== WELCOME_MESSAGE)
          .slice(0, -1)
        const answer = await askChatbot(question, history)
        this.messages.push({ role: 'assistant', content: answer })
      } catch (e) {
        this.error = e.message
        this.messages.push({
          role: 'assistant',
          content: `죄송해요, 답변 생성 중 문제가 발생했어요. (${e.message})`,
        })
      } finally {
        this.loading = false
      }
    },
    reset() {
      this.messages = [WELCOME_MESSAGE]
      this.error = null
    },
  },
})
