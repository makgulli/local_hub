<template>
  <footer class="footer">
    <div class="container footer-inner">
      <p>© LocalHub 교육 프로젝트 | 본 화면은 조안 와이어프레임입니다</p>
      <p class="source">
        관광 정보: 한국관광공사 TourAPI 4.0 (공공누리 제3유형) · 날씨 정보: Open-Meteo.com
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-line);
  background: var(--color-paper-dim);
  margin-top: 40px;
}
.footer-inner {
  padding: 20px;
  font-size: 12px;
  color: var(--color-ink-soft);
  text-align: center;
}
.source {
  margin-top: 4px;
}
</style>
