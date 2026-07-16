<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { loadContentType, CATEGORY_CONFIG } from '@/services/dataService'
import { recentPosts } from '@/services/boardService'
import { useChatStore } from '@/stores/chat'
import { fetchCurrentWeather } from '@/services/weatherService'
import { contentTypeLabel } from '@/constants/contentType'
import { loadInfluencerRoutes } from '@/services/influencerService'


const chat = useChatStore()

const guideCategories = [
  ...CATEGORY_CONFIG,
  {
    slug: 'influencer',
    label: '인플루트',
    icon: 'fa-star',
    contentTypeId: 'influencer',
    route: '/influencer',
  },
]

const tourData = ref([])
const posts = ref([])
const weather = ref(null)
const loadError = ref('')
const loading = ref(false)
const showWeatherDetail = ref(false)

function handleImageError(e, title) {
  e.target.src = `https://placehold.co/600x450/1e3a8a/ffffff?text=${encodeURIComponent(title)}`
}

function askAIAboutPoi(poi) {
  chat.askAboutPoi(poi)
}

function toggleWeatherDetail() {
  showWeatherDetail.value = !showWeatherDetail.value
}

const selectedCategory = ref('12')

onMounted(async () => {
  posts.value = recentPosts(3)
  try {
    const { items } = await loadContentType(selectedCategory.value)
    tourData.value = items.slice(0, 8)
  } catch (e) {
    loadError.value = e.message
  }
  try {
    weather.value = await fetchCurrentWeather()
  } catch {
    // 홈 화면에서는 날씨 실패를 조용히 무시
  }
})

