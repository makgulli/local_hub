<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  item: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const kakaoMapUrl = computed(() => {
  if (!props.item) return ''
  const title = encodeURIComponent(props.item.title || '위치')
  if (props.item.lat && props.item.lng) {
    return `https://map.kakao.com/link/map/${title},${props.item.lat},${props.item.lng}`
  }
  return `https://map.kakao.com/link/search/${title}`
})
</script>

<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
    <div class="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden">
      <div class="p-5 border-b border-slate-200 flex items-start justify-between">
        <div>
          <h3 class="text-xl font-bold">{{ item?.title || '위치 정보' }}</h3>
          <p class="text-sm text-slate-500 mt-1">{{ item?.addr1 || '주소 정보 없음' }}</p>
        </div>
        <button @click="$emit('close')" class="text-slate-400 hover:text-slate-700">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="p-5 space-y-4">

        </div>

        <div class="rounded-3xl border border-slate-200 overflow-hidden">
          <iframe
            v-if="item?.lat && item?.lng"
            :src="`https://map.kakao.com/link/map/${encodeURIComponent(item.title || '위치')},${item.lat},${item.lng}`"
            class="w-full h-72 border-0"
            title="카카오 맵 위치 미리보기"
          />
          <div v-else class="p-5 text-sm text-slate-500">
            좌표 정보가 없으면 카카오맵 검색 링크를 이용하세요.
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 p-5 border-t border-slate-200 sm:flex-row sm:justify-end">
        <a
          :href="kakaoMapUrl"
          target="_blank"
          rel="noreferrer"
          class="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white text-center"
        >
          카카오맵에서 보기
        </a>
        <button
          @click="$emit('close')"
          class="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700"
        >
          닫기
        </button>
      </div>
    </div>
  </div>
</template>