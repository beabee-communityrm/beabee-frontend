<template>
  <!-- menu container -->
  <div class="flex justify-between px-6 py-3 md:py-2 md:hidden">
    <!-- menu background overlay -->
    <div
      class="cursor-pointer overlay"
      :class="isMenuVisible ? 'block' : 'hidden'"
      @click="isMenuVisible = false"
    />

    <div class="flex items-center cursor-pointer" @click="toggleMenu">
      <h1 class="text-2xl underline">
        {{ route.meta.pageTitle }}
      </h1>

      <font-awesome-icon
        class="inline-block ml-2"
        :icon="['fas', isMenuVisible ? 'caret-up' : 'caret-down']"
      />
    </div>

    <!-- logo on small screens -->
    <img class="w-11" src="../../assets/images/logo.png" :alt="newsroomName" />
  </div>

  <div class="menu-container" :style="isMenuVisible ? showMobileMenuStyle : ''">
    <div class="hidden mt-12 mb-16 text-center md:block">
      <!-- logo on bigger screens -->
      <img
        class="w-20 md:inline-block"
        src="../../assets/images/logo.png"
        :alt="newsroomName"
      />
    </div>

    <the-menu-list :menu-items="menu" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router';

import menu from './menu-list';
import TheMenuList from './TheMenuList.vue';

const route = useRoute();

const isMenuVisible = ref(false);
useRouter().afterEach(() => {
  isMenuVisible.value = false;
});

const newsroomName = import.meta.env.VITE_NEWSROOM_NAME;

function toggleMenu() {
  isMenuVisible.value = !isMenuVisible.value;
}

const showMobileMenuStyle = {
  top: '68px',
  transform: 'translateX(0)',
};
</script>

<style scoped>
.overlay {
  @apply z-40 fixed w-full h-full top-0 bottom-0 right-0 left-60 opacity-30 bg-black;
}

.menu-container {
  @apply absolute md:static flex flex-col px-4 bottom-0 bg-white md:pt-4 transform transition-transform -translate-x-full md:transform-none z-50;

  min-width: 240px;
}
</style>
