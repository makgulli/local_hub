/**
 * weatherService.js
 * ------------------------------------------------------------------
 * [참고 2] 선택 기능 - "날씨 정보 연동" 구현 모듈
 * (3_아이디어도출/4_MVP정의 실습기획서에서 최종 "선정"된 선택 기능)
 *
 * - 외부 날씨 API를 연동하여 권역별 현재 날씨 및 여행 적합 여부를 표시한다.
 * - API: Open-Meteo (https://open-meteo.com) — 별도 API 키·과금 없이 사용 가능한
 *   무료 공개 API로, "제공 API 키 예산 범위 내 운영" 제약(RFP II-2)을 위반하지
 *   않도록 의도적으로 선택하였다. 상업적 이용 시 라이선스는 CC BY 4.0.
 *   (출처 표기 필요: Weather data by Open-Meteo.com)
 */

const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

// 선정 권역(구미/경북) 대표 좌표: 구미시청 인근
const GGB_COORDS = { lat: 36.1195, lon: 128.3446 }

// WMO Weather interpretation codes (Open-Meteo 공식 문서 기준)
const WEATHER_CODE_MAP = {
  0: { label: '맑음', emoji: '☀️' },
  1: { label: '대체로 맑음', emoji: '🌤️' },
  2: { label: '구름 조금', emoji: '⛅' },
  3: { label: '흐림', emoji: '☁️' },
  45: { label: '안개', emoji: '🌫️' },
  48: { label: '짙은 안개', emoji: '🌫️' },
  51: { label: '약한 이슬비', emoji: '🌦️' },
  53: { label: '이슬비', emoji: '🌦️' },
  55: { label: '강한 이슬비', emoji: '🌧️' },
  61: { label: '약한 비', emoji: '🌧️' },
  63: { label: '비', emoji: '🌧️' },
  65: { label: '강한 비', emoji: '🌧️' },
  71: { label: '약한 눈', emoji: '🌨️' },
  73: { label: '눈', emoji: '🌨️' },
  75: { label: '강한 눈', emoji: '❄️' },
  80: { label: '소나기', emoji: '🌦️' },
  81: { label: '강한 소나기', emoji: '🌧️' },
  82: { label: '매우 강한 소나기', emoji: '⛈️' },
  95: { label: '뇌우', emoji: '⛈️' },
}

function describeWeatherCode(code) {
  return WEATHER_CODE_MAP[code] ?? { label: '알 수 없음', emoji: '❔' }
}

/** 아주 단순한 규칙 기반 "여행 적합도" 판정 (RFP 참고2 "여행 적합 여부 표시") */
function judgeTravelSuitability({ weatherCode, temperature, windSpeed, precipitation }) {
  if ([65, 75, 82, 95].includes(weatherCode) || precipitation >= 5) {
    return { level: 'bad', label: '여행 비추천', reason: '강한 강수/뇌우가 예상됩니다.' }
  }
  if ([61, 63, 71, 73, 80, 81].includes(weatherCode) || precipitation >= 1) {
    return { level: 'caution', label: '주의', reason: '비/눈 소식이 있어 우산 등을 준비하세요.' }
  }
  if (temperature <= -5 || temperature >= 33 || windSpeed >= 40) {
    return { level: 'caution', label: '주의', reason: '기온·풍속이 야외활동에 부담될 수 있어요.' }
  }
  return { level: 'good', label: '여행하기 좋은 날씨', reason: '야외 활동에 무리가 없습니다.' }
}

/** 구미/경북 권역 현재 날씨 조회 */
export async function fetchCurrentWeather({ lat, lon } = GGB_COORDS) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,wind_speed_10m,precipitation,weather_code',
    timezone: 'Asia/Seoul',
  })

  const res = await fetch(`${WEATHER_URL}?${params.toString()}`)
  if (!res.ok) throw new Error(`날씨 정보를 불러오지 못했습니다 (${res.status})`)

  const data = await res.json()
  const c = data.current

  const weather = describeWeatherCode(c.weather_code)
  const suitability = judgeTravelSuitability({
    weatherCode: c.weather_code,
    temperature: c.temperature_2m,
    windSpeed: c.wind_speed_10m,
    precipitation: c.precipitation,
  })

  return {
    temperature: c.temperature_2m,
    windSpeed: c.wind_speed_10m,
    precipitation: c.precipitation,
    weatherLabel: weather.label,
    weatherEmoji: weather.emoji,
    observedAt: c.time,
    suitability,
    source: 'Open-Meteo.com',
  }
}

export { GGB_COORDS }
