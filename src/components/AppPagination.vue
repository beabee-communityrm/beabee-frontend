<template>
  <ul>
    <li
      v-for="(page, index) in pages"
      :key="index"
      :class="{ 'text-link': page === modelValue }"
      @click="emit('update:modelValue', page)"
    >
      {{ page + 1 }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  modelValue: number;
  totalPages: number;
}>();

const emit = defineEmits(['update:modelValue']);

const pages = computed(() => {
  const ret = [0];
  if (props.modelValue - 1 > 0) {
    ret.push(props.modelValue - 1);
  }
  if (props.modelValue > 0 && props.modelValue < props.totalPages - 1) {
    ret.push(props.modelValue);
  }
  if (props.modelValue + 1 < props.totalPages - 1) {
    ret.push(props.modelValue + 1);
  }
  ret.push(props.totalPages - 1);
  return ret;
});
</script>
