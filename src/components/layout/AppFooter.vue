<template>
  <footer class="bg-slate-900 text-slate-400 py-6 mt-10 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
        <div>
          <span class="text-xl font-extrabold tracking-tight text-slate-100">
            구경 야호 <span class="text-[#FF6467]">(GUGYEONG-YAHO)</span>
          </span>
          <span class="hidden sm:inline-block ml-2 text-xs font-semibold bg-slate-800 text-[#FF6467] px-2 py-0.5 rounded-full border border-slate-700">
            구미·경북권
          </span>
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
            <strong class="text-[#FF6467] font-bold">공공누리 제3유형 (출처표시 및 변경금지)</strong>
            에 해당하며, 원본 데이터의 구조를 임의로 변조하지 않습니다.
          </p>
          <p>날씨 정보: Open-Meteo.com (CC BY 4.0)</p>
        </div>
        <div class="space-y-2">
          <p class="font-semibold text-slate-300">🛠️ 프론트엔드 자체 제어 정보</p>
          <p>
            작성 게시글은 브라우저 내
            <code class="bg-slate-800 text-[#FF6467] px-1 py-0.5 rounded text-[11px]">localStorage</code>
            에 암호화 없이 저장됩니다. (교육 목적의 의도된 설계)
          </p>
          <p class="text-[#FF6467] mt-4">© 2026 SSAFY 16기 구미 2반 김현재 박영준 이수민</p>
        </div>
      </div>
    </div>
  </footer>
</template>
