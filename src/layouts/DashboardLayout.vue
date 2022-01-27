<template>
  <div class="flex flex-col min-h-screen md:flex-row relative">
    <the-menu />

    <main
      class="
        flex flex-col flex-grow
        px-4
        pt-5
        pb-10
        bg-primary-5
        md:pt-14 md:px-10
      "
    >
      <router-view />
      <Footer />
    </main>
  </div>
</template>

<script lang="ts" setup>
import TheMenu from './menu/TheMenu.vue';
import Footer from '../components/Footer.vue';
</script>
