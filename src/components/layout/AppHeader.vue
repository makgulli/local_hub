<script setup>
import { RouterLink } from 'vue-router'
import { SELECTED_REGION_LABEL } from '@/constants/contentType'
</script>

<template>
  <header class="header">
    <div class="container header-inner">
      <RouterLink to="/" class="logo">LocalHub</RouterLink>
      <span class="region-badge">{{ SELECTED_REGION_LABEL }}</span>

      <nav class="nav" aria-label="주요 메뉴">
        <RouterLink to="/board" class="nav-link">게시판</RouterLink>
        <RouterLink to="/weather" class="nav-link">날씨</RouterLink>
      </nav>

      <RouterLink to="/board" class="search-link" aria-label="게시판으로 이동">🔍</RouterLink>
    </div>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--color-line);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 20;
}
.header-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 60px;
}
.logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 20px;
  color: var(--color-river);
  white-space: nowrap;
}
.region-badge {
  padding: 3px 10px;
  border-radius: 999px;
  background: var(--color-paper-dim);
  border: 1px solid var(--color-river);
  color: var(--color-river);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.nav {
  display: flex;
  gap: 4px;
  flex: 1;
}
.nav-link {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  color: var(--color-ink-soft);
}
.nav-link.router-link-active {
  color: var(--color-river);
  font-weight: 700;
}
.search-link {
  font-size: 16px;
}
</style>
