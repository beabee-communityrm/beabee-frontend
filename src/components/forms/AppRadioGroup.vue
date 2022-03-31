<template>
  <label
    v-for="[value, label] in options"
    :key="value.toString()"
    class="block mb-1 font-semibold"
  >
    <input
      v-model="selected"
      type="radio"
      :name="name"
      :value="value"
      :checked="modelValue === value"
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
