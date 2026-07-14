<script setup>
import { usePayPlannerStore } from '@/stores/payPlanner'
import { formatWon } from '@/services/payPlannerService'

const store = usePayPlannerStore()

function onSearchInput(e) {
  store.setKeyword(e.target.value)
}
</script>

<template>
  <!-- 접힌 상태: 화면 왼쪽 가장자리에 붙는 탭 -->
  <button
    v-if="!store.isOpen"
    class="tab"
    aria-label="페이플래너 열기"
    @click="store.toggle"
  >
    💸 페이플래너
  </button>

  <!-- 펼친 상태: 사이드 배너 -->
  <aside v-else class="panel card">
    <header class="panel-header">
      <span>페이플래너</span>
      <button class="close-btn" aria-label="닫기" @click="store.toggle">✕</button>
    </header>

    <p class="desc">현재 위치 기준, 목적지까지 예상 이동수단 요금을 알려드려요.</p>

    <div class="origin-box">
      <p class="label">출발지</p>
      <p v-if="store.originStatus === 'loading'" class="value muted">위치 확인 중...</p>
      <p v-else class="value">
        📍 {{ store.origin?.label ?? '위치 정보 없음' }}
        <span v-if="store.originStatus === 'denied'" class="hint">(위치 권한이 없어 구미시청 기준으로 계산해요)</span>
      </p>
      <button
        v-if="store.originStatus === 'denied' || store.originStatus === 'unsupported'"
        class="btn btn-ghost retry-btn"
        @click="store.requestLocation"
      >
        내 위치로 다시 시도
      </button>
    </div>

    <div class="field">
      <label for="pp-search">목적지 검색</label>
      <input
        id="pp-search"
        type="text"
        placeholder="장소명을 입력하세요 (예: 금오산)"
        :value="store.keyword"
        @input="onSearchInput"
      />
    </div>

    <ul class="candidate-list" v-if="store.candidates.length">
      <li
        v-for="item in store.candidates"
        :key="item.contentid"
        class="candidate"
        :class="{ active: store.destination?.contentid === item.contentid }"
        @click="store.selectDestination(item)"
      >
        <span class="c-title">{{ item.title }}</span>
        <span class="c-type">{{ item.typeLabel }}</span>
      </li>
    </ul>
    <p v-else class="empty">불러온 장소 데이터가 없어요. public/data 폴더를 확인해주세요.</p>

    <div v-if="store.destination && store.result" class="result-box">
      <p class="result-dest">🎯 {{ store.destination.title }}</p>
      <p class="result-dist">
        예상 거리 약 {{ store.result.roadKm }}km
        <span class="hint">(직선거리 {{ store.result.straightKm }}km 기준 추정치)</span>
      </p>

      <div class="fare-row">
        <span>🚕 택시</span>
        <strong>{{ formatWon(store.result.taxi.fare) }}</strong>
      </div>
      <p v-if="store.result.taxi.night" class="hint">심야 할증(22시~04시) 반영됨</p>

      <div class="fare-row">
        <span>🚌 시내버스</span>
        <strong>{{ formatWon(store.result.bus.fare) }}</strong>
      </div>

      <p class="disclaimer">
        ※ 실제 도로 경로가 아닌 좌표 간 직선거리를 보정한 추정치이며, 실제 요금과 다를 수 있어요.
      </p>
    </div>
    <div v-else-if="store.destination" class="empty">
      선택한 장소의 위치 정보가 없어 요금을 계산할 수 없어요.
    </div>
  </aside>
</template>

<style scoped>
.tab {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg) translateX(50%);
  transform-origin: left center;
  background: var(--color-sunset);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 0 0 8px 8px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: var(--shadow-1);
  z-index: 40;
  white-space: nowrap;
}

.panel {
  position: fixed;
  left: 0;
  top: 76px;
  bottom: 16px;
  width: 300px;
  display: flex;
  flex-direction: column;
  z-index: 40;
  border-radius: 0 var(--radius) var(--radius) 0;
  overflow: hidden;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-sunset);
  color: #fff;
  font-weight: 700;
  font-size: 14px;
}
.close-btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 14px;
}
.desc {
  padding: 12px 16px 0;
  font-size: 12px;
  color: var(--color-ink-soft);
  margin: 0;
}
.origin-box {
  padding: 12px 16px;
}
.label {
  font-size: 11px;
  color: var(--color-ink-soft);
  margin: 0 0 4px;
}
.value {
  font-size: 13px;
  margin: 0;
}
.muted { color: var(--color-ink-soft); }
.hint {
  font-size: 11px;
  color: var(--color-ink-soft);
}
.retry-btn {
  margin-top: 6px;
  padding: 4px 10px;
  font-size: 11px;
}

.field {
  padding: 0 16px;
  margin-bottom: 8px;
}
.field label {
  font-size: 11px;
}
.field input {
  font-size: 13px;
  padding: 8px 10px;
}

.candidate-list {
  list-style: none;
  margin: 0;
  padding: 0 8px;
  overflow-y: auto;
  flex: 1;
}
.candidate {
  padding: 8px 8px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  cursor: pointer;
}
.candidate:hover {
  background: var(--color-paper-dim);
}
.candidate.active {
  background: var(--color-paper-dim);
  border: 1px solid var(--color-sunset);
}
.c-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.c-type {
  font-size: 11px;
  color: var(--color-river);
  flex-shrink: 0;
  margin-left: 6px;
}

.empty {
  padding: 12px 16px;
  font-size: 12px;
  color: var(--color-ink-soft);
}

.result-box {
  margin: 8px 16px 16px;
  padding: 12px;
  background: var(--color-paper-dim);
  border-radius: 8px;
}
.result-dest {
  font-weight: 700;
  margin: 0 0 4px;
  font-size: 13px;
}
.result-dist {
  font-size: 12px;
  color: var(--color-ink-soft);
  margin: 0 0 10px;
}
.fare-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 4px 0;
}
.disclaimer {
  font-size: 10px;
  color: var(--color-ink-soft);
  margin: 8px 0 0;
  line-height: 1.5;
}

@media (max-width: 700px) {
  .panel {
    width: calc(100vw - 32px);
  }
}
</style>
