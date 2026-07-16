<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
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
  <div class="mx-auto max-w-5xl space-y-5 sm:space-y-6">
    <section class="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 p-6 text-white shadow-2xl sm:p-8 lg:p-10">
      <div class="absolute -top-12 -right-12 h-72 w-72 rounded-full bg-red-600/10 blur-[120px]"></div>
      <div class="absolute -bottom-12 -left-12 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px]"></div>

      <div class="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div class="max-w-2xl space-y-2 sm:space-y-3">
          <p class="text-sm font-semibold uppercase tracking-[0.3em] text-[#FF6467]">오늘의 여행 날씨</p>
          <h2 class="text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">구미·경북 여행 날씨</h2>
          <p class="text-sm leading-relaxed text-slate-300 sm:text-base">실시간 날씨와 여행 적합도를 한눈에 확인하세요.</p>
        </div>

        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <RouterLink to="/" class="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
            <i class="fa-solid fa-arrow-left"></i> 홈으로 돌아가기
          </RouterLink>
          <span class="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-xs font-semibold text-slate-200">Open-Meteo</span>
        </div>
      </div>
    </section>

    <section v-if="loading" class="rounded-[2rem] border border-slate-200/60 bg-white p-8 text-center text-slate-400 shadow-sm sm:p-10">
      날씨 정보를 불러오는 중...
    </section>
    <section v-else-if="error" class="rounded-[2rem] border border-rose-100 bg-rose-50 p-8 text-center text-rose-500 shadow-sm sm:p-10">
      {{ error }}
    </section>
    <section v-else class="rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm sm:p-8">
      <div class="grid gap-5 sm:gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
        <div class="space-y-5">
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-100 text-4xl sm:h-16 sm:w-16 sm:text-5xl">{{ weather.weatherEmoji }}</div>
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-slate-500">현재 기온</p>
              <p class="text-3xl font-black text-slate-900 sm:text-4xl">{{ weather.temperature }}℃</p>
            </div>
          </div>

          <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
            <p class="text-sm text-slate-600">{{ weather.weatherLabel }}</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="text-sm font-semibold text-slate-700">여행 적합도</span>
              <span :class="['inline-block rounded-full border px-3 py-1 text-xs font-bold', badgeClass[weather.suitability.level]]">
                {{ weather.suitability.label }}
              </span>
            </div>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">{{ weather.suitability.reason }}</p>
          </div>
        </div>

        <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 sm:p-6">
          <div class="space-y-4">
            <div class="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span class="text-sm text-slate-500">풍속</span>
              <span class="text-sm font-semibold text-slate-900">{{ weather.windSpeed }}km/h</span>
            </div>
            <div class="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span class="text-sm text-slate-500">강수량</span>
              <span class="text-sm font-semibold text-slate-900">{{ weather.precipitation }}mm</span>
            </div>
            <div class="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">기준 시각</p>
              <p class="mt-1 text-sm font-semibold text-slate-900">{{ weather.observedAt }}</p>
            </div>
            <div class="rounded-2xl bg-white px-4 py-3 shadow-sm">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">출처</p>
              <p class="mt-1 text-sm font-semibold text-slate-900">{{ weather.source }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
