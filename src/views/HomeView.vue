<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { loadContentType, CATEGORY_CONFIG } from '@/services/dataService'
import { recentPosts } from '@/services/boardService'
import { useChatStore } from '@/stores/chat'
import { fetchCurrentWeather } from '@/services/weatherService'
import { contentTypeLabel } from '@/constants/contentType'

const chat = useChatStore()

const categories = CATEGORY_CONFIG

const tourData = ref([])
const posts = ref([])
const weather = ref(null)
const loadError = ref('')
const loading = ref(false)

function handleImageError(e, title) {
  e.target.src = `https://placehold.co/600x450/10b981/ffffff?text=${encodeURIComponent(title)}`
}

function askAIAboutPoi(poi) {
  chat.askAboutPoi(poi)
}

const selectedCategory = ref('12')  // ← 선택된 카테고리 추가

onMounted(async () => {
  posts.value = recentPosts(3)
  try {
    // 고정값 '12' 대신 selectedCategory 사용
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

// 카테고리 선택 시 데이터 새로 로드
async function selectCategory(contentTypeId) {
  selectedCategory.value = contentTypeId
  loading.value = true
  loadError.value = ''
  try {
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
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
      <div class="relative z-10 max-w-2xl space-y-4">
        <span class="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">지역 특화 연동 서비스</span>
        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">구미·경북권 로컬 데이터를 손끝에서 만나다</h1>
        <p class="text-slate-300 text-base sm:text-lg leading-relaxed">
          구미, 대구, 칠곡, 성주, 고령 권역의 공공 POI 관광 데이터와 실시간 연동된 스마트 가이드, 그리고 주민들의 솔직담백한 익명 커뮤니티가 어우러집니다.
        </p>
        <div class="pt-4 flex flex-wrap gap-3">
          <RouterLink to="/board/write" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-900/30 transition-all flex items-center space-x-2 text-sm">
            <span>커뮤니티 글쓰기</span> <i class="fa-solid fa-arrow-right text-xs"></i>
          </RouterLink>
          <button @click="chat.open" class="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-2xl backdrop-blur transition-colors border border-white/10 text-sm">
            <i class="fa-solid fa-robot mr-2"></i>AI 가이드와 대화
          </button>
          <RouterLink to="/influencer" class="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-2xl backdrop-blur transition-colors border border-white/10 text-sm">
            <i class="fa-solid fa-star mr-2"></i>인플루트 추천 보기
          </RouterLink>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <RouterLink
            v-for="category in categories"
            :key="category.slug"
            :to="`/category/${category.slug}`"
            class="bg-white/10 hover:bg-white/15 rounded-2xl p-4 border border-white/10 backdrop-blur transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <i :class="['fa-solid', category.icon]"></i>
            {{ category.label }}
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 명소 가이드 (관광지 POI) -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-slate-950">✨ 구미·경북 명소 가이드</h2>
          <p class="text-slate-500 text-sm">카테고리를 선택해 데이터를 확인하세요</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">공공 데이터</span>
        </div>
      </div>

      <!-- 카테고리 선택 버튼 -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in categories"
          :key="cat.contentTypeId"
          @click="selectCategory(cat.contentTypeId)"
          :class="[
            'px-4 py-2 rounded-2xl text-sm font-semibold transition-all',
            selectedCategory === cat.contentTypeId
              ? 'bg-emerald-600 text-white'
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

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="poi in tourData"
          :key="poi.contentid"
          class="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
        >
          <div class="relative overflow-hidden aspect-[4/3] bg-slate-100">
            <img
              :src="poi.firstimage || `https://placehold.co/600x450/10b981/ffffff?text=${encodeURIComponent(poi.title)}`"
              :alt="poi.title"
              class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              @error="handleImageError($event, poi.title)"
            />
            <div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm border border-slate-100">
              {{ contentTypeLabel(poi.contenttypeid) }}
            </div>
          </div>
          <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
            <div>
              <h3 class="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1" :title="poi.title">{{ poi.title }}</h3>
              <p class="text-slate-500 text-xs mt-1.5 flex items-center">
                <i class="fa-solid fa-location-dot mr-1.5 text-slate-400"></i> <span class="truncate">{{ poi.addr1 || '상세주소 확인중' }}</span>
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs text-slate-400">ID: {{ poi.contentid }}</span>
              <button @click="askAIAboutPoi(poi)" class="text-xs text-emerald-600 font-bold hover:underline flex items-center">
                AI에 질문 <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 최근 게시글 -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-sm space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold tracking-tight text-slate-900">💬 실시간 익명 최근 글</h2>
          <p class="text-slate-500 text-xs">최근에 주민들이 나눈 생생한 이야기</p>
        </div>
        <RouterLink to="/board" class="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center space-x-1 hover:underline">
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
            <span class="text-sm font-semibold text-slate-950 group-hover:text-emerald-600 transition-colors truncate block">{{ post.title }}</span>
            <div class="flex items-center space-x-3 text-xs text-slate-400">
              <span><i class="fa-solid fa-user-secret mr-1"></i> {{ post.author }}</span>
              <span><i class="fa-solid fa-clock mr-1"></i> {{ post.date }}</span>
            </div>
          </div>
          <span class="text-xs text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
            <i class="fa-regular fa-comment-dots"></i> 보기
          </span>
        </RouterLink>
      </div>
      <div v-else class="text-center py-10 space-y-3">
        <div class="text-slate-300 text-4xl"><i class="fa-regular fa-comment-dots"></i></div>
        <p class="text-slate-400 text-sm">아직 등록된 게시물이 없습니다. 첫 이야기를 들려주세요!</p>
      </div>
    </div>

    <!-- 오늘의 날씨 (선택기능 요약, 상세는 /weather) -->
    <RouterLink
      to="/weather"
      class="block bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm hover:shadow-lg transition-all"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="text-3xl">{{ weather?.weatherEmoji ?? '⛅' }}</div>
          <div>
            <p class="text-sm font-bold text-slate-900">오늘의 구미·경북 날씨</p>
            <p class="text-xs text-slate-500">
              {{ weather ? `${weather.temperature}℃ · ${weather.weatherLabel} · ${weather.suitability.label}` : '날씨 정보를 불러오는 중...' }}
            </p>
          </div>
        </div>
        <i class="fa-solid fa-chevron-right text-slate-300"></i>
      </div>
    </RouterLink>
  </div>
</template>
