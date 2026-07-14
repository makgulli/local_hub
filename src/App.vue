<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import ChatWidget from '@/components/chatbot/ChatWidget.vue'
import PayPlannerBanner from '@/components/payplanner/PayPlannerBanner.vue'
</script>

<template>
  <AppHeader />
  <main class="main">
    <router-view />
  </main>
  <AppFooter />
  <ChatWidget />
  <PayPlannerBanner />
</template>

<style scoped>
.main {
  flex: 1;
  width: 100%;
}
</style>
