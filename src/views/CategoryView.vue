<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const items = ref([])

onMounted(async () => {
  const slug = route.params.slug

  if (slug === 'sports') {
    const res = await fetch('/data/구미_경북권_레포츠.json')
    const data = await res.json()
    items.value = data.items || []
  }
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">레포츠</h2>

    <div v-for="item in items" :key="item.contentid" class="bg-white p-4 rounded-xl mb-3">
      <h3 class="font-semibold">{{ item.title }}</h3>
      <p class="text-sm text-slate-500">{{ item.addr1 }}</p>
    </div>
  </div>
</template>