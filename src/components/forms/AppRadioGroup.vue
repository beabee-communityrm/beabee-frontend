<template>
  <label
    v-for="[value, label] in options"
    :key="value.toString()"
    class="flex items-center mb-1"
  >
    <input
      v-model="selected"
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      class="mr-1"
    />
    {{ label }}
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
  modelValue: string | boolean | number | null;
  options: [string | boolean | number, string][];
  name: string;
}>();

const selected = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
});
</script>
