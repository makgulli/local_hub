<script setup>
defineProps({
  role: { type: String, required: true }, // 'user' | 'assistant'
  content: { type: String, required: true },
})
</script>

<template>
  <div :class="['flex', role === 'user' ? 'justify-end' : 'justify-start']">
    <div
      :class="[
        'max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm',
        role === 'user'
          ? 'bg-emerald-600 text-white rounded-br-none'
          : 'bg-white text-slate-800 border border-slate-200/60 rounded-bl-none',
      ]"
    >
      <p class="whitespace-pre-line">{{ content }}</p>
    </div>
  </div>
</template>
