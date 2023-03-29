<template>
  <div
    class="my-0.5 flex w-auto items-center justify-start rounded px-1 py-2 font-semibold text-body-80 md:w-12 md:justify-center md:overflow-x-hidden xl:w-auto xl:justify-start xl:overflow-auto"
    :class="isActive ? 'bg-primary-20' : 'hover:bg-primary-5'"
  >
    <font-awesome-icon class="fa-fw inline-block h-4" :icon="icon" size="lg" />

    <span class="ml-2 md:hidden xl:inline-block">{{ title }}</span>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  icon: [string, string];
  isActive?: boolean;
}>();
</script>
