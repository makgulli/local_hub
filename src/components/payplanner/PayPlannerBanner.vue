<script setup>
import { usePayPlannerStore } from '@/stores/payPlanner'
import { formatWon } from '@/services/payPlannerService'

const store = usePayPlannerStore()

const badgeClass = {
  good: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  caution: 'bg-amber-50 text-amber-700 border-amber-100',
  bad: 'bg-rose-50 text-rose-700 border-rose-100',
}

function onSearchInput(e) {
  store.setKeyword(e.target.value)
}
</script>

<template>
  <!-- 접힌 상태: 화면 왼쪽 가장자리에 붙는 탭 -->
  <button
    v-if="!store.isOpen"
    class="fixed left-0 top-1/2 -translate-y-1/2 -rotate-90 origin-left translate-x-1/2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold px-4 py-2.5 rounded-b-xl shadow-lg z-40 whitespace-nowrap transition-colors"
    aria-label="페이플래너 열기"
    @click="store.toggle"
  >
    <i class="fa-solid fa-coins mr-1"></i> 페이플래너
  </button>

  <!-- 펼친 상태: 사이드 배너 -->
  <aside v-else class="fixed left-0 top-20 bottom-4 w-[300px] bg-white shadow-2xl border border-slate-200/60 rounded-r-3xl flex flex-col overflow-hidden z-40">
    <header class="bg-amber-500 text-white px-5 py-4 flex items-center justify-between shadow-md">
      <span class="font-bold text-sm"><i class="fa-solid fa-coins mr-1.5"></i>페이플래너</span>
      <button class="text-amber-100 hover:text-white text-lg font-bold" aria-label="닫기" @click="store.toggle">×</button>
    </header>

    <div class="p-4 space-y-4 overflow-y-auto flex-1">
      <p class="text-xs text-slate-500">현재 위치 기준, 목적지까지 예상 이동수단 요금을 알려드려요.</p>

      <div class="bg-slate-50 rounded-2xl p-3 space-y-1.5">
        <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">출발지</p>
        <p v-if="store.originStatus === 'loading'" class="text-sm text-slate-400">위치 확인 중...</p>
        <p v-else class="text-sm text-slate-700">
          📍 {{ store.origin?.label ?? '위치 정보 없음' }}
        </p>
        <p v-if="store.originStatus === 'denied'" class="text-[11px] text-slate-400">위치 권한이 없어 구미시청 기준으로 계산해요</p>
        <button
          v-if="store.originStatus === 'denied' || store.originStatus === 'unsupported'"
          @click="store.requestLocation"
          class="text-[11px] font-bold text-amber-600 hover:underline"
        >
          내 위치로 다시 시도
        </button>
      </div>

      <div>
        <label class="block text-[11px] font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">목적지 검색</label>
        <input
          type="text"
          placeholder="장소명을 입력하세요 (예: 금오산)"
          :value="store.keyword"
          class="w-full border border-slate-200 rounded-2xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          @input="onSearchInput"
        />
      </div>

      <ul v-if="store.candidates.length" class="space-y-1">
        <li
          v-for="item in store.candidates"
          :key="item.contentid"
          @click="store.selectDestination(item)"
          :class="[
            'flex items-center justify-between px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors',
            store.destination?.contentid === item.contentid
              ? 'bg-amber-50 border border-amber-200'
              : 'hover:bg-slate-50',
          ]"
        >
          <span class="truncate">{{ item.title }}</span>
          <span class="text-[10px] text-emerald-600 font-semibold flex-shrink-0 ml-2">{{ item.typeLabel }}</span>
        </li>
      </ul>
      <p v-else class="text-xs text-slate-400">불러온 장소 데이터가 없어요. public/data 폴더를 확인해주세요.</p>

      <div v-if="store.destination && store.result" class="bg-amber-50 rounded-2xl p-4 space-y-2 border border-amber-100">
        <p class="font-bold text-sm text-slate-900">🎯 {{ store.destination.title }}</p>
        <p class="text-xs text-slate-500">
          예상 거리 약 {{ store.result.roadKm }}km
          <span class="text-slate-400">(직선거리 {{ store.result.straightKm }}km 기준 추정치)</span>
        </p>

        <div class="flex items-center justify-between text-sm pt-2">
          <span>🚕 택시</span>
          <strong>{{ formatWon(store.result.taxi.fare) }}</strong>
        </div>
        <p v-if="store.result.taxi.night" class="text-[10px] text-slate-400">심야 할증(22시~04시) 반영됨</p>

        <div class="flex items-center justify-between text-sm">
          <span>🚌 시내버스</span>
          <strong>{{ formatWon(store.result.bus.fare) }}</strong>
        </div>

        <p class="text-[10px] text-slate-400 pt-2 leading-relaxed">
          ※ 실제 도로 경로가 아닌 좌표 간 직선거리를 보정한 추정치이며, 실제 요금과 다를 수 있어요.
        </p>
      </div>
      <div v-else-if="store.destination" class="text-xs text-slate-400">
        선택한 장소의 위치 정보가 없어 요금을 계산할 수 없어요.
      </div>
    </div>
  </aside>
</template>
