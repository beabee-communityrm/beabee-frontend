<template>
  <div :class="{ relative: showPattern }" class="px-1 md:px-7">
    <template v-if="showPattern">
      <NoticeBg class="absolute w-1/3 right-5 top-2 md:-top-4" />
    </template>

    <header>
      <h1 class="text-3xl md:text-5xl font-extrabold mb-6">
        <slot name="header" />
      </h1>
    </header>

    <div class="md:text-lg">
      <slot name="content" />
    </div>

    <footer class="text-lg">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script lang="ts" setup>
import NoticeBg from './NoticeBg.vue';

defineProps({
  showPattern: {
    type: Boolean,
    default: false,
  },
});
</script>
