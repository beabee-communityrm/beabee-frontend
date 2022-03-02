<template>
  <!-- menu container -->
  <div class="flex justify-between px-6 py-3 md:py-2 md:hidden">
    <!-- menu background overlay -->
    <div
      class="
        cursor-pointer
        z-40
        fixed
        w-full
        h-full
        top-0
        bottom-0
        right-0
        opacity-30
        bg-black
        left-[240px]
      "
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
    <img
      class="w-11"
      src="../../assets/images/logo.png"
      :alt="generalContent.organisationName"
    />
  </div>

  <div
    class="
      absolute
      z-40
      md:static
      flex flex-col
      px-4
      bottom-0
      bg-white
      transform
      transition-transform
      -translate-x-full
      md:transform-none
      flex-none
      w-[240px]
    "
    :class="{ 'top-[68px] translate-x-0': isMenuVisible }"
  >
    <div class="hidden my-12 text-center md:block">
      <!-- logo on bigger screens -->
      <img
        class="w-20 md:inline-block"
        src="../../assets/images/logo.png"
        :alt="generalContent.organisationName"
      />
    </div>

    <TheMenuList :sections="menuSections" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router';
import { generalContent } from '../../store';

import menuSections from './menu-list';
import TheMenuList from './TheMenuList.vue';

const route = useRoute();

const isMenuVisible = ref(false);
// Automatically hide menu on route change
useRouter().afterEach(() => {
  isMenuVisible.value = false;
});

function toggleMenu() {
  isMenuVisible.value = !isMenuVisible.value;
}
</script>
