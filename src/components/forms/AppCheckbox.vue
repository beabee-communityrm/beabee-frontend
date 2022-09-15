<template>
  <label class="flex flex-row items-start">
    <input
      v-model="modelValueProxy"
      type="checkbox"
      :disabled="disabled"
      :value="true"
      class="mt-1"
    />
    <p class="ml-2">{{ label }}</p>
  </label>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: boolean;
  disabled?: boolean;
  label: string;
}>();

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (checked) => emit('update:modelValue', !!checked),
});
</script>
