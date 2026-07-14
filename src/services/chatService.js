/**
 * chatService.js
 * ------------------------------------------------------------------
 * RFP(개발 의뢰서) III-3 "챗봇 기능 구현" 대응 모듈
 *
 * - 별도 백엔드 없이 Vue3 프론트엔드에서 OpenAI API 를 직접 호출한다.
 * - API 키는 .env(VITE_OPENAI_API_KEY) 로 관리하며, 절대 커밋하지 않는다.
 * - ⚠️ Vite 의 VITE_ 접두사 환경변수는 빌드 결과물에 그대로 노출된다.
 *   반드시 "사용량 제한이 걸린" 키만 사용하고 결제 한도를 낮게 설정할 것
 *   (RFP III-3-가 주의사항).
 * - "제공 JSON 데이터 기반 자연어 지역 정보 질의응답"을 위해,
 *   질문과 관련된 항목을 dataService 로 검색해 프롬프트 컨텍스트로 주입하는
 *   경량 RAG(검색 후 생성) 방식을 사용한다. 전체 데이터를 매 요청마다
 *   전송하면 토큰 비용이 커지므로 지양한다.
 */

import { loadAllItems, searchItems } from './dataService'
import { SELECTED_REGION_LABEL } from '@/constants/contentType'

const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini'

function getApiKey() {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) {
    throw new Error(
      '.env 파일에 VITE_OPENAI_API_KEY 가 설정되어 있지 않습니다. .env.example 을 참고하세요.'
    )
  }
  return key
}

/** 사용자 질문에서 검색 키워드 후보를 단순 추출 (조사/불용어 제거는 최소화) */
function extractKeywords(question) {
  return question
    .replace(/[?!.,]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2)
    .slice(0, 5)
}

/** 질문과 관련된 공공데이터 항목을 찾아 챗봇 컨텍스트 문자열로 변환 */
async function buildContext(question) {
  const allItems = await loadAllItems()
  const keywords = extractKeywords(question)

  let matched = []
  for (const kw of keywords) {
    matched.push(...searchItems(allItems, kw, 5))
    if (matched.length >= 8) break
  }
  // 중복 제거
  const unique = Array.from(new Map(matched.map((i) => [i.contentid, i])).values()).slice(0, 8)

  if (unique.length === 0) return '(관련된 공공데이터 항목을 찾지 못했습니다.)'

  return unique
    .map(
      (i) =>
        `- [${i.typeLabel}] ${i.title} / 주소: ${i.addr1 || '정보 없음'} / 전화: ${i.tel || '정보 없음'}`
    )
    .join('\n')
}

const SYSTEM_PROMPT = `당신은 지역 정보 공유 커뮤니티 "LocalHub"의 챗봇입니다.
대상 권역은 "${SELECTED_REGION_LABEL}"이며, 한국관광공사 TourAPI 데이터를 기반으로
관광지 추천, 축제 일정, 맛집(모범음식점) 위치, 숙박, 쇼핑, 레포츠, 여행코스 등을 안내합니다.
아래 [참고 데이터]에 있는 내용을 우선 활용해 답하고, 참고 데이터에 없는 내용은
"제공된 데이터에는 없는 정보"라고 솔직히 밝힌 뒤 일반적인 안내만 제공하세요.
답변은 한국어로, 간결하고 친절하게 작성하세요.`

/**
 * 챗봇 응답을 생성한다.
 * @param {string} question 사용자 질문
 * @param {{role:'user'|'assistant', content:string}[]} history 이전 대화 이력 (대화 히스토리 유지용)
 */
export async function askChatbot(question, history = []) {
  const apiKey = getApiKey()
  const context = await buildContext(question)

  const messages = [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\n[참고 데이터]\n${context}` },
    ...history.slice(-6), // 최근 6턴만 유지 (토큰 절약)
    { role: 'user', content: question },
  ]

  const res = await fetch(OPENAI_CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 500,
    }),
  })

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}))
    throw new Error(errBody?.error?.message || `챗봇 API 호출 실패 (${res.status})`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? '응답을 생성하지 못했습니다.'
}
