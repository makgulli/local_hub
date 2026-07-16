<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { loadContentType, CATEGORY_CONFIG, getBestImageUrl } from '@/services/dataService'
import { contentTypeLabel } from '@/constants/contentType'
import { useChatStore } from '@/stores/chat'
import { loadKakaoMapSdk } from '@/services/mapService'
import LocationModal from '@/components/common/LocationModal.vue'

const chat = useChatStore()
const route = useRoute()
const items = ref([])
const loading = ref(true)
const loadError = ref('')
const mapError = ref('')
const mapContainer = ref(null)
const map = ref(null)
const mapMarkers = ref([])

const category = computed(() => CATEGORY_CONFIG.find((c) => c.slug === route.params.slug))
const showMap = computed(() => category.value?.slug === 'tourism')

const locationModalOpen = ref(false)
const selectedLocation = ref(null)

function openLocationModal(item) {
  selectedLocation.value = item
  locationModalOpen.value = true
}
function closeLocationModal() {
  locationModalOpen.value = false
  selectedLocation.value = null
}

async function loadCategory() {
  if (!category.value) {
    loadError.value = '존재하지 않는 카테고리입니다.'
    items.value = []
    loading.value = false
    clearMap()
    return
  }

  loading.value = true
  loadError.value = ''
  mapError.value = ''

  try {
    const { items: data } = await loadContentType(category.value.contentTypeId)
    items.value = data
    await nextTick()

    if (showMap.value) {
      await renderMap()
    } else {
      clearMap()
    }
  } catch (e) {
    loadError.value = e.message || '데이터를 불러오지 못했습니다.'
    clearMap()
  } finally {
    loading.value = false
  }
}

async function renderMap() {
  clearMap()

  const validItems = (items.value || []).filter((item) => item.lat != null && item.lng != null)

  if (!validItems.length) {
    mapError.value = '지도에 표시할 좌표 정보가 없는 항목입니다.'
    return
  }

  try {
    const kakaoMaps = await loadKakaoMapSdk(import.meta.env.VITE_KAKAO_MAP_APP_KEY)

    if (!mapContainer.value) return

    const firstPosition = new kakaoMaps.LatLng(validItems[0].lat, validItems[0].lng)
    const mapOptions = {
      center: firstPosition,
      level: 8,
    }

    map.value = new kakaoMaps.Map(mapContainer.value, mapOptions)

    const bounds = new kakaoMaps.LatLngBounds()
    validItems.forEach((item) => {
      const position = new kakaoMaps.LatLng(item.lat, item.lng)
      const marker = new kakaoMaps.Marker({
        map: map.value,
        position,
        title: item.title,
      })
      mapMarkers.value.push(marker)
      bounds.extend(position)
    })

    if (validItems.length > 1) {
      map.value.setBounds(bounds)
    } else {
      map.value.setCenter(firstPosition)
    }
  } catch (error) {
    mapError.value = error.message || '지도 초기화 중 오류가 발생했습니다.'
    clearMap()
  }
}

function clearMap() {
  mapMarkers.value.forEach((marker) => marker.setMap(null))
  mapMarkers.value = []
  map.value = null
}

function getCategoryImageSeed(contentTypeId, fallbackTitle) {
  const styleMap = {
    '12': 'landscape',
    '14': 'culture',
    '15': 'festival',
    '25': 'route',
    '28': 'adventure',
    '32': 'hotel',
    '38': 'shopping',
    '39': 'food',
  }

  const base = styleMap[String(contentTypeId)] || 'travel'
  return `${base}-${encodeURIComponent(fallbackTitle || 'travel')}`
}

function getImageUrl(item, fallbackTitle, contentTypeId) {
  const raw = getBestImageUrl(item)
  if (raw) {
    return raw
  }

  return `https://picsum.photos/seed/${getCategoryImageSeed(contentTypeId, fallbackTitle)}/600/450`
}

