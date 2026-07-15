<script setup>
import { onMounted, computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import InfluRouteCard from '@/components/influencer/InfluRouteCard.vue'
import {
  filterRoutesByTag,
  getUniqueTags,
  loadInfluencerRoutes,
  searchRoutes,
  sortRoutesByScore,
} from '@/services/influencerService'

const routes = ref([])
const searchQuery = ref('')
const selectedTag = ref('')
const sortOrder = ref('desc')
const loadError = ref('')

const tags = computed(() => getUniqueTags(routes.value))
const filteredRoutes = computed(() => {
  let results = [...routes.value]
  results = searchRoutes(results, searchQuery.value)
  results = filterRoutesByTag(results, selectedTag.value)
  results = sortRoutesByScore(results, sortOrder.value)
  return results
})

const hasFilters = computed(() => Boolean(searchQuery.value.trim() || selectedTag.value))

function selectTag(tag) {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}

function resetFilters() {
  searchQuery.value = ''
  selectedTag.value = ''
  sortOrder.value = 'desc'
}

onMounted(async () => {
  try {
    routes.value = await loadInfluencerRoutes()
  } catch (err) {
    loadError.value = err instanceof Error ? err.message : String(err)
  }
})
</script>

<template>
  <div class="space-y-10">
    <section class="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white p-8 shadow-2xl border border-slate-800">
      <div class="max-w-4xl space-y-4">
        <p class="text-xs uppercase tracking-[0.3em] text-[#FF6467]">인플루트</p>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight">인플루언서 여행 루트!! </h1>
        <p class="max-w-2xl leading-relaxed text-[#FF6467]">
          실제 인플루언서의 루트를 따라가다! 구미·경북권 여행 코스에 여러분을 초대해야호~
        </p>
        <div class="flex flex-wrap gap-3">
          <RouterLink to="/" class="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-5 py-3 text-sm font-semibold hover:bg-white/15 transition">
            <i class="fa-solid fa-arrow-left"></i> 홈으로 돌아가기
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-2">
          <h2 class="text-xl font-bold text-slate-900">인플루트 추천 루트</h2>
          <p class="text-sm text-slate-500">태그, 키워드, 평점으로 원하는 여행 트립을 빠르게 찾아보세요.</p>
        </div>
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label class="relative block">
            <span class="sr-only">검색</span>
            <input
              v-model="searchQuery"
              type="search"
              placeholder="검색어를 입력해보세요 (카페, 맛집, 자연 등)"
              class="w-full sm:w-72 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6467]/20 focus:border-[#FF6467]"
            />
          </label>
          <select v-model="sortOrder" class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6467]/20 focus:border-[#FF6467]">
            <option value="desc">평점 높은 순</option>
            <option value="asc">평점 낮은 순</option>
          </select>
          <button @click="resetFilters" class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
            초기화
          </button>
        </div>
      </div>

      <div class="mt-6 space-y-4">
        <div class="flex flex-wrap gap-3">
          <button
            @click="selectTag(tag)"
            :class="['rounded-full border px-4 py-2 text-sm font-semibold transition', selectedTag === tag ? 'bg-[#FF6467] text-white border-[#FF6467]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100']"
            v-for="tag in tags"
            :key="tag"
          >
            {{ tag }}
          </button>
          <button
            @click="selectTag('')"
            :class="['rounded-full border px-4 py-2 text-sm font-semibold transition', selectedTag === '' ? 'bg-[#FF6467] text-white border-[#FF6467]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100']"
          >
            전체
          </button>
        </div>

        <div class="rounded-3xl border border-slate-100 bg-slate-50 px-5 py-4 text-sm text-slate-600">
          <p class="font-semibold text-slate-900">현재 필터</p>
          <p class="mt-1">
            검색: <span class="font-medium text-slate-700">{{ searchQuery || '없음' }}</span>
            · 태그: <span class="font-medium text-slate-700">{{ selectedTag || '전체' }}</span>
            · 정렬: <span class="font-medium text-slate-700">{{ sortOrder === 'desc' ? '높은 평점순' : '낮은 평점순' }}</span>
          </p>
        </div>
      </div>
    </section>

    <section>
      <p v-if="loadError" class="rounded-3xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-700">{{ loadError }}</p>
      <div v-else class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <InfluRouteCard
          v-for="route in filteredRoutes"
          :key="route.id"
          :route="route"
        />
      </div>
      <p v-if="filteredRoutes.length === 0 && !loadError" class="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
        조건에 맞는 추천 루트를 찾을 수 없습니다. 검색어나 태그를 변경해보세요.
      </p>
    </section>
  </div>
</template>
