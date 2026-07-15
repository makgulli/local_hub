<script setup>
import { computed, onMounted, ref, watch } from 'vue' 
import { useRoute } from 'vue-router'
import { loadContentType, CATEGORY_CONFIG } from '@/services/dataService'
import { contentTypeLabel } from '@/constants/contentType' 
import { useChatStore } from '@/stores/chat' 

const chat = useChatStore() 
const route = useRoute()
const items = ref([])
const loading = ref(true)
const loadError = ref('')

const category = computed(() => CATEGORY_CONFIG.find((c) => c.slug === route.params.slug))

async function loadCategory() {
  if (!category.value) {
    loadError.value = '존재하지 않는 카테고리입니다.'
    items.value = []
    loading.value = false
    return
  }
  loading.value = true
  loadError.value = ''
  try {
    const { items: data } = await loadContentType(category.value.contentTypeId)
    items.value = data
  } catch (e) {
    loadError.value = e.message
  } finally {
    loading.value = false
  }
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
    <!-- 배너 섹션 (명소 가이드 스타일) -->
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
        <!-- 이미지 영역 -->
        <div class="relative overflow-hidden aspect-[4/3] bg-slate-100">
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
        
        <!-- 텍스트 영역 -->
        <div class="p-5 flex-grow flex flex-col justify-between space-y-3">
          <div>
            <h3 class="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1" :title="item.title">
              {{ item.title }}
            </h3>
            <p class="text-slate-500 text-xs mt-1.5 flex items-center">
              <i class="fa-solid fa-location-dot mr-1.5 text-slate-400"></i>
              <span class="truncate">{{ item.addr1 || '상세주소 확인중' }}</span>
            </p>
          </div>
          
          <!-- AI 질문 버튼 -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs text-slate-400">ID: {{ item.contentid }}</span>
            <button @click="askAIAboutPoi(item)" class="text-xs text-emerald-600 font-bold hover:underline flex items-center">
              AI에 질문 <i class="fa-solid fa-chevron-right ml-1 text-[9px]"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>