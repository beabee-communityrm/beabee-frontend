<template>
  <!-- menu container -->
  <div class="flex justify-between px-6 py-3 md:hidden md:py-2">
    <!-- menu background overlay -->
    <div
      class="fixed top-0 bottom-0 right-0 left-menu z-30 h-full w-full cursor-pointer bg-black opacity-30"
      :class="isMenuVisible ? 'block' : 'hidden'"
      @click="isMenuVisible = false"
    />

    <div class="flex cursor-pointer items-center" @click="toggleMenu">
      <h1 class="text-2xl underline">
        {{ t(route.meta.pageTitle) }}
      </h1>

      <font-awesome-icon
        class="ml-2 inline-block"
        :icon="isMenuVisible ? faCaretUp : faCaretDown"
      />
    </div>

    <!-- logo on small screens -->
    <AppLogo class="w-11" />
  </div>

  <div
    class="absolute bottom-0 z-30 flex w-menu flex-none -translate-x-full transform flex-col bg-white transition-transform transition-width md:static md:w-16 md:transform-none xl:w-menu"
    :class="{ 'top-[68px] translate-x-0': isMenuVisible }"
  >
    <div class="my-10 hidden text-center md:block">
      <!-- logo on bigger screens -->
      <AppLogo class="w-12 md:inline-block xl:w-20" />
    </div>

    <TheMenuList v-if="currentUser" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { currentUser } from '../../store';
import TheMenuList from './TheMenuList.vue';
import AppLogo from '../../components/AppLogo.vue';
import { useI18n } from 'vue-i18n';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

const route = useRoute();
const { t } = useI18n();

const isMenuVisible = ref(false);
// Automatically hide menu on route change
useRouter().afterEach(() => {
  isMenuVisible.value = false;
});

function toggleMenu() {
  isMenuVisible.value = !isMenuVisible.value;
}
</script>
