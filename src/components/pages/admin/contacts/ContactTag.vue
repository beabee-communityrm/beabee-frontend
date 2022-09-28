<template>
  <span
    class="mr-1 mb-1 inline-block select-none whitespace-nowrap rounded border border-white bg-white py-0.5 px-1 text-xs font-bold text-link"
  >
    {{ props.tag }}
    <font-awesome-icon
      v-if="props.hasRemoveIcon"
      class="ml-2 inline-block cursor-pointer hover:text-link-110"
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
