<template>
  <div
    class="
      flex flex-col flex-1
      justify-between
      text-body-80
      border-l border-primary-40
      pl-2
    "
  >
    <p class="text-sm font-semibold mb-4">{{ label }}</p>
    <p class="text-4xl font-bold">{{ stat }}</p>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  label: string;
  stat: string;
}>();
</script>
