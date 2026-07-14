<script setup>
const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})
const emit = defineEmits(['update:page'])

function go(p) {
  if (p < 1 || p > props.totalPages || p === props.page) return
  emit('update:page', p)
}
</script>

<template>
  <nav class="pagination" aria-label="페이지 이동">
    <button class="btn btn-ghost" :disabled="page === 1" @click="go(page - 1)">&lt;</button>
    <button
      v-for="p in totalPages"
      :key="p"
      class="page-btn"
      :class="{ active: p === page }"
      @click="go(p)"
    >
      {{ p }}
    </button>
    <button class="btn btn-ghost" :disabled="page === totalPages" @click="go(page + 1)">&gt;</button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin: 24px 0;
}
.page-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid var(--color-line);
  background: #fff;
  font-size: 13px;
  color: var(--color-ink-soft);
}
.page-btn.active {
  border-color: var(--color-river);
  color: var(--color-river);
  font-weight: 700;
}
</style>
