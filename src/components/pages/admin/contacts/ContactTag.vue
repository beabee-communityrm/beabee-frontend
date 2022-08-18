<template>
  <span
    class="
      bg-white
      whitespace-nowrap
      text-link
      rounded
      font-bold
      inline-block
      py-0.5
      px-1
      mr-1
      mb-1
      text-xs
      border border-white
      select-none
    "
    :class="hasRemoveIcon ? '' : ''"
  >
    {{ props.tag }}
    <font-awesome-icon
      v-if="props.hasRemoveIcon"
      class="inline-block cursor-pointer ml-2 hover:text-link-110"
      icon="times"
      @click="$emit('click:removeTag')"
    />
  </span>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tag: string;
  hasRemoveIcon?: boolean;
}>();

defineEmits(['click:removeTag']);
</script>
