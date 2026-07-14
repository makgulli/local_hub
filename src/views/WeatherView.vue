<script setup>
import { onMounted, ref } from 'vue'
import { fetchCurrentWeather } from '@/services/weatherService'

const weather = ref(null)
const error = ref('')
const loading = ref(true)

const badgeClass = {
  good: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  caution: 'bg-amber-50 text-amber-700 border-amber-100',
  bad: 'bg-rose-50 text-rose-700 border-rose-100',
}

onMounted(async () => {
  try {
    weather.value = await fetchCurrentWeather()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="max-w-lg mx-auto space-y-4">
    <div>
      <h2 class="text-2xl font-bold tracking-tight text-slate-900">🌦️ 구미·경북 여행 날씨</h2>
      <p class="text-slate-500 text-sm">Open-Meteo 기반 실시간 날씨와 여행 적합도를 확인하세요.</p>
    </div>

    <div v-if="loading" class="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-10 text-center text-slate-400">
      날씨 정보를 불러오는 중...
    </div>
    <div v-else-if="error" class="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-10 text-center text-rose-500">
      {{ error }}
    </div>
    <div v-else class="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-8 text-center space-y-3">
      <p class="text-5xl">{{ weather.weatherEmoji }}</p>
      <p class="text-4xl font-black text-slate-900">{{ weather.temperature }}℃</p>
      <p class="text-slate-500 text-sm">
        {{ weather.weatherLabel }} · 풍속 {{ weather.windSpeed }}km/h · 강수량 {{ weather.precipitation }}mm
      </p>
      <span :class="['inline-block text-xs font-bold px-3 py-1 rounded-full border', badgeClass[weather.suitability.level]]">
        {{ weather.suitability.label }}
      </span>
      <p class="text-sm text-slate-600 pt-2">{{ weather.suitability.reason }}</p>
      <p class="text-[11px] text-slate-400 pt-3">기준 시각: {{ weather.observedAt }} · 출처: {{ weather.source }}</p>
    </div>
  </div>
</template>
