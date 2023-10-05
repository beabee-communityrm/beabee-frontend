<template>
  <div
    class="mx-auto max-w-lg md:max-w-3xl md:flex gap-6"
    :class="!isEmbed && 'rounded-md bg-white p-6 shadow-auth-box md:p-8'"
  >
    <div v-if="!isEmbed" class="flex-initial basis-72 mb-4 md:mb-0">
      <div
        class="flex gap-4 md:flex-col items-center md:items-start"
        :class="$slots.header && 'mb-4'"
      >
        <AppLogo class="w-20 md:w-full" />
        <AppTitle v-if="title">{{ title }}</AppTitle>
      </div>
      <slot name="header" />
    </div>
    <div class="flex-1">
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isEmbed } from '../store';
import AppLogo from './AppLogo.vue';
import AppTitle from './AppTitle.vue';

defineProps<{ title?: string }>();
</script>
