<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as boardService from '@/services/boardService'
import { useToastStore } from '@/stores/toast'
import PasswordModal from '@/components/board/PasswordModal.vue'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const post = ref(null)
const notFound = ref(false)
const authModal = ref({ show: false, type: '' })

function load() {
  const id = Number(route.params.id)
  post.value = boardService.getPost(id)
  notFound.value = !post.value
}
onMounted(load)

function promptAuthModal(type) {
  authModal.value = { show: true, type }
}

function authorizeAndExecute(password) {
  if (!boardService.verifyPassword(post.value.id, password)) {
    toast.trigger('비밀번호가 불일치하여 승인되지 못했습니다.', false)
    return
  }
  const type = authModal.value.type
  authModal.value.show = false

  if (type === 'edit') {
    router.push({ name: 'board-edit', params: { id: post.value.id }, query: { pw: password } })
  } else if (type === 'delete') {
    boardService.deletePost(post.value.id)
    toast.trigger('글이 정상적으로 파기되었습니다.', true)
    router.push('/board')
  }
}
</script>

<template>
  <div v-if="notFound" class="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-md p-10 text-center space-y-4">
    <p class="text-slate-400">게시글을 찾을 수 없습니다. 삭제되었거나 다른 브라우저에서 작성된 글일 수 있어요.</p>
    <RouterLink to="/board" class="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-2.5 rounded-2xl text-xs">목록으로</RouterLink>
  </div>

  <div v-else-if="post" class="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-md overflow-hidden">
    <div class="p-6 sm:p-8 space-y-6">
      <div class="border-b border-slate-100 pb-5 space-y-3">
        <div class="flex items-center space-x-2">
          <span class="text-xs bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-100">구미·경북 소통망</span>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{{ post.title }}</h2>
        <div class="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
          <span><i class="fa-solid fa-user-secret mr-1 text-slate-300"></i> 익명: {{ post.author }}</span>
          <span><i class="fa-solid fa-clock mr-1 text-slate-300"></i> {{ post.date }}</span>
        </div>
      </div>

      <div class="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap min-h-[180px]">{{ post.content }}</div>

      <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <RouterLink to="/board" class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4.5 py-2.5 rounded-2xl text-xs transition-colors flex items-center justify-center space-x-1">
          <i class="fa-solid fa-list"></i> <span>목록으로</span>
        </RouterLink>
        <div class="flex space-x-2">
          <button @click="promptAuthModal('edit')" class="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1">
            <i class="fa-solid fa-pen"></i> <span>수정</span>
          </button>
          <button @click="promptAuthModal('delete')" class="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1">
            <i class="fa-solid fa-trash"></i> <span>삭제</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <PasswordModal
    v-if="authModal.show"
    :title="authModal.type === 'edit' ? '수정을 위한 비밀번호 확인' : '삭제를 위한 비밀번호 확인'"
    @confirm="authorizeAndExecute"
    @cancel="authModal.show = false"
  />
</template>
