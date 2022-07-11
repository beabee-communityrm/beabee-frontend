<template>
  <main
    class="min-h-screen bg-fixed bg-cover bg-center py-4"
    :style="backgroundStyle"
  >
    <router-view />
  </main>
</template>
<script lang="ts" setup>
import backgroundStyle from '../utils/backgroundStyle';
</script>
