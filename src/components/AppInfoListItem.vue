<template>
  <dd class="text-right text-sm">{{ name }}</dd>
  <dt class="font-bold">
    <slot>{{ value }}</slot>
  </dt>
</template>
<script lang="ts" setup>
defineProps<{
  name: string;
  value?: unknown;
}>();
</script>
