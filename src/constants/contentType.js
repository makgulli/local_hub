/**
 * TourAPI 4.0 contentTypeId 코드 정의
 * 출처: SCHEMA.md (한국관광공사 Tour API 4.0 원본 데이터 스키마)
 */
export const CONTENT_TYPES = [
  { id: '12', label: '관광지', icon: '🏞️' },
  { id: '14', label: '문화시설', icon: '🏛️' },
  { id: '15', label: '축제공연행사', icon: '🎉' },
  { id: '25', label: '여행코스', icon: '🧭' },
  { id: '28', label: '레포츠', icon: '🚴' },
  { id: '32', label: '숙박', icon: '🏨' },
  { id: '38', label: '쇼핑', icon: '🛍️' },
  { id: '39', label: '음식점', icon: '🍽️' },
]

export const CONTENT_TYPE_MAP = Object.fromEntries(
  CONTENT_TYPES.map((t) => [t.id, t])
)

export function contentTypeLabel(id) {
  return CONTENT_TYPE_MAP[String(id)]?.label ?? '기타'
}

/**
 * 서비스 대상 권역
 * RFP(개발 의뢰서) II-2 항 기준 전국 5개 권역 중,
 * 3_아이디어도출/4_MVP정의 실습기획서에서 구미/경북(GGB) 1곳으로 확정.
 * 본 서비스는 구미/경북 데이터·화면만 다루며, 나머지 4개 권역 UI는 두지 않는다.
 */
export const SELECTED_REGION = 'GGB'
export const SELECTED_REGION_LABEL = '구미/경북'
