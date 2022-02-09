<template>
  <div class="flex">
    <img
      class="w-16 mr-3"
      src="../../../assets/images/logo.png"
      :alt="generalContent.name"
    />

    <slot />
  </div>
</template>

<script lang="ts" setup>
import { generalContent } from '../../../store';
</script>
