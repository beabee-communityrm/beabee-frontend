<template>
  <font-awesome-icon
    class="inline-block mr-2 h-4 fa-fw"
    :icon="icon"
    size="lg"
  />

  <span>{{ title }}</span>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  icon: [string, string];
}>();
</script>
