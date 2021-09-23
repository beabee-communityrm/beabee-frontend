<template>
  <!-- menu container -->
  <div class="flex justify-between px-6 py-3 md:py-2 md:hidden">
    <!-- menu background overlay -->
    <div
      class="cursor-pointer overlay"
      :class="isMenuVisible ? 'block' : 'hidden'"
      @click="isMenuVisible = false"
    />

    <div class="flex items-center cursor-pointer" @click="showMenu">
      <h1 class="text-2xl underline">
        {{ route.meta.pageTitle }}
      </h1>

      <font-awesome-icon
        class="inline-block ml-2 -mt-2"
        :icon="['fas', 'caret-down']"
      />
    </div>

    <!-- logo on small screens -->
    <img class="w-11" src="../../assets/images/logo.png" alt="Newsroom logo" />
  </div>

  <div class="menu" :style="isMenuVisible ? showMobileMenuStyle : ''">
    <div class="hidden mt-12 mb-16 text-center md:block">
      <!-- logo on bigger screens -->
      <img
        class="w-20 md:inline-block"
        src="../../assets/images/logo.png"
        alt="News room logo"
      />
    </div>

    <the-menu-list :menu-items="menu" />

    <div class="mt-auto mb-6 sm:mb-10 text-primary-80">
      <a href="">
        <font-awesome-icon
          class="inline-block mr-2 h-4"
          :icon="['fas', 'sign-in-alt']"
        />
        <span>Log out</span>
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import { useRoute } from 'vue-router';

import menu from './menu-list';
import TheMenuList from './TheMenuList.vue';

const route = useRoute();

const isMenuVisible = ref(false);

function showMenu() {
  isMenuVisible.value = true;
}
const showMobileMenuStyle = {
  top: '68px',
  transform: 'translateX(0)',
};
</script>

<style scoped>
.overlay {
  position: fixed;
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  top: 0;
  left: 240px;
  bottom: 0;
  right: 0;
}

.menu {
  @apply absolute md:static flex flex-col p-4 pt-0 bottom-0 bg-white md:pt-4 transform transition-transform -translate-x-full md:transform-none;

  min-width: 240px;
}
</style>