function handleImageError(e, title, contentTypeId) {
  e.target.src = `https://picsum.photos/seed/${getCategoryImageSeed(contentTypeId, title)}/600/450`
}

function askAIAboutPoi(poi) {
  chat.askAboutPoi(poi)
}

onMounted(loadCategory)
watch(() => route.params.slug, loadCategory)
</script>

<template>
  <div class="space-y-6 sm:space-y-8">
    <section class="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 p-6 text-white shadow-2xl sm:p-8 lg:p-10">
      <div class="absolute -top-12 -right-12 h-72 w-72 rounded-full bg-red-600/10 blur-[120px]"></div>
      <div class="absolute -bottom-12 -left-12 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px]"></div>

      <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl space-y-2 sm:space-y-3">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6467]">{{ category?.label ?? '카테고리' }}</p>
          <h2 class="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">구미·경북 {{ category?.label ?? '추천 정보' }}</h2>
          <p class="text-sm leading-relaxed text-slate-300 sm:text-base">
            공공 데이터 기반으로 한눈에 확인할 수 있는 {{ category?.label ?? '여행 정보' }}입니다.
          </p>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <RouterLink to="/" class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
            <i class="fa-solid fa-arrow-left"></i> 홈으로 돌아가기
          </RouterLink>
          <span class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-semibold text-slate-200">공공 데이터</span>
        </div>
      </div>
    </section>

    <section class="rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 class="text-xl font-bold tracking-tight text-slate-950">추천 {{ category?.label ?? '정보' }}</h3>
          <p class="text-sm text-slate-500">{{ items.length }}개의 결과를 확인해보세요.</p>
        </div>
      </div>

      <p v-if="loadError" class="mt-5 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-500 sm:mt-6">
        {{ loadError }}
      </p>
      <p v-else-if="loading" class="mt-5 text-sm text-slate-400 sm:mt-6">불러오는 중...</p>
      <div v-else class="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        <div
          v-for="item in items"
          :key="item.contentid"
          class="group flex flex-col justify-between overflow-hidden rounded-[1.5rem] border border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div
            class="relative aspect-[4/3] overflow-hidden bg-slate-100 cursor-pointer"
            @click="openLocationModal(item)"
          >
            <img
              :src="getImageUrl(item, item.title, item.contenttypeid || category?.contentTypeId)"
              :alt="item.title"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              @error="handleImageError($event, item.title, item.contenttypeid || category?.contentTypeId)"
            />
            <div class="absolute left-3 top-3 rounded-lg border border-[#FF6467]/70 bg-[#FF6467] px-2.5 py-1 text-[10px] font-bold text-white shadow-md">
              {{ contentTypeLabel(item.contenttypeid) }}
            </div>
          </div>

          <div class="flex flex-grow flex-col justify-between space-y-3 p-4 sm:p-5">
            <div class="cursor-pointer" @click="openLocationModal(item)">
              <h3 class="line-clamp-1 font-bold text-slate-900 transition-colors group-hover:text-[#FF6467]" :title="item.title">
                {{ item.title }}
              </h3>
              <p class="mt-1.5 text-xs text-slate-500 flex items-center">
                <i class="fa-solid fa-location-dot mr-1.5 text-slate-400"></i>
                <span class="truncate">{{ item.addr1 || '상세주소 확인중' }}</span>
              </p>
            </div>

            <div class="flex items-center justify-between border-t border-slate-100 pt-3 gap-2">
              <span class="text-xs text-slate-400">{{ item.contentid }}</span>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  @click="openLocationModal(item)"
                  class="text-xs font-bold text-slate-600 transition-colors hover:text-slate-900"
                >
                  위치 보기
                </button>
                <button
                  type="button"
                  @click="askAIAboutPoi(item)"
                  class="flex items-center text-xs font-bold text-[#FF6467] transition-colors hover:text-[#E53B47] hover:underline"
                >
                  AI에 질문 <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <LocationModal
      :show="locationModalOpen"
      :item="selectedLocation"
      @close="closeLocationModal"
    />
  </div>
</template>