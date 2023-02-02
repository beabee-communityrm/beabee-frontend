<template>
  <div class="relative flex min-h-screen flex-col md:flex-row">
    <TheMenu />

    <main
      id="top"
      class="flex w-full max-w-[1400px] flex-grow flex-col bg-primary-5 p-4 md:p-10"
    >
      <router-view />
      <AppFooter />
    </main>
    <div class="hidden flex-1 bg-primary-5 md:block" />
  </div>
</template>

<script lang="ts" setup>
import TheMenu from './menu/TheMenu.vue';
import AppFooter from '../components/AppFooter.vue';
</script>
