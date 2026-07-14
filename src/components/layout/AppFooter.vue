<template>
  <footer class="bg-slate-900 text-slate-400 py-10 mt-16 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span class="text-white font-extrabold text-lg tracking-tight">Local<span class="text-emerald-500">Hub</span></span>
          <p class="text-xs text-slate-400 mt-1">지역민들의 참여로 한층 더 풍성해지는 구미·경북 라이프스타일 가이드</p>
        </div>
        <div class="text-xs text-slate-500">
          <span>교육 프로젝트 · 3일 팀프로젝트 빌드</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-500 leading-relaxed">
        <div class="space-y-2">
          <p class="font-semibold text-slate-300">📌 공공 데이터 및 저작권 정보 공시</p>
          <p>본 서비스는 한국관광공사 TourAPI 4.0 국문 관광정보 서비스를 가공 및 참조하여 렌더링하고 있습니다.</p>
          <p>원본 데이터 출처: <span class="text-slate-400">한국관광공사 국문 관광정보 서비스 API</span></p>
          <p>
            라이선스 유형:
            <strong class="text-emerald-500 font-bold">공공누리 제3유형 (출처표시 및 변경금지)</strong>
            에 해당하며, 원본 데이터의 구조를 임의로 변조하지 않습니다.
          </p>
          <p>날씨 정보: Open-Meteo.com (CC BY 4.0)</p>
        </div>
        <div class="space-y-2">
          <p class="font-semibold text-slate-300">🛠️ 프론트엔드 자체 제어 정보</p>
          <p>
            본 어플리케이션은 Vue.js 3(Vite) 기반 무백엔드(No-Backend) SPA로 작동하며, 모든 사용자
            작성 게시글은 브라우저 내
            <code class="bg-slate-800 text-emerald-400 px-1 py-0.5 rounded text-[11px]">localStorage</code>
            에 암호화 없이 저장됩니다. (교육 목적의 의도된 설계)
          </p>
          <p class="text-slate-500 mt-4">© 2026 LocalHub. 지역 정보 공유 커뮤니티 개발팀.</p>
        </div>
      </div>
    </div>
  </footer>
</template>
