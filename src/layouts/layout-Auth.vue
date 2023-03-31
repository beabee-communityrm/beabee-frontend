<template>
  <main
    :class="!isEmbed && 'min-h-screen bg-cover bg-fixed bg-center py-4'"
    :style="isEmbed ? undefined : backgroundStyle"
  >
    <router-view />
  </main>
</template>
<script lang="ts" setup>
import { backgroundStyle, isEmbed } from '../store';
</script>
