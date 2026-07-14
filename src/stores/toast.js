import { defineStore } from 'pinia'

let hideTimer = null

export const useToastStore = defineStore('toast', {
  state: () => ({
    show: false,
    message: '',
    success: true,
  }),
  actions: {
    trigger(message, success = true) {
      this.show = true
      this.message = message
      this.success = success
      clearTimeout(hideTimer)
      hideTimer = setTimeout(() => {
        this.show = false
      }, 4000)
    },
  },
})
