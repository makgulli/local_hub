<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadContentType, CATEGORY_CONFIG } from '@/services/dataService'
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

function handleImageError(e, title) {
  e.target.src = `https://placehold.co/600x450/10b981/ffffff?text=${encodeURIComponent(title)}`
}

function askAIAboutPoi(poi) {
  chat.askAboutPoi(poi)
}

onMounted(loadCategory)
watch(() => route.params.slug, loadCategory)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-950">{{ category?.label ?? '카테고리' }}</h2>
        <p class="text-slate-500 text-sm">구미·경북권 {{ category?.label }} 정보</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">공공 데이터</span>
      </div>
    </div>
    <p v-if="loadError" class="text-sm text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl p-4">
      {{ loadError }}
    </p>
    <p v-else-if="loading" class="text-sm text-slate-400">불러오는 중...</p>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in items"
        :key="item.contentid"
        class="group bg-white rounded-2xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
      >
  <div
  class="relative overflow-hidden aspect-[4/3] bg-slate-100 cursor-pointer"
  @click="openLocationModal(item)"
>
  <img
    :src="item.firstimage || `https://placehold.co/600x450/10b981/ffffff?text=${encodeURIComponent(item.title)}`"
    :alt="item.title"
    class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
    @error="handleImageError($event, item.title)"
  />
  <div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm border border-slate-100">
    {{ contentTypeLabel(item.contenttypeid) }}
  </div>
</div>

        <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
          <div class="cursor-pointer" @click="openLocationModal(item)">
  <h3 class="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1" :title="item.title">
    {{ item.title }}
  </h3>
  <p class="text-slate-500 text-xs mt-1.5 flex items-center">
    <i class="fa-solid fa-location-dot mr-1.5 text-slate-400"></i>
    <span class="truncate">{{ item.addr1 || '상세주소 확인중' }}</span>
  </p>
</div>
          

          <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
  <span class="text-xs text-slate-400">ID: {{ item.contentid }}</span>
  <div class="flex items-center gap-2">
    <button
      type="button"
      @click="openLocationModal(item)"
      class="text-xs text-slate-600 font-bold hover:text-slate-900 transition-colors"
    >
      위치 보기
    </button>
    <button
      type="button"
      @click="askAIAboutPoi(item)"
      class="text-xs text-emerald-600 font-bold hover:underline flex items-center"
    >
      AI에 질문 <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
    </button>
  </div>
</div>
        </div>
      </div>
    </div>
    <LocationModal
  :show="locationModalOpen"
  :item="selectedLocation"
  @close="closeLocationModal"
/>
  </div>
</template>