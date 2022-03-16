<template>
  <h4 class="font-semibold">Callout title</h4>
  <input @update:modelValue="calloutTitle" />
</template>

<script lang="ts" setup>
defineProps<{ calloutTitle: string }>();
</script>
