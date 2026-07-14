import { defineStore } from 'pinia'
import * as boardService from '@/services/boardService'

export const useBoardStore = defineStore('board', {
  state: () => ({
    posts: [],
    searchQuery: '',
  }),
  getters: {
    filteredPosts(state) {
      if (!state.searchQuery.trim()) return state.posts
      const kw = state.searchQuery.toLowerCase().trim()
      return state.posts.filter(
        (p) =>
          p.title.toLowerCase().includes(kw) ||
          p.content.toLowerCase().includes(kw) ||
          p.author.toLowerCase().includes(kw)
      )
    },
  },
  actions: {
    fetchList() {
      this.posts = boardService.listPosts()
    },
    setSearchQuery(q) {
      this.searchQuery = q
    },
    create(payload) {
      const post = boardService.createPost(payload)
      this.fetchList()
      return post
    },
    update(id, payload) {
      const post = boardService.updatePost(id, payload)
      this.fetchList()
      return post
    },
    remove(id) {
      boardService.deletePost(id)
      this.fetchList()
    },
  },
})
