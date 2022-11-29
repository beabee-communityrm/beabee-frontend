<template>
  <div :class="!isEmbed && 'mx-auto px-4'">
    <div
      class="mx-auto max-w-[30rem]"
      :class="!isEmbed && 'mb-3 rounded-md bg-white p-6 shadow-auth-box md:p-8'"
    >
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isEmbed } from '../store';
</script>
