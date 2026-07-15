<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { loadContentType, CATEGORY_CONFIG } from '@/services/dataService'

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

onMounted(loadCategory)
watch(() => route.params.slug, loadCategory)
</script>

<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">{{ category?.label ?? '카테고리' }}</h2>

    <p v-if="loadError" class="text-sm text-rose-500 bg-rose-50 border border-rose-100 rounded-2xl p-4">
      {{ loadError }}
    </p>
    <p v-else-if="loading" class="text-sm text-slate-400">불러오는 중...</p>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="item in items" :key="item.contentid" class="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
        <h3 class="font-semibold text-slate-900">{{ item.title }}</h3>
        <p class="text-sm text-slate-500">{{ item.addr1 }}</p>
      </div>
    </div>
  </div>
</template>
