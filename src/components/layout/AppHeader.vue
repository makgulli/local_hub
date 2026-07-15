<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()

const isBoardActive = computed(() =>
  ['board-list', 'board-detail', 'board-write', 'board-edit'].includes(route.name)
)

function navBtnClass(isActive) {
  return isActive
    ? 'bg-slate-900 text-[#FF6467] font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm border border-slate-700 transition-all'
    : 'text-slate-300 hover:text-[#FF6467] font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm hover:bg-slate-800 transition-all'
}
</script>

<template>
  <header class="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center space-x-3">
        <div>
          <span class="text-xl font-extrabold tracking-tight text-slate-100">
            구경 야호 <span class="text-[#FF6467]">(GUGYEONG-YAHO)</span>
          </span>
          <span class="hidden sm:inline-block ml-2 text-xs font-semibold bg-slate-800 text-[#FF6467] px-2 py-0.5 rounded-full border border-slate-700">
            구미·경북권
          </span>
        </div>
      </RouterLink>

      <nav class="flex items-center space-x-1 sm:space-x-3">
        <RouterLink to="/" :class="navBtnClass(route.name === 'home')">
          <i class="fa-solid fa-house mr-1.5"></i> 홈
        </RouterLink>
        <RouterLink to="/board" :class="navBtnClass(isBoardActive)">
          <i class="fa-solid fa-comments mr-1.5"></i> 익명 소통망
        </RouterLink>
        <RouterLink to="/influencer" :class="navBtnClass(route.name === 'influencer')">
          <i class="fa-solid fa-star mr-1.5"></i> 인플루트
        </RouterLink>
        <RouterLink to="/weather" :class="navBtnClass(route.name === 'weather')">
          <i class="fa-solid fa-cloud-sun mr-1.5"></i> 날씨
        </RouterLink>
      </nav>
    </div>
  </header>
</template>