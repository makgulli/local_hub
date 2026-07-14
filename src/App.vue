<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ChatWidget from '@/components/chatbot/ChatWidget.vue'
import PayPlannerBanner from '@/components/payplanner/PayPlannerBanner.vue'
import ToastNotice from '@/components/common/ToastNotice.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 selection:bg-emerald-100 selection:text-emerald-800">
    <AppHeader />
    <ToastNotice />
    <main class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
    <AppFooter />
    <ChatWidget />
    <PayPlannerBanner />
  </div>
</template>
