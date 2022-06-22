<template>
  <label class="block mb-1.5 font-semibold">
    {{ label }} {{ required ? '*' : '' }}
  </label>
</template>
<script lang="ts" setup>
defineProps<{
  label: string;
  required?: boolean;
}>();
</script>
