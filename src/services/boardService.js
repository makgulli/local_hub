/**
 * boardService.js
 * ------------------------------------------------------------------
 * RFP(개발 의뢰서) III-2 "커뮤니티 기능(CRUD) 구현" 대응 모듈
 *
 * - 별도 회원가입/로그인 없는 익명 게시판.
 * - 게시글은 브라우저 localStorage 에 저장한다. (다른 사용자와 공유되지 않음)
 * - 작성 시 입력한 "수정용 비밀번호"를 게시글과 함께 저장하고,
 *   수정/삭제 시 입력값과 일치 여부만 프론트엔드에서 비교한다.
 * - ⚠️ 별도 서버가 없어 비밀번호는 암호화 없이 저장·비교된다.
 *   이는 보안을 위한 설계가 아니라 "교육 목적의 의도된 설계"이다(RFP III-2-나).
 *   실서비스라면 반드시 서버 측 해시 저장이 필요하다.
 */

const STORAGE_KEY = 'localhub:posts:ggb' // 구미/경북 권역 게시판 전용 키

export const BOARD_CATEGORIES = [
  { code: 'FREE', label: '자유' },
  { code: 'FOOD', label: '맛집 추천' },
  { code: 'TRAVEL', label: '여행 정보' },
  { code: 'QNA', label: '질문' },
  { code: 'ETC', label: '기타' },
]

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('게시글 데이터를 읽는 중 오류가 발생했습니다.', e)
    return []
  }
}

function writeAll(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/** 목록 조회 (카테고리 필터 + 검색어 + 페이지네이션) */
export function listPosts({ category = 'ALL', keyword = '', page = 1, pageSize = 10 } = {}) {
  let posts = readAll().sort((a, b) => b.createdAt - a.createdAt)

  if (category !== 'ALL') {
    posts = posts.filter((p) => p.category === category)
  }
  if (keyword.trim()) {
    const kw = keyword.trim().toLowerCase()
    posts = posts.filter(
      (p) => p.title.toLowerCase().includes(kw) || p.content.toLowerCase().includes(kw)
    )
  }

  const total = posts.length
  const start = (page - 1) * pageSize
  const items = posts
    .slice(start, start + pageSize)
    // 목록에서는 비밀번호를 내려주지 않는다.
    .map(({ password, ...rest }) => rest)

  return { items, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

/** 상세 조회 (조회수 +1) */
export function getPost(id, { countView = true } = {}) {
  const posts = readAll()
  const idx = posts.findIndex((p) => p.id === id)
  if (idx === -1) return null

  if (countView) {
    posts[idx].views = (posts[idx].views ?? 0) + 1
    writeAll(posts)
  }
  const { password, ...rest } = posts[idx]
  return rest
}

/** 게시글 작성 */
export function createPost({ category, title, content, password, nickname = '익명' }) {
  if (!title?.trim() || !content?.trim()) throw new Error('제목과 내용을 입력해주세요.')
  if (!/^\d{4,}$/.test(password ?? '')) throw new Error('비밀번호는 숫자 4자리 이상이어야 합니다.')

  const posts = readAll()
  const now = Date.now()
  const post = {
    id: genId(),
    category,
    title: title.trim(),
    content: content.trim(),
    password,
    nickname,
    views: 0,
    createdAt: now,
    updatedAt: now,
  }
  posts.push(post)
  writeAll(posts)
  const { password: _pw, ...rest } = post
  return rest
}

/** 비밀번호 확인 (수정/삭제 전 검증용) */
export function verifyPassword(id, password) {
  const post = readAll().find((p) => p.id === id)
  if (!post) return false
  return post.password === password
}

/** 게시글 수정 (비밀번호 일치 시에만) */
export function updatePost(id, { title, content, password }) {
  const posts = readAll()
  const idx = posts.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error('게시글을 찾을 수 없습니다.')
  if (posts[idx].password !== password) throw new Error('비밀번호가 일치하지 않습니다.')

  posts[idx] = {
    ...posts[idx],
    title: title.trim(),
    content: content.trim(),
    updatedAt: Date.now(),
  }
  writeAll(posts)
  const { password: _pw, ...rest } = posts[idx]
  return rest
}

/** 게시글 삭제 (비밀번호 일치 시에만) */
export function deletePost(id, password) {
  const posts = readAll()
  const idx = posts.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error('게시글을 찾을 수 없습니다.')
  if (posts[idx].password !== password) throw new Error('비밀번호가 일치하지 않습니다.')

  posts.splice(idx, 1)
  writeAll(posts)
  return true
}

/** 최근 게시글 N개 (홈 화면용) */
export function recentPosts(limit = 5) {
  return readAll()
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit)
    .map(({ password, ...rest }) => rest)
}
