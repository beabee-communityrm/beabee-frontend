<template>
  <label class="flex flex-row items-start">
    <input
      v-model="modelValueProxy"
      type="checkbox"
      :disabled="disabled"
      :value="true"
      class="mt-1"
    />
    <p v-if="label || icon" class="ml-2 font-semibold">
      <font-awesome-icon v-if="icon" :icon="icon" />
      {{ label }}
    </p>
  </label>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: boolean;
  disabled?: boolean;
  label?: string;
  icon?: string;
}>();

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (checked) => emit('update:modelValue', !!checked),
});
</script>
