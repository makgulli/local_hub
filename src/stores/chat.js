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
    isFullscreen: false,
    messages: [WELCOME_MESSAGE],
    loading: false,
    error: null,
  }),
  actions: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    open() {
      this.isOpen = true
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen
    },
    /** 홈 화면 명소 카드의 "AI에 질문" 버튼 — teamproject.html의 askAIAboitPoi 대응 */
    askAboutPoi(poi) {
      this.isOpen = true
      const question = `'${poi.title}'(소재지: ${poi.addr1 || '주소 정보 없음'})에 대해 소개해 주고, 이 주변에 가볼 만한 코스도 같이 알려줘!`
      this.send(question)
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
