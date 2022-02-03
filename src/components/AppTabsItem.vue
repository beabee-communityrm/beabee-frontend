<template>
  <router-link :to="to" class="tab text-sm p-2 hover:bg-white"
    ><slot
  /></router-link>
</template>
<script lang="ts" setup>
defineProps<{ to: string }>();
</script>

<style scoped>
.tab.router-link-exact-active {
  @apply text-link font-bold;
}
</style>
