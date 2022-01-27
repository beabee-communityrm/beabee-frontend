<template>
  <router-link
    :to="to"
    class="flex justify-between p-1 mb-1 rounded text-sm"
    :class="selected && 'bg-white font-semibold'"
  >
    <span :class="selected ? 'text-link' : 'text-body-80'">{{ name }}</span>
    <span
      class="text-xs ml-2"
      :class="selected ? 'text-body-80' : 'text-body-40'"
      >{{ count }}</span
    >
  </router-link>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  count: number;
  selected: boolean;
  to: string;
}>();
</script>
