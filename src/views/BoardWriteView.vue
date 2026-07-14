<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as boardService from '@/services/boardService'
import { BOARD_CATEGORIES } from '@/services/boardService'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => Boolean(route.params.id))
const verifiedPassword = route.query.pw ?? ''

const category = ref('FREE')
const title = ref('')
const content = ref('')
const password = ref('')
const error = ref('')

onMounted(() => {
  if (isEdit.value) {
    if (!verifiedPassword) {
      // 상세 화면의 비밀번호 확인 절차를 거치지 않고 직접 접근한 경우 차단
      router.replace(`/board/${route.params.id}`)
      return
    }
    const post = boardService.getPost(route.params.id, { countView: false })
    if (!post) {
      router.replace('/board')
      return
    }
    category.value = post.category
    title.value = post.title
    content.value = post.content
  }
})

function submit() {
  error.value = ''
  try {
    if (isEdit.value) {
      boardService.updatePost(route.params.id, {
        title: title.value,
        content: content.value,
        password: verifiedPassword,
      })
      router.push(`/board/${route.params.id}`)
    } else {
      const post = boardService.createPost({
        category: category.value,
        title: title.value,
        content: content.value,
        password: password.value,
      })
      router.push(`/board/${post.id}`)
    }
  } catch (e) {
    error.value = e.message
  }
}
</script>

<template>
  <section class="container write">
    <p class="breadcrumb">홈 &gt; 게시판 &gt; {{ isEdit ? '글 수정' : '글쓰기' }}</p>

    <div class="field" v-if="!isEdit">
      <label for="category">분류</label>
      <select id="category" v-model="category">
        <option v-for="c in BOARD_CATEGORIES" :key="c.code" :value="c.code">{{ c.label }}</option>
      </select>
    </div>

    <div class="field">
      <label for="title">제목</label>
      <input id="title" v-model="title" type="text" placeholder="제목을 입력하세요" maxlength="100" />
    </div>

    <div class="field">
      <label for="content">내용</label>
      <textarea id="content" v-model="content" rows="10" placeholder="내용을 입력하세요"></textarea>
    </div>

    <div class="field" v-if="!isEdit">
      <label for="password">수정용 비밀번호</label>
      <input
        id="password"
        v-model="password"
        type="password"
        inputmode="numeric"
        placeholder="숫자 4자리 이상"
      />
      <p class="hint">※ 수정·삭제 시 동일하게 입력해야 함</p>
    </div>

    <p v-if="error" class="error-text">{{ error }}</p>

    <div class="actions">
      <button class="btn btn-primary" @click="submit">{{ isEdit ? '수정 완료' : '등록' }}</button>
      <button class="btn btn-ghost" @click="router.back()">취소</button>
    </div>
  </section>
</template>

<style scoped>
.write {
  padding: 24px 20px 60px;
  max-width: 680px;
}
.breadcrumb {
  font-size: 12px;
  color: var(--color-ink-soft);
  margin: 0 0 16px;
}
textarea {
  resize: vertical;
}
.hint {
  font-size: 11px;
  color: var(--color-ink-soft);
  margin: 4px 0 0;
}
.error-text {
  color: var(--color-bad);
  font-size: 13px;
  margin-bottom: 12px;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
