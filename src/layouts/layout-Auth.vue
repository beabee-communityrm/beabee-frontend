<template>
  <main
    class="min-h-screen bg-cover bg-fixed bg-center py-4"
    :style="backgroundStyle"
  >
    <router-view />
  </main>
</template>
<script lang="ts" setup>
import { backgroundStyle } from '../store';
</script>
