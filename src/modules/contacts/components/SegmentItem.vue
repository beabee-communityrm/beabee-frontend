<template>
  <router-link
    :to="to"
    class="
      flex
      justify-between
      p-1
      mb-1
      rounded
      text-sm
      hover:font-semibold
      group
    "
    :class="selected && 'bg-white font-semibold'"
  >
    <span
      :class="selected ? 'text-link' : 'text-body-80 group-hover:text-body'"
      >{{ name }}</span
    >
    <span
      class="text-xs ml-2 font-semibold"
      :class="
        selected ? 'text-body-80' : 'text-body-40 group-hover:text-body-80'
      "
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
