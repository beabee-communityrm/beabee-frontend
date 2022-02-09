<template>
  <select
    class="
      p-2
      w-full
      border border-primary-40
      rounded
      focus:outline-none focus:shadow-input
      bg-white
    "
    @change="emit('update:modelValue', handleInput($event))"
  >
    <option
      v-for="item in items"
      :key="item.id"
      :value="item.id"
      :selected="modelValue === item.id"
    >
      {{ item.label + (item.count ? ' (' + item.count + ')' : '') }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import handleInput from '../../utils/handle-input';

const emit = defineEmits(['update:modelValue']);

defineProps<{
  modelValue: string | null;
  items: {
    id: string;
    label: string;
    count?: string;
  }[];
}>();
</script>
