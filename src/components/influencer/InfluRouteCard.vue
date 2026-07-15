<script setup>
const props = defineProps({
  route: { type: Object, required: true },
})
</script>

<template>
  <article class="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300">
    <div class="relative overflow-hidden aspect-[4/3] bg-slate-100">
      <img
        :src="route.image"
        :alt="route.title"
        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      />
      <div class="absolute inset-x-0 top-0 p-4 flex items-center justify-between gap-3">
        <span class="bg-emerald-600 text-white text-[11px] font-bold uppercase px-3 py-1 rounded-full border border-emerald-500/30">{{ route.influencer }}</span>
        <span class="bg-white/90 text-slate-700 text-[11px] px-3 py-1 rounded-full border border-slate-200">{{ route.duration }}</span>
      </div>
    </div>

    <div class="p-5 space-y-4">
      <div>
        <h3 class="text-lg font-bold text-slate-900">{{ route.title }}</h3>
        <p class="mt-2 text-sm text-slate-500 leading-relaxed">{{ route.description }}</p>
      </div>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in route.tags"
          :key="tag"
          class="text-[11px] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100"
        >
          {{ tag }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-sm text-slate-600">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">추천 루트</p>
          <ul class="mt-2 space-y-1 list-disc list-inside">
            <li v-for="point in route.points" :key="point">{{ point }}</li>
          </ul>
        </div>
        <div class="flex flex-col justify-between">
          <p class="text-xs uppercase tracking-[0.18em] text-slate-400">평점</p>
          <p class="mt-2 text-2xl font-bold text-emerald-600">{{ route.score.toFixed(1) }}</p>
        </div>
      </div>
    </div>
  </article>
</template>
