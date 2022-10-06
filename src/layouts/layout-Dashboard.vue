<template>
  <div class="relative flex min-h-screen flex-col md:flex-row">
    <the-menu />

    <main
      id="top"
      class="flex w-full max-w-[1400px] flex-grow flex-col bg-primary-5 px-4 pt-5 pb-5 md:px-10 md:pt-14"
    >
      <router-view />
      <AppFooter />
    </main>
    <div class="flex-1 bg-primary-5" />
  </div>
</template>

<script lang="ts" setup>
import TheMenu from './menu/TheMenu.vue';
import AppFooter from '../components/AppFooter.vue';
</script>
