/**
 * boardService.js
 * ------------------------------------------------------------------
 * RFP(개발 의뢰서) III-2 "커뮤니티 기능(CRUD) 구현" 대응 모듈
 * teamproject.html 프로토타입의 게시글 스키마(id/author/title/content/password/date)를
 * 그대로 따른다 — 별도 카테고리 없이 익명 닉네임 기반 단일 소통망.
 *
 * - 별도 회원가입/로그인 없는 익명 게시판.
 * - 게시글은 브라우저 localStorage 에 저장한다. (다른 사용자와 공유되지 않음)
 * - 작성 시 입력한 "수정용 비밀번호"를 게시글과 함께 저장하고,
 *   수정/삭제 시 입력값과 일치 여부만 프론트엔드에서 비교한다.
 * - ⚠️ 별도 서버가 없어 비밀번호는 암호화 없이 저장·비교된다.
 *   이는 보안을 위한 설계가 아니라 "교육 목적의 의도된 설계"이다(RFP III-2-나).
 *   실서비스라면 반드시 서버 측 해시 저장이 필요하다.
 */

const STORAGE_KEY = 'localhub_v2_posts' // teamproject.html 프로토타입과 동일한 키 사용

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

function today() {
  return new Date().toISOString().slice(0, 10)
}

/** 전체 게시글 (최신순) */
export function listPosts() {
  return readAll().sort((a, b) => b.id - a.id)
}

/** 검색 (제목/내용/작성자 대상) — teamproject.html filteredPosts와 동일 로직 */
export function searchPosts(keyword) {
  const posts = listPosts()
  if (!keyword?.trim()) return posts
  const kw = keyword.trim().toLowerCase()
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(kw) ||
      p.content.toLowerCase().includes(kw) ||
      p.author.toLowerCase().includes(kw)
  )
}

/** 상세 조회 */
export function getPost(id) {
  return readAll().find((p) => p.id === id) ?? null
}

/** 게시글 작성 */
export function createPost({ author, title, content, password }) {
  if (!author?.trim() || !title?.trim() || !content?.trim()) {
    throw new Error('모든 입력 항목을 빠짐없이 채워주세요.')
  }
  if (!password || password.length !== 4 || Number.isNaN(Number(password))) {
    throw new Error('비밀번호는 숫자 4자리를 정확히 입력해주세요.')
  }

  const posts = readAll()
  const post = {
    id: Date.now(),
    author: author.trim(),
    title: title.trim(),
    content: content.trim(),
    password,
    date: today(),
  }
  posts.unshift(post)
  writeAll(posts)
  return post
}

/** 비밀번호 확인 (수정/삭제 전 검증용) */
export function verifyPassword(id, password) {
  const post = readAll().find((p) => p.id === id)
  return Boolean(post) && post.password === password
}

/** 게시글 수정 (작성자/제목/내용만 변경, 비밀번호는 최초 등록값 유지) */
export function updatePost(id, { author, title, content }) {
  const posts = readAll()
  const idx = posts.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error('게시글을 찾을 수 없습니다.')

  posts[idx] = {
    ...posts[idx],
    author: author.trim(),
    title: title.trim(),
    content: content.trim(),
  }
  writeAll(posts)
  return posts[idx]
}

/** 게시글 삭제 */
export function deletePost(id) {
  const posts = readAll().filter((p) => p.id !== id)
  writeAll(posts)
  return true
}

/** 최근 게시글 N개 (홈 화면용) */
export function recentPosts(limit = 3) {
  return listPosts().slice(0, limit)
}
