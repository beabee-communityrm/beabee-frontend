<template>
  <dd class="text-right text-sm">{{ name }}</dd>
  <dt class="font-bold">{{ value }}</dt>
</template>
<script lang="ts" setup>
defineProps<{
  name: string;
  value: any;
}>();
</script>
