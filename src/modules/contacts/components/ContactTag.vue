<template>
  <span
    class="
      bg-white
      whitespace-nowrap
      text-link
      rounded
      font-bold
      inline-block
      p-1
      mr-1
      mb-1
      text-xs
      border border-white
    "
    :class="hasRemoveIcon ? 'cursor-pointer hover:border-primary-40' : ''"
  >
    {{ props.tag }}
    <font-awesome-icon
      v-if="props.hasRemoveIcon"
      class="inline-block ml-2"
      icon="times"
    />
  </span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tag: string;
  hasRemoveIcon?: boolean;
}>();
</script>
