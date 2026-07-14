<script setup>
import { ref } from 'vue'

defineProps({
  title: { type: String, default: '비밀번호 확인' },
})
const emit = defineEmits(['confirm', 'cancel'])

const password = ref('')

function confirm() {
  emit('confirm', password.value)
}
</script>

<template>
  <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" @click.self="emit('cancel')">
    <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
      <div class="flex items-center space-x-3 text-slate-900">
        <span class="text-amber-500 text-xl"><i class="fa-solid fa-lock"></i></span>
        <h3 class="text-lg font-bold">{{ title }}</h3>
      </div>
      <p class="text-slate-500 text-xs leading-relaxed">이 글을 작성하실 때 입력하셨던 비밀번호 4자리를 입력해 주세요.</p>
      <input
        v-model="password"
        type="password"
        maxlength="4"
        placeholder="••••"
        autofocus
        class="w-full border border-slate-200 rounded-2xl px-4 py-3 text-center text-xl tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-slate-50"
        @keyup.enter="confirm"
      />
      <div class="flex space-x-2 pt-2">
        <button @click="emit('cancel')" class="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2.5 rounded-2xl text-xs font-bold transition-all">취소</button>
        <button @click="confirm" class="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10">확인</button>
      </div>
    </div>
  </div>
</template>
