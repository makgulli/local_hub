<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="container not-found">
    <h1>404</h1>
    <p>페이지를 찾을 수 없어요.</p>
    <RouterLink to="/" class="btn btn-primary">홈으로</RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  padding: 80px 20px;
  text-align: center;
}
</style>
