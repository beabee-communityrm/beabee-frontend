<template>
  <div class="flex flex-col min-h-screen md:flex-row text-primary">
    <the-menu />

    <main class="flex-grow px-4 pt-5 pb-24 bg-primary-5 md:pt-14 md:px-10">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import TheMenu from './layouts/menu/TheMenu.vue';

// hacky wayt to authenticate. It should get romoved
// when we add authentication to the current code base
// TODO: move it to router file when implementing
// auth functionality
import axios from './axios';
const axiosLoginInstance = axios.create({
  baseURL: '/login',
  withCredentials: true,
});
axiosLoginInstance.get('/as/member').catch((err) => err);
</script>
