<template>
  <div
    class="flex flex-col flex-1 flex-col-reverse justify-between text-body-80 border-l border-primary-40 pl-2"
  >
    <p class="text-sm font-semibold">{{ label }}</p>
    <p class="text-3xl font-bold mb-3">{{ stat }}</p>
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  label: string;
  stat: string;
}>();
</script>
