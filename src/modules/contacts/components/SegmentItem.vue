<template>
  <a
    :href="'/contacts?segment=' + segment.id"
    class="
      flex
      justify-between
      items-baseline
      p-1
      mb-1
      rounded
      text-sm
      hover:font-semibold
      group
    "
    :class="selected && 'bg-white font-semibold'"
    @click.prevent="emit('update:modelValue', segment.id)"
  >
    <span
      :class="selected ? 'text-link' : 'text-body-80 group-hover:text-body'"
      >{{ segment.name }}</span
    >
    <span
      class="text-xs ml-2 font-semibold"
      :class="
        selected ? 'text-body-80' : 'text-body-40 group-hover:text-body-80'
      "
      >{{ segment.memberCount }}</span
    >
  </a>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
  modelValue: string;
  segment: { name: string; memberCount: number | null; id: string };
}>();
const selected = computed(() => props.modelValue === props.segment.id);
</script>
