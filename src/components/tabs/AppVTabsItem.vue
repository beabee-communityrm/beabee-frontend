<template>
  <a
    :href="item.to"
    class="
      flex
      justify-between
      items-baseline
      p-1
      mb-1
      rounded
      text-sm
      group
    "
    :class="selected && 'bg-white font-semibold'"
    @click.prevent="emit('click', item.id)"
  >
    <span
      :class="selected ? 'text-link' : 'text-body-80 group-hover:text-body'"
      >{{ item.label }}</span
    >
    <span
      v-if="item.count !== undefined"
      class="text-xs ml-2 font-semibold"
      :class="
        selected ? 'text-body-80' : 'text-body-40 group-hover:text-body-80'
      "
      >{{ item.count }}</span
    >
  </a>
</template>
<script lang="ts" setup>
import { TabItem } from './tabs.interface';

const emit = defineEmits(['click']);

defineProps<{
  item: TabItem;
  selected: boolean;
}>();
</script>
