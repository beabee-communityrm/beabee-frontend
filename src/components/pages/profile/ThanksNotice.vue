<template>
  <div class="flex">
    <AppLogo class="w-16 mr-3" />

    <slot />
  </div>
</template>
<script lang="ts" setup>
import AppLogo from '../../AppLogo.vue';
</script>
