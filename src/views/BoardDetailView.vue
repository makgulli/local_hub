<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import * as boardService from '@/services/boardService'
import { BOARD_CATEGORIES } from '@/services/boardService'
import PasswordModal from '@/components/board/PasswordModal.vue'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const notFound = ref(false)
const modalMode = ref(null) // 'edit' | 'delete' | null
const modalError = ref('')

function categoryLabel(code) {
  return BOARD_CATEGORIES.find((c) => c.code === code)?.label ?? code
}

function formatDate(ts) {
  return new Date(ts).toLocaleString('ko-KR')
}

function load() {
  post.value = boardService.getPost(route.params.id)
  notFound.value = !post.value
}

onMounted(load)

function openModal(mode) {
  modalError.value = ''
  modalMode.value = mode
}

function handleConfirm(password) {
  if (modalMode.value === 'edit') {
    if (!boardService.verifyPassword(post.value.id, password)) {
      modalError.value = '비밀번호가 일치하지 않습니다.'
      return
    }
    router.push({ name: 'board-edit', params: { id: post.value.id }, query: { pw: password } })
  } else if (modalMode.value === 'delete') {
    try {
      boardService.deletePost(post.value.id, password)
      router.push('/board')
    } catch (e) {
      modalError.value = e.message
    }
  }
}
</script>

<template>
  <section class="container detail">
    <template v-if="notFound">
      <p class="empty">게시글을 찾을 수 없습니다. 삭제되었거나 다른 브라우저에서 작성된 글일 수 있어요.</p>
      <RouterLink to="/board" class="btn btn-ghost">목록으로</RouterLink>
    </template>

    <template v-else-if="post">
      <p class="breadcrumb">홈 &gt; 게시판 &gt; 게시글 상세</p>
      <span class="tag">{{ categoryLabel(post.category) }}</span>
      <h1>{{ post.title }}</h1>
      <p class="meta">작성일: {{ formatDate(post.createdAt) }} · 조회 {{ post.views }} · {{ post.nickname }}</p>

      <div class="card content">{{ post.content }}</div>

      <div class="actions">
        <RouterLink to="/board" class="btn btn-ghost">목록으로</RouterLink>
        <div class="right">
          <button class="btn btn-primary" @click="openModal('edit')">수정</button>
          <button class="btn btn-danger" @click="openModal('delete')">삭제</button>
        </div>
      </div>
    </template>

    <PasswordModal
      v-if="modalMode"
      :title="modalMode === 'edit' ? '수정하려면 비밀번호를 입력하세요' : '삭제하려면 비밀번호를 입력하세요'"
      @confirm="handleConfirm"
      @cancel="modalMode = null"
    />
    <p v-if="modalError" class="modal-error">{{ modalError }}</p>
  </section>
</template>

<style scoped>
.detail {
  padding: 24px 20px 60px;
  max-width: 760px;
}
.breadcrumb {
  font-size: 12px;
  color: var(--color-ink-soft);
  margin: 0 0 8px;
}
.tag {
  font-size: 11px;
  color: var(--color-river);
  border: 1px solid var(--color-river);
  border-radius: 999px;
  padding: 2px 10px;
}
h1 {
  margin: 10px 0 4px;
  font-size: 22px;
}
.meta {
  font-size: 12px;
  color: var(--color-ink-soft);
  margin: 0 0 16px;
}
.content {
  padding: 20px;
  min-height: 160px;
  white-space: pre-wrap;
  font-size: 15px;
  line-height: 1.8;
}
.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.right {
  display: flex;
  gap: 8px;
}
.empty {
  color: var(--color-ink-soft);
  margin-bottom: 16px;
}
.modal-error {
  color: var(--color-bad);
  font-size: 12px;
}
</style>
