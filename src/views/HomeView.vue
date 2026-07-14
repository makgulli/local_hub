<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import RiverDivider from '@/components/common/RiverDivider.vue'
import { SELECTED_REGION_LABEL } from '@/constants/contentType'
import { recentPosts, BOARD_CATEGORIES } from '@/services/boardService'
import { fetchCurrentWeather } from '@/services/weatherService'

const posts = ref([])
const weather = ref(null)
const weatherError = ref('')

function categoryLabel(code) {
  return BOARD_CATEGORIES.find((c) => c.code === code)?.label ?? code
}

onMounted(async () => {
  posts.value = recentPosts(5)
  try {
    weather.value = await fetchCurrentWeather()
  } catch (e) {
    weatherError.value = e.message
  }
})
</script>

<template>
  <section class="hero">
    <div class="container hero-inner">
      <p class="eyebrow">{{ SELECTED_REGION_LABEL }} 공공데이터 기반</p>
      <h1>지역 정보 공유 커뮤니티 LocalHub</h1>
      <p class="lead">{{ SELECTED_REGION_LABEL }}의 생생한 정보를 한눈에 만나보세요</p>
    </div>
    <RiverDivider class="hero-wave" />
  </section>

  <section class="container two-col">
    <div class="card recent-posts">
      <h2>최근 게시글</h2>
      <ul v-if="posts.length">
        <li v-for="p in posts" :key="p.id">
          <RouterLink :to="`/board/${p.id}`">
            <span class="tag">{{ categoryLabel(p.category) }}</span>
            {{ p.title }}
          </RouterLink>
        </li>
      </ul>
      <p v-else class="empty">아직 등록된 게시글이 없어요. 첫 글을 남겨보세요!</p>
      <RouterLink to="/board/write" class="btn btn-primary write-btn">+ 글쓰기</RouterLink>
    </div>

    <div class="card weather-card">
      <h2>오늘의 {{ SELECTED_REGION_LABEL }} 날씨</h2>
      <div v-if="weather" class="weather-body">
        <p class="weather-main">{{ weather.weatherEmoji }} {{ weather.temperature }}℃</p>
        <p class="weather-sub">{{ weather.weatherLabel }} · 풍속 {{ weather.windSpeed }}km/h</p>
        <span class="badge" :class="`badge-${weather.suitability.level}`">
          {{ weather.suitability.label }}
        </span>
        <p class="weather-reason">{{ weather.suitability.reason }}</p>
      </div>
      <p v-else-if="weatherError" class="empty">{{ weatherError }}</p>
      <p v-else class="empty">날씨 정보를 불러오는 중...</p>
      <RouterLink to="/weather" class="btn btn-ghost write-btn">자세히 보기</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.hero {
  background: linear-gradient(180deg, var(--color-river) 0%, var(--color-river-dark) 100%);
  color: #fff;
  padding: 56px 0 0;
}
.hero-inner {
  text-align: center;
  padding-bottom: 40px;
}
.eyebrow {
  font-size: 12px;
  letter-spacing: 0.08em;
  opacity: 0.8;
  margin-bottom: 8px;
}
.hero h1 {
  color: #fff;
  font-size: 32px;
}
.lead {
  opacity: 0.9;
  margin: 0;
}
.hero-wave {
  color: var(--color-paper);
  display: block;
}

.two-col {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
  margin: 40px auto 60px;
}
@media (max-width: 720px) {
  .two-col { grid-template-columns: 1fr; }
}

.card {
  padding: 20px;
}
.recent-posts ul {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
}
.recent-posts li {
  padding: 10px 0;
  border-bottom: 1px solid var(--color-line);
  font-size: 14px;
}
.recent-posts li:last-child { border-bottom: none; }
.tag {
  font-size: 11px;
  color: var(--color-river);
  border: 1px solid var(--color-river);
  border-radius: 999px;
  padding: 1px 8px;
  margin-right: 8px;
}
.empty {
  color: var(--color-ink-soft);
  font-size: 13px;
}
.write-btn {
  width: 100%;
}

.weather-main {
  font-size: 28px;
  margin: 0;
}
.weather-sub {
  color: var(--color-ink-soft);
  font-size: 13px;
  margin: 2px 0 10px;
}
.weather-reason {
  font-size: 13px;
  color: var(--color-ink-soft);
  margin: 8px 0 16px;
}
</style>
