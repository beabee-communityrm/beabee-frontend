<template>
  <label v-for="item in options" class="block mb-1 font-semibold">
    <input
      type="radio"
      :name="name"
      :value="item"
      v-model="selected"
      :checked="modelValue === item"
    />
    {{ item }}
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
  modelValue: string | null;
  options: Array<string>;
  name: string;
}>();

const selected = computed({
  get: () => props.modelValue,
  set: (new_value) => emit('update:modelValue', new_value),
});
</script>
