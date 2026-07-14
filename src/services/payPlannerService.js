/**
 * payPlannerService.js
 * ------------------------------------------------------------------
 * 선택 기능 - "페이플래너" (실습기획서 4_MVP정의 탭에서 "선정"됨)
 * "사이드배너를 활용한 이동수단 요금 책정 계산 기능"
 *
 * - 거리 계산: Kakao Maps Directions API 대신 좌표 간 직선거리(Haversine)를 사용한다.
 *   Kakao Maps는 앱 키 발급·쿼터 관리가 필요해 "제공 API 키 예산 범위 내 운영"
 *   제약(RFP II-2) 및 "예산 초과 불가" 원칙과 부딪힐 수 있어, weatherService.js와
 *   동일한 이유로 키가 필요 없는 계산 방식을 기본값으로 선택했다.
 *   (실제 도로 경로 거리가 아닌 직선거리 기준 추정치임을 UI에 항상 표기)
 * - 요금 산정: 국토교통부 공시 서울/경기 택시요금 체계를 단순화한 근사 알고리즘
 *   (기본요금 + 거리비례 + 심야 할증), 시내버스는 지자체 단일 요금을 상수로 사용.
 * - 팀에서 Kakao Maps API 키를 발급받으면 estimateDistanceKm()만 카카오 길찾기
 *   API 호출로 교체하면 되도록 함수를 분리해두었다.
 */

// 선정 권역(구미/경북) 대표 좌표: 구미시청 인근 (weatherService.js와 동일 기준점)
export const DEFAULT_ORIGIN = { lat: 36.1195, lon: 128.3446, label: '구미시청 (기본 위치)' }

/** 두 좌표 간 직선거리(km) — Haversine 공식 */
export function haversineDistanceKm(a, b) {
  const R = 6371 // 지구 반지름(km)
  const toRad = (deg) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return R * c
}

/** 직선거리 → 실제 도로 주행거리 근사치 (도심 평균 우회계수 1.3 적용) */
function toRoadDistanceKm(straightKm) {
  return straightKm * 1.3
}

const TAXI_BASE_FARE = 4800 // 기본요금(원), 1.6km 까지
const TAXI_BASE_KM = 1.6
const TAXI_PER_100M = 135 // 이후 132m당 요금 → 100m 기준으로 단순화
const NIGHT_SURCHARGE_RATE = 0.2 // 22시~04시 심야 할증 약 20%
const BUS_FARE = 1500 // 구미/경북 시내버스 단일 요금(원, 근사치)

function isNightTime(date = new Date()) {
  const h = date.getHours()
  return h >= 22 || h < 4
}

/** 택시 요금 추정 */
export function estimateTaxiFare(roadDistanceKm, { at = new Date() } = {}) {
  const extraKm = Math.max(0, roadDistanceKm - TAXI_BASE_KM)
  const extraFare = Math.ceil((extraKm * 1000) / 100) * TAXI_PER_100M
  let fare = TAXI_BASE_FARE + extraFare
  const night = isNightTime(at)
  if (night) fare = Math.round(fare * (1 + NIGHT_SURCHARGE_RATE))
  return { fare, night }
}

/** 시내버스 요금 (거리 무관 단일 요금 근사치) */
export function estimateBusFare() {
  return BUS_FARE
}

/**
 * 출발지 → 목적지 이동수단별 예상 비용을 계산한다.
 * @param {{lat:number, lon:number}} origin
 * @param {{lat:number, lon:number}} destination
 */
export function estimateTravelCost(origin, destination) {
  const straightKm = haversineDistanceKm(origin, destination)
  const roadKm = toRoadDistanceKm(straightKm)
  const taxi = estimateTaxiFare(roadKm)
  const bus = estimateBusFare()

  return {
    straightKm: Number(straightKm.toFixed(2)),
    roadKm: Number(roadKm.toFixed(2)),
    taxi: { fare: taxi.fare, night: taxi.night },
    bus: { fare: bus },
    isEstimate: true,
    method: 'haversine', // 'kakao'로 교체 가능하도록 표시
  }
}

export function formatWon(n) {
  return `${n.toLocaleString('ko-KR')}원`
}
