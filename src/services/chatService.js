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

const SYSTEM_PROMPT = `
당신은 구미·경북 관광 안내 챗봇입니다.
짧고 친절한 한국어로 답하세요.
`

/**
 * 챗봇 응답을 생성한다.
 * @param {string} question 사용자 질문
 * @param {{role:'user'|'assistant', content:string}[]} history 이전 대화 이력 (대화 히스토리 유지용)
 */
export async function askChatbot(question, history = []) {
  try {
    const apiKey = getApiKey()
    const context = await buildContext(question)

    const messages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\n[참고 데이터]\n${context}` },
      ...history.slice(-6),
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
  max_completion_tokens: 600,      // 100 → 600 (추론+답변 합산 예산)
  reasoning_effort: 'low',         // gpt-5 계열 추론 모델의 내부 추론량 축소 옵션
}),

    })

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(
        `API 오류 (${res.status}): ${errBody?.error?.message || '알 수 없는 오류'}`
      )
    }

    const data = await res.json()
const choice = data?.choices?.[0]

if (choice?.finish_reason === 'length' && !choice?.message?.content) {
  throw new Error(
    '모델이 추론 토큰을 모두 소진해 답변을 생성하지 못했습니다. max_completion_tokens 값을 늘려주세요.'
  )
}

if (!choice?.message?.content) {
  throw new Error(`응답 포맷이 비정상입니다: ${JSON.stringify(data).slice(0, 500)}`)
}


    const text = normalizeResponseContent(data.choices[0].message.content)

    if (!text) {
      throw new Error(`응답 텍스트가 비어 있습니다: ${JSON.stringify(data).slice(0, 500)}`)
    }

    return text
  } catch (e) {
    console.error('[chatService] askChatbot error:', e)
    throw new Error(e?.message || '챗봇 응답 생성 중 오류가 발생했습니다.')
  }
}

function normalizeResponseContent(content) {
  if (typeof content === 'string') return content.trim()

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part
        if (part?.type === 'text' && typeof part.text === 'string') return part.text
        return ''
      })
      .join('')
      .trim()
  }

  if (content && typeof content === 'object') {
    if (typeof content.text === 'string') return content.text.trim()
    if (typeof content.value === 'string') return content.value.trim()
  }

  return ''
}


