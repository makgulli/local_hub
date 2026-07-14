<script setup>
import { RouterLink } from 'vue-router'
import { BOARD_CATEGORIES } from '@/services/boardService'

const props = defineProps({
  post: { type: Object, required: true },
})

function categoryLabel(code) {
  return BOARD_CATEGORIES.find((c) => c.code === code)?.label ?? code
}

function formatDate(ts) {
  const d = new Date(ts)
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <RouterLink :to="`/board/${post.id}`" class="row">
    <span class="cell category">{{ categoryLabel(post.category) }}</span>
    <span class="cell title">{{ post.title }}</span>
    <span class="cell views">조회 {{ post.views }}</span>
    <span class="cell date">{{ formatDate(post.createdAt) }}</span>
  </RouterLink>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 80px 1fr 80px 60px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-line);
  font-size: 14px;
  color: var(--color-ink);
}
.row:hover {
  background: var(--color-paper-dim);
}
.category {
  font-size: 12px;
  color: var(--color-river);
  font-weight: 600;
}
.title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.views,
.date {
  font-size: 12px;
  color: var(--color-ink-soft);
  text-align: right;
}

@media (max-width: 560px) {
  .row {
    grid-template-columns: 60px 1fr 50px;
  }
  .date { display: none; }
}
</style>
