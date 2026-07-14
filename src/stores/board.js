import { defineStore } from 'pinia'
import * as boardService from '@/services/boardService'

export const useBoardStore = defineStore('board', {
  state: () => ({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
    category: 'ALL',
    keyword: '',
    loading: false,
    error: null,
  }),
  actions: {
    fetchList() {
      this.loading = true
      this.error = null
      try {
        const result = boardService.listPosts({
          category: this.category,
          keyword: this.keyword,
          page: this.page,
          pageSize: this.pageSize,
        })
        this.items = result.items
        this.total = result.total
        this.totalPages = result.totalPages
      } catch (e) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },
    setCategory(category) {
      this.category = category
      this.page = 1
      this.fetchList()
    },
    setKeyword(keyword) {
      this.keyword = keyword
      this.page = 1
      this.fetchList()
    },
    setPage(page) {
      this.page = page
      this.fetchList()
    },
    create(payload) {
      const post = boardService.createPost(payload)
      this.fetchList()
      return post
    },
  },
})
