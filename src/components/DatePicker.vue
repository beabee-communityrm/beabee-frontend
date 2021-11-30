<template>
  <label v-if="label">{{ label }}</label>
  <input
    type="date"
    class="
      p-2
      border border-primary-40
      rounded
      focus:outline-none focus:shadow-input
      ml-2
    "
    @input="$emit('update:modelValue', handleInput($event))"
  />
</template>

<script lang="ts" setup>
import handleInput from '../utils/handle-input';

defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);
</script>
