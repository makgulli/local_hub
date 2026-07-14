<script setup>
import { onMounted, ref } from 'vue'
import { fetchCurrentWeather } from '@/services/weatherService'
import { SELECTED_REGION_LABEL } from '@/constants/contentType'

const weather = ref(null)
const error = ref('')
const loading = ref(true)

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
  <section class="container weather-view">
    <p class="breadcrumb">홈 &gt; 날씨</p>
    <h1>{{ SELECTED_REGION_LABEL }} 여행 날씨</h1>

    <div v-if="loading" class="card empty">날씨 정보를 불러오는 중...</div>
    <div v-else-if="error" class="card empty">{{ error }}</div>
    <div v-else class="card weather-card">
      <p class="big">{{ weather.weatherEmoji }} {{ weather.temperature }}℃</p>
      <p class="sub">{{ weather.weatherLabel }} · 풍속 {{ weather.windSpeed }}km/h · 강수량 {{ weather.precipitation }}mm</p>
      <span class="badge" :class="`badge-${weather.suitability.level}`">
        {{ weather.suitability.label }}
      </span>
      <p class="reason">{{ weather.suitability.reason }}</p>
      <p class="source">기준 시각: {{ weather.observedAt }} · 출처: {{ weather.source }}</p>
    </div>
  </section>
</template>

<style scoped>
.weather-view {
  padding: 24px 20px 60px;
  max-width: 520px;
}
.breadcrumb {
  font-size: 12px;
  color: var(--color-ink-soft);
  margin: 0 0 8px;
}
.weather-card {
  padding: 28px;
  text-align: center;
}
.big {
  font-size: 40px;
  margin: 0;
}
.sub {
  color: var(--color-ink-soft);
  font-size: 14px;
  margin: 6px 0 16px;
}
.reason {
  font-size: 14px;
  margin: 12px 0 20px;
}
.source {
  font-size: 11px;
  color: var(--color-ink-soft);
}
.empty {
  padding: 40px;
  text-align: center;
  color: var(--color-ink-soft);
}
</style>
