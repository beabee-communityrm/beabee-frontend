<template>
  <label class="flex flex-row items-start font-semibold">
    <input
      v-model="modelValueProxy"
      type="checkbox"
      :disabled="disabled"
      :value="true"
      class="mt-1"
    />
    <p v-if="label || icon" class="ml-2">
      <font-awesome-icon v-if="icon" :icon="icon" />
      {{ label }}
    </p>
  </label>
</template>
<script lang="ts" setup>
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { computed } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: boolean;
  disabled?: boolean;
  label?: string;
  icon?: IconDefinition;
}>();

const modelValueProxy = computed({
  get: () => props.modelValue,
  set: (checked) => emit('update:modelValue', !!checked),
});
</script>
