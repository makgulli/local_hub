<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useBoardStore } from '@/stores/board'

const store = useBoardStore()

onMounted(() => store.fetchList())
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">📋 익명 소통망</h2>
        <p class="text-slate-500 text-sm">자유롭고 신뢰성 높은 정보 공유를 위해 비밀번호 기반으로 제어되는 공간입니다.</p>
      </div>
      <RouterLink
        to="/board/write"
        class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4.5 py-2.5 rounded-2xl text-sm transition-all shadow-md shadow-emerald-600/15 flex items-center space-x-2"
      >
        <i class="fa-solid fa-pen-nib"></i> <span>새 글쓰기</span>
      </RouterLink>
    </div>

    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-grow">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
          <i class="fa-solid fa-magnifying-glass"></i>
        </span>
        <input
          :value="store.searchQuery"
          @input="store.setSearchQuery($event.target.value)"
          type="text"
          placeholder="제목이나 내용 검색..."
          class="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm transition-all"
        />
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th class="p-4 text-center w-16">번호</th>
              <th class="p-4">제목</th>
              <th class="p-4 w-32 text-center">작성자</th>
              <th class="p-4 w-36 text-center">작성일</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm text-slate-700">
            <RouterLink
              v-for="(post, index) in store.filteredPosts"
              :key="post.id"
              :to="`/board/${post.id}`"
              custom
              v-slot="{ navigate }"
            >
              <tr @click="navigate" class="hover:bg-slate-50 cursor-pointer transition-colors group">
                <td class="p-4 text-center text-slate-400 font-medium">{{ store.filteredPosts.length - index }}</td>
                <td class="p-4 font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  {{ post.title }}
                </td>
                <td class="p-4 text-center text-slate-500"><i class="fa-solid fa-user-secret text-slate-300 mr-1.5"></i>{{ post.author }}</td>
                <td class="p-4 text-center text-slate-400">{{ post.date }}</td>
              </tr>
            </RouterLink>
            <tr v-if="store.filteredPosts.length === 0">
              <td colspan="4" class="p-12 text-center text-slate-400">
                <div class="text-3xl mb-2 text-slate-300"><i class="fa-solid fa-magnifying-glass"></i></div>
                <span>등록된 글이 없거나 검색 결과가 존재하지 않습니다.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
