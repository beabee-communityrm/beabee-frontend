<template>
  <div class="flex flex-col min-h-screen md:flex-row">
    <the-menu />

    <div class="flex-grow bg-primary-5">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TheMenu from './layouts/menu/TheMenu.vue';
</script>
