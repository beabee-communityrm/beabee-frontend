<template>
  <div
    class="max-w-lg gap-6"
    :class="{
      'rounded-md bg-white p-6 shadow-auth-box md:p-8': !isEmbed,
      'mx-auto md:flex md:max-w-3xl': !preview,
    }"
  >
    <div
      v-if="!isEmbed"
      class="flex-initial basis-72 mb-4"
      :class="{ 'md:mb-0': !preview }"
    >
      <div
        class="flex gap-4 items-center"
        :class="{
          'mb-4': !!$slots.header,
          'md:flex-col md:items-start': !preview,
        }"
      >
        <AppLogo class="w-20" :class="{ 'md:w-full': !preview }" />
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

defineProps<{ title?: string; preview?: boolean }>();
</script>
