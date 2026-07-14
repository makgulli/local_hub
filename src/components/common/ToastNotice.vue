<script setup>
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()
</script>

<template>
  <Transition name="toast-slide">
    <div
      v-if="toast.show"
      class="fixed top-20 right-4 sm:right-8 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center space-x-3 z-50 border border-slate-800"
    >
      <span :class="toast.success ? 'text-emerald-400' : 'text-rose-400'">
        <i :class="toast.success ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation'"></i>
      </span>
      <span class="text-sm font-medium">{{ toast.message }}</span>
    </div>
  </Transition>
</template>
