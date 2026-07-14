<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as boardService from '@/services/boardService'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const router = useRouter()
const toast = useToastStore()

const isEdit = computed(() => Boolean(route.params.id))
const verifiedPassword = route.query.pw ?? ''

const form = ref({ id: null, author: '', title: '', content: '', password: '' })

onMounted(() => {
  if (!isEdit.value) return
  if (!verifiedPassword) {
    // 상세 화면의 비밀번호 확인 절차를 거치지 않고 직접 접근한 경우 차단
    router.replace(`/board/${route.params.id}`)
    return
  }
  const post = boardService.getPost(Number(route.params.id))
  if (!post) {
    router.replace('/board')
    return
  }
  form.value = { id: post.id, author: post.author, title: post.title, content: post.content, password: '' }
})

function submitPost() {
  const f = form.value
  if (!f.author.trim() || !f.title.trim() || !f.content.trim()) {
    toast.trigger('모든 입력 항목을 빠짐없이 채워주세요.', false)
    return
  }

  try {
    if (isEdit.value) {
      boardService.updatePost(f.id, { author: f.author, title: f.title, content: f.content })
      toast.trigger('게시글이 깔끔하게 변경 완료되었습니다.')
      router.push(`/board/${f.id}`)
    } else {
      const post = boardService.createPost(f)
      toast.trigger('귀중한 지역 소식이 정상적으로 등록되었습니다.')
      router.push(`/board/${post.id}`)
    }
  } catch (e) {
    toast.trigger(e.message, false)
  }
}

function cancelPostForm() {
  router.back()
}
</script>

<template>
  <div class="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/60 shadow-md overflow-hidden p-6 sm:p-8 space-y-6">
    <div>
      <h2 class="text-xl font-bold text-slate-900">{{ isEdit ? '📝 게시글 수정하기' : '✍️ 새로운 익명글 작성' }}</h2>
      <p class="text-slate-400 text-xs mt-1">지역 주민들과 나누고 싶은 다양한 이야기를 공유하세요.</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">글쓴이 (익명 닉네임)</label>
        <input
          v-model="form.author"
          type="text"
          placeholder="예: 구미새댁, 형곡동지기"
          class="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">글 제목</label>
        <input
          v-model="form.title"
          type="text"
          placeholder="제목을 구체적으로 입력하세요."
          class="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
        />
      </div>
      <div>
        <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">내용</label>
        <textarea
          v-model="form.content"
          rows="7"
          placeholder="자유롭게 이야기를 작성해 주세요. (타인의 비방이나 무단 광고글은 사양합니다.)"
          class="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
        ></textarea>
      </div>
      <div v-if="!isEdit">
        <label class="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">글 보호 비밀번호 (숫자 4자리)</label>
        <input
          v-model="form.password"
          type="password"
          maxlength="4"
          placeholder="••••"
          class="w-32 border border-slate-200 rounded-2xl px-4 py-3 text-sm tracking-widest text-center font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
        />
      </div>
    </div>

    <div class="pt-4 border-t border-slate-100 flex justify-end space-x-2">
      <button @click="cancelPostForm" class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all">취소</button>
      <button @click="submitPost" class="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10">등록하기</button>
    </div>
  </div>
</template>
