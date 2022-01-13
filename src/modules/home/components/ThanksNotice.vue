<template>
  <div class="flex">
    <img
      class="w-16 mr-3"
      src="../../../assets/images/logo.png"
      :alt="newsroomName"
    />

    <slot />
  </div>
</template>

<script lang="ts" setup>
const newsroomName = import.meta.env.VITE_NEWSROOM_NAME;
</script>
