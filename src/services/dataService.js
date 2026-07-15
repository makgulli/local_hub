/**
 * dataService.js
 * ------------------------------------------------------------------
 * RFP(개발 의뢰서) III-1 "제공 데이터 활용" 대응 모듈
 *
 * - 별도 백엔드 서버 없이, 회사가 사전 수집·가공하여 제공한 JSON 파일을
 *   프론트엔드에서 직접 fetch 하여 사용한다. (public/data/ 에 위치)
 * - 파일 구조/필드는 SCHEMA.md 를 따른다.
 * - 출처·라이선스 정보는 SOURCE.md, docs/DATA_SOURCES.md 참고.
 *
 * ⚠️ 실제 JSON 데이터 파일은 팀(발신처)에서 별도로 전달받아
 *    public/data/ 폴더에 아래 파일명 그대로 넣어야 정상 동작한다.
 *    (본 리포지토리에는 원본 데이터가 포함되어 있지 않음)
 */

import { contentTypeLabel } from '@/constants/contentType'

// SOURCE.md > "수집 파일 목록" 과 동일한 파일명을 사용한다.
const DATA_FILES = {
  '12': '구미_경북권_관광지.json',
  '14': '구미_경북권_문화시설.json',
  '15': '구미_경북권_축제공연행사.json',
  '25': '구미_경북권_여행코스.json',
  '28': '구미_경북권_레포츠.json',
  '32': '구미_경북권_숙박.json',
  '38': '구미_경북권_쇼핑.json',
  '39': '구미_경북권_음식점.json',
}

const category = {
  slug: 'sports', label:'레포츠', fileName: '구미_경북권_레포츠.json'
}

const BASE_URL = `${import.meta.env.BASE_URL}data/`

/** contentTypeId 별 fetch 결과 캐시 (SPA 세션 동안 재요청 방지) */
const cache = new Map()

/**
 * 지정한 contentTypeId 의 JSON 파일을 불러온다.
 * SCHEMA.md 최상위 구조: { region, contentType, contentTypeId, total, items[] }
 */
export async function loadContentType(contentTypeId) {
  const key = String(contentTypeId)
  if (cache.has(key)) return cache.get(key)

  const file = DATA_FILES[key]
  if (!file) throw new Error(`알 수 없는 contentTypeId: ${key}`)

  const res = await fetch(`${BASE_URL}${file}`)
  if (!res.ok) {
    throw new Error(
      `데이터 파일을 불러오지 못했습니다: ${file} (${res.status}). ` +
        `public/data/ 폴더에 파일이 있는지 확인하세요.`
    )
  }
  const json = await res.json()

  // mapx/mapy 는 SCHEMA.md 상 string → 사용 편의를 위해 number 필드 추가
  json.items = (json.items ?? []).map((item) => ({
    ...item,
    lat: item.mapy ? Number(item.mapy) : null,
    lng: item.mapx ? Number(item.mapx) : null,
    hasImage: Boolean(item.firstimage),
    typeLabel: contentTypeLabel(item.contenttypeid),
  }))

  cache.set(key, json)
  return json
}

/** 여러 contentType 을 한 번에 로드 */
export async function loadContentTypes(ids) {
  const results = await Promise.allSettled(ids.map(loadContentType))
  return results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value.items)
}

/** 전체 8종 데이터를 모두 로드 (홈 화면 요약, 챗봇 컨텍스트용) */
export async function loadAllItems() {
  return loadContentTypes(Object.keys(DATA_FILES))
}

/** contentid 로 단일 항목 조회 */
export async function findItemById(contentTypeId, contentId) {
  const { items } = await loadContentType(contentTypeId)
  return items.find((i) => i.contentid === contentId) ?? null
}

/**
 * 아주 단순한 키워드 검색 (title, addr1 대상)
 * 챗봇의 "제공 JSON 데이터 기반 자연어 질의응답" 컨텍스트 검색에도 재사용된다.
 */
export function searchItems(items, keyword, limit = 8) {
  if (!keyword?.trim()) return []
  const kw = keyword.trim().toLowerCase()
  return items
    .filter(
      (i) =>
        i.title?.toLowerCase().includes(kw) ||
        i.addr1?.toLowerCase().includes(kw)
    )
    .slice(0, limit)
}

export { DATA_FILES }