async function selectCategory(categoryOrId) {
  const contentTypeId = typeof categoryOrId === 'string' ? categoryOrId : categoryOrId.contentTypeId
  selectedCategory.value = contentTypeId
  loading.value = true
  loadError.value = ''
  try {
    if (contentTypeId === 'influencer') {
      const routes = await loadInfluencerRoutes()
      tourData.value = routes.slice(0, 8)
      return
    }

    const { items } = await loadContentType(contentTypeId)
    tourData.value = items.slice(0, 8)
  } catch (e) {
    loadError.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Dashboard -->
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
      <div class="absolute -top-12 -right-12 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute -bottom-12 -left-12 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div class="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div class="space-y-6">
          <div class="space-y-2">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              구경 야호~
            </h1>
            <p class="text-sm sm:text-base font-semibold text-[#FF6467] tracking-wide uppercase">
              구미·경북 여행 추천 루트
            </p>
          </div>

          <div class="pt-2 flex flex-wrap gap-3">
            <RouterLink to="/board/write" class="bg-[#FF6467] hover:bg-[#E53B47] text-white font-semibold px-6 py-3.5 rounded-2xl shadow-lg shadow-[#FF6467]/30 transition-all flex items-center space-x-2 text-sm">
              <span>커뮤니티 글쓰기</span> <i class="fa-solid fa-arrow-right text-xs"></i>
            </RouterLink>
            <button @click="chat.open" class="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-2xl backdrop-blur transition-colors border border-white/10 text-sm">
              <i class="fa-solid fa-robot mr-2"></i>AI 가이드와 대화
            </button>
            <RouterLink to="/influencer" class="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-2xl backdrop-blur transition-colors border border-white/10 text-sm">
              <i class="fa-solid fa-star mr-2"></i>인플루트 추천 보기
            </RouterLink>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <RouterLink
              v-for="category in guideCategories"
              :key="category.slug || category.contentTypeId"
              :to="category.route || `/category/${category.slug}`"
              class="group bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur transition-all duration-300 flex items-center gap-3 text-sm font-medium hover:border-[#FF6467]/40"
            >
              <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-[#FF6467]/10">
                <i :class="['fa-solid', category.icon, 'text-[#FF6467] group-hover:text-[#FF6467] transition-colors']"></i>
              </div>
              <span class="group-hover:text-[#FF6467] transition-colors">{{ category.label }}</span>
            </RouterLink>
          </div>
        </div>

        <div
          class="block rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6467]/30 hover:bg-slate-900/95 cursor-pointer"
          @click="toggleWeatherDetail"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-800/80 text-5xl">
              {{ weather?.weatherEmoji ?? '⛅' }}
            </div>
            <div class="text-right">
              <p class="text-xs uppercase tracking-[0.3em] text-slate-500">오늘의 날씨</p>
              <p class="text-3xl font-bold text-white">
                {{ weather ? `${weather.temperature}℃` : '...' }}
              </p>
            </div>
          </div>

          <div class="mt-6 rounded-3xl bg-slate-900/80 p-4 border border-slate-700/70">
            <p class="text-sm text-slate-300">
              {{ weather ? weather.weatherLabel : '날씨 정보를 불러오는 중...' }}
            </p>
            <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>{{ weather ? weather.suitability.label : '데이터 로딩 중...' }}</span>
              <span class="rounded-full bg-[#FF6467]/10 px-3 py-1 text-[#FF6467]">구미·경북</span>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between text-sm font-semibold text-[#FF6467]">
            <span>{{ showWeatherDetail ? '간단히 접기' : '자세히 보기' }}</span>
            <i class="fa-solid fa-arrow-right transition-transform duration-300" :class="{ 'rotate-90': showWeatherDetail }"></i>
          </div>

          <div
            class="overflow-hidden transition-all duration-300"
            :class="showWeatherDetail ? 'max-h-80 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'"
          >
            <div class="rounded-3xl bg-slate-900/90 p-4 border border-slate-700/70">
              <p class="text-sm text-slate-300">
                {{ weather ? weather.weatherLabel : '날씨 정보를 불러오는 중...' }}
              </p>
              <div class="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{{ weather ? weather.suitability.reason : '' }}</span>
                <span class="rounded-full bg-[#FF6467]/10 px-3 py-1 text-[#FF6467]">구미·경북</span>
              </div>
              <p class="text-xs text-slate-500 mt-3">
                풍속 {{ weather ? weather.windSpeed : '...' }}km/h · 강수량 {{ weather ? weather.precipitation : '...' }}mm
              </p>
              <p class="text-[11px] text-slate-400 pt-3">
                기준 시각: {{ weather ? weather.observedAt : '...' }} · 출처: {{ weather ? weather.source : '...' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 명소 가이드 -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
            <span class="inline-block w-2.5 h-6 bg-gradient-to-b from-red-500 to-blue-600 rounded-full"></span>
            구미·경북 명소 가이드
          </h2>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">
            {{ selectedCategory === 'influencer' ? '인플루트 추천' : '공공 데이터' }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in guideCategories"
          :key="cat.contentTypeId || cat.slug"
          @click="selectCategory(cat)"
          :class="[
            'px-4 py-2 rounded-2xl text-sm font-semibold transition-all',
            selectedCategory === cat.contentTypeId
              ? 'bg-[#FF6467] text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>

      <p v-if="loading" class="text-sm text-slate-400">불러오는 중...</p>

      <p v-else-if="loadError" class="text-sm text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl p-4">
        {{ loadError }} — public/data 폴더에 JSON 파일이 있는지 확인해주세요.
      </p>

      <div v-else-if="selectedCategory === 'influencer'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="route in tourData"
          :key="route.id"
          class="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div class="relative overflow-hidden aspect-[4/3] bg-slate-100">
            <img
              :src="route.image"
              :alt="route.title"
              class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              @error="handleImageError($event, route.title)"
            />
            <div class="absolute top-3 left-3 bg-[#FF6467] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md border border-[#FF6467]/70">
              인플루트
            </div>
          </div>
          <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
            <div>
              <h3 class="font-bold text-slate-900 group-hover:text-[#FF6467] transition-colors line-clamp-1" :title="route.title">
                {{ route.title }}
              </h3>
              <p class="text-slate-500 text-sm mt-2 line-clamp-2">
                {{ route.description }}
              </p>
              <p class="text-slate-500 text-xs mt-2 flex items-center">
                <i class="fa-solid fa-star mr-1.5 text-[#FF6467]"></i>
                <span class="truncate">{{ route.influencer }}</span>
              </p>
            </div>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in route.tags ?? []"
                :key="tag"
                class="text-[10px] font-medium text-[#FF6467] bg-[#FF6467]/10 px-2.5 py-1 rounded-full"
              >
                {{ tag }}
              </span>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs text-slate-400">평점 {{ route.score?.toFixed(1) ?? '—' }}</span>
              <RouterLink to="/influencer" class="text-xs text-[#FF6467] font-bold hover:text-[#E53B47] hover:underline flex items-center transition-colors">
                더 보기 <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="poi in tourData"
          :key="poi.contentid"
          class="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div class="relative overflow-hidden aspect-[4/3] bg-slate-100">
            <img
              :src="poi.firstimage || `https://placehold.co/600x450/1e3a8a/ffffff?text=${encodeURIComponent(poi.title)}`"
              :alt="poi.title"
              class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              @error="handleImageError($event, poi.title)"
            />
            <div class="absolute top-3 left-3 bg-[#FF6467] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md border border-[#FF6467]/70">
              {{ contentTypeLabel(poi.contenttypeid) }}
            </div>
          </div>
          <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
            <div>
              <h3 class="font-bold text-slate-900 group-hover:text-[#FF6467] transition-colors line-clamp-1" :title="poi.title">
                {{ poi.title }}
              </h3>
              <p class="text-slate-500 text-xs mt-1.5 flex items-center">
                <i class="fa-solid fa-location-dot mr-1.5 text-[#FF6467]"></i>
                <span class="truncate">{{ poi.addr1 || '상세주소 확인중' }}</span>
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button @click="askAIAboutPoi(poi)" class="text-xs text-[#FF6467] font-bold hover:text-[#E53B47] hover:underline flex items-center transition-colors">
                AI에 질문 <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-sm space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <i class="fa-regular fa-comments text-[#FF6467]"></i> 실시간 익명 최근 글
          </h2>
          <p class="text-slate-500 text-xs">최근에 주민들이 나눈 생생한 이야기</p>
        </div>
        <RouterLink to="/board" class="text-xs text-[#FF6467] hover:text-[#E53B47] font-bold flex items-center space-x-1 hover:underline transition-colors">
          <span>전체 소통방 가기</span> <i class="fa-solid fa-chevron-right text-[10px]"></i>
        </RouterLink>
      </div>

      <div v-if="posts.length > 0" class="divide-y divide-slate-100">
        <RouterLink
          v-for="post in posts"
          :key="post.id"
          :to="`/board/${post.id}`"
          class="py-4 hover:bg-slate-50/50 px-2 rounded-xl transition-all cursor-pointer flex justify-between items-center group"
        >
          <div class="space-y-1 max-w-[70%]">
            <span class="text-sm font-semibold text-slate-950 group-hover:text-[#FF6467] transition-colors truncate block">
              {{ post.title }}
            </span>
            <div class="flex items-center space-x-3 text-xs text-slate-400">
              <span><i class="fa-solid fa-user-secret mr-1 text-slate-300"></i> {{ post.author }}</span>
              <span><i class="fa-solid fa-clock mr-1 text-slate-300"></i> {{ post.date }}</span>
            </div>
          </div>
          <span class="text-xs text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-lg group-hover:bg-[#FF6467]/10 group-hover:text-[#FF6467] transition-colors font-medium">
            <i class="fa-regular fa-comment-dots"></i> 보기
          </span>
        </RouterLink>
      </div>
      <div v-else class="text-center py-10 space-y-3">
        <div class="text-slate-300 text-4xl"><i class="fa-regular fa-comment-dots"></i></div>
        <p class="text-slate-400 text-sm">아직 등록된 게시물이 없습니다. 첫 이야기를 들려주세요!</p>
      </div>
    </div>
  </div>
</template>