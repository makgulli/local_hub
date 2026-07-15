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
  // 기본 이미지를 태극기의 푸른색(딥블루) 계열로 변경하여 일관성 유지
  e.target.src = `https://placehold.co/600x450/1e3a8a/ffffff?text=${encodeURIComponent(title)}`
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
    <!-- Hero Dashboard (태극 광원 효과 + 건곤감리 흑색조 베이스) -->
    <div class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
      <!-- 태극기의 양(붉은색)과 음(푸른색)을 상징하는 은은한 백라이트 그라데이션 효과 -->
      <div class="absolute -top-12 -right-12 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="absolute -bottom-12 -left-12 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div class="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div class="space-y-6">
          <!-- 메인 타이틀 및 서브 타이틀 영역 -->
          <div class="space-y-2">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              구경 야호~
            </h1>
            <p class="text-sm sm:text-base font-semibold text-blue-400 tracking-wide uppercase">
              구미·경북 여행 추천 루트
            </p>
          </div>
          
          <!-- 커뮤니티 글쓰기 버튼 (푸른색 포인트) -->
          <div class="pt-2 flex flex-wrap gap-3">
            <RouterLink to="/board/write" class="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-900/40 transition-all flex items-center space-x-2 text-sm">
              <span>커뮤니티 글쓰기</span> <i class="fa-solid fa-arrow-right text-xs"></i>
            </RouterLink>
            <button @click="chat.open" class="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-2xl backdrop-blur transition-colors border border-white/10 text-sm">
              <i class="fa-solid fa-robot mr-2"></i>AI 가이드와 대화
            </button>
            <RouterLink to="/influencer" class="bg-white/10 hover:bg-white/15 text-white font-medium px-5 py-3 rounded-2xl backdrop-blur transition-colors border border-white/10 text-sm">
              <i class="fa-solid fa-star mr-2"></i>인플루트 추천 보기
            </RouterLink>
          </div>

          <!-- 카테고리 그리드 (태극 아이콘 테마 및 푸른색 hover 효과) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <RouterLink
              v-for="category in categories"
              :key="category.slug"
              :to="`/category/${category.slug}`"
              class="group bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur transition-all duration-300 flex items-center gap-3 text-sm font-medium hover:border-blue-500/40"
            >
              <!-- 카테고리별 아이콘을 붉은색과 푸른색으로 교차 배정하여 리듬감 부여 -->
              <div class="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center transition-colors group-hover:bg-blue-600/20">
                <i :class="['fa-solid', category.icon, 'text-red-400 group-hover:text-blue-400 transition-colors']"></i>
              </div>
              <span class="group-hover:text-blue-200 transition-colors">{{ category.label }}</span>
            </RouterLink>
          </div>
        </div>

        <RouterLink
          to="/weather"
          class="block rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-slate-900/95"
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
              <span class="rounded-full bg-sky-500/10 px-3 py-1 text-sky-300">구미·경북</span>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between text-sm font-semibold text-sky-300">
            <span>자세히 보기</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- 명소 가이드 (관광지 POI) -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <!-- 타이틀 데코레이션에 태극의 적/청 세로 바 추가 -->
          <h2 class="text-2xl font-bold tracking-tight text-slate-950 flex items-center gap-2">
            <span class="inline-block w-2.5 h-6 bg-gradient-to-b from-red-500 to-blue-600 rounded-full"></span>
            구미·경북 명소 가이드
          </h2>
          <p class="text-slate-500 text-sm">한국관광공사 TourAPI 4.0 연동 기반의 로컬 핫플레이스</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-md">공공 데이터</span>
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
              :src="poi.firstimage || `https://placehold.co/600x450/1e3a8a/ffffff?text=${encodeURIComponent(poi.title)}`"
              :alt="poi.title"
              class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              @error="handleImageError($event, poi.title)"
            />
            <!-- 카드 좌측 상단 뱃지에 푸른색 적용 -->
            <div class="absolute top-3 left-3 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md border border-blue-500">
              {{ contentTypeLabel(poi.contenttypeid) }}
            </div>
          </div>
          <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
            <div>
              <h3 class="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1" :title="poi.title">
                {{ poi.title }}
              </h3>
              <p class="text-slate-500 text-xs mt-1.5 flex items-center">
                <!-- 위치 핀 아이콘에 붉은색 포인트 부여 -->
                <i class="fa-solid fa-location-dot mr-1.5 text-red-500"></i>
                <span class="truncate">{{ poi.addr1 || '상세주소 확인중' }}</span>
              </p>
            </div>
            <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs text-slate-400">ID: {{ poi.contentid }}</span>
              <!-- 질문 버튼 hover 시 태극색 교차(블루 -> 레드) 연출 -->
              <button @click="askAIAboutPoi(poi)" class="text-xs text-blue-600 font-bold hover:text-red-500 hover:underline flex items-center transition-colors">
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
          <h2 class="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <!-- 아이콘에 푸른색 테마 적용 -->
            <i class="fa-regular fa-comments text-blue-600"></i> 실시간 익명 최근 글
          </h2>
          <p class="text-slate-500 text-xs">최근에 주민들이 나눈 생생한 이야기</p>
        </div>
        <!-- 전체 소통방 가기 텍스트 링크 hover 시 붉은색 포인트 변경 -->
        <RouterLink to="/board" class="text-xs text-blue-600 hover:text-red-500 font-bold flex items-center space-x-1 hover:underline transition-colors">
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
            <span class="text-sm font-semibold text-slate-950 group-hover:text-blue-600 transition-colors truncate block">
              {{ post.title }}
            </span>
            <div class="flex items-center space-x-3 text-xs text-slate-400">
              <span><i class="fa-solid fa-user-secret mr-1 text-slate-300"></i> {{ post.author }}</span>
              <span><i class="fa-solid fa-clock mr-1 text-slate-300"></i> {{ post.date }}</span>
            </div>
          </div>
          <!-- 글 보기 뱃지 hover 시 붉은색 스타일 연출 -->
          <span class="text-xs text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-lg group-hover:bg-red-50 group-hover:text-red-600 transition-colors font-medium">
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