<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useBoardStore } from '@/stores/board'
import { BOARD_CATEGORIES } from '@/services/boardService'
import { SELECTED_REGION_LABEL } from '@/constants/contentType'
import BoardListItem from '@/components/board/BoardListItem.vue'
import Pagination from '@/components/board/Pagination.vue'

const store = useBoardStore()
const keywordInput = ref('')

onMounted(() => store.fetchList())

function search() {
  store.setKeyword(keywordInput.value)
}
</script>

<template>
  <section class="container board">
    <p class="breadcrumb">홈 &gt; {{ SELECTED_REGION_LABEL }} 게시판</p>

    <div class="category-tabs">
      <button
        class="tab"
        :class="{ active: store.category === 'ALL' }"
        @click="store.setCategory('ALL')"
      >
        전체
      </button>
      <button
        v-for="c in BOARD_CATEGORIES"
        :key="c.code"
        class="tab"
        :class="{ active: store.category === c.code }"
        @click="store.setCategory(c.code)"
      >
        {{ c.label }}
      </button>
    </div>

    <div class="toolbar">
      <input
        v-model="keywordInput"
        type="text"
        placeholder="게시글 검색어를 입력하세요"
        @keyup.enter="search"
      />
      <button class="btn btn-ghost" @click="search">검색</button>
      <RouterLink to="/board/write" class="btn btn-primary">+ 글쓰기</RouterLink>
    </div>

    <div class="card list-wrap">
      <div class="row head">
        <span>분류</span>
        <span>제목</span>
        <span>조회</span>
        <span>작성일</span>
      </div>
      <BoardListItem v-for="post in store.items" :key="post.id" :post="post" />
      <p v-if="!store.loading && store.items.length === 0" class="empty">
        조건에 맞는 게시글이 없어요. 첫 글을 남겨보세요!
      </p>
    </div>

    <Pagination
      v-if="store.totalPages > 1"
      :page="store.page"
      :total-pages="store.totalPages"
      @update:page="store.setPage"
    />
  </section>
</template>

<style scoped>
.board {
  padding: 24px 20px 60px;
}
.breadcrumb {
  font-size: 12px;
  color: var(--color-ink-soft);
  margin: 0 0 12px;
}
.category-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.tab {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid var(--color-line);
  background: #fff;
  font-size: 13px;
  color: var(--color-ink-soft);
}
.tab.active {
  background: var(--color-river);
  border-color: var(--color-river);
  color: #fff;
  font-weight: 600;
}
.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.toolbar input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--color-line);
  border-radius: 8px;
}
.list-wrap {
  padding: 0;
  overflow: hidden;
}
.row.head {
  display: grid;
  grid-template-columns: 80px 1fr 80px 60px;
  padding: 12px 16px;
  background: var(--color-paper-dim);
  font-size: 12px;
  font-weight: 700;
  color: var(--color-ink-soft);
}
.empty {
  padding: 40px 16px;
  text-align: center;
  color: var(--color-ink-soft);
  font-size: 14px;
}
</style>
