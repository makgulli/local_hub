const BASE_URL = `${import.meta.env.BASE_URL}data/`

const cache = new Map()

export async function loadInfluencerRoutes() {
  const cacheKey = 'influencer_routes'
  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const res = await fetch(`${BASE_URL}influencer_routes.json`)
  if (!res.ok) {
    throw new Error(`인플루트 데이터를 불러오지 못했습니다. public/data/ 폴더를 확인하세요.`)
  }

  const json = await res.json()
  const items = Array.isArray(json.routes) ? json.routes : []
  cache.set(cacheKey, items)
  return items
}

export function getUniqueTags(routes) {
  return [...new Set(routes.flatMap((route) => route.tags ?? []))]
}

export function filterRoutesByTag(routes, tag) {
  if (!tag) return routes
  return routes.filter((route) => (route.tags ?? []).includes(tag))
}

export function sortRoutesByScore(routes, direction = 'desc') {
  return [...routes].sort((a, b) => {
    if (direction === 'asc') return a.score - b.score
    return b.score - a.score
  })
}

export function searchRoutes(routes, query) {
  if (!query?.trim()) return routes
  const keyword = query.trim().toLowerCase()
  return routes.filter((route) => {
    const searchable = [
      route.title,
      route.influencer,
      route.description,
      ...(route.points ?? []),
    ]

    return searchable.some((value) =>
      String(value).toLowerCase().includes(keyword)
    )
  })
}
