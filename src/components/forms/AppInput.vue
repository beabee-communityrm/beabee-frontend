<template>
  <label class="block mb-1 font-medium" :for="inputType"
    >{{ label }}

    <input
      :id="inputType"
      class="px-2.5 w-full py-2.5 border border-primary-40 rounded"
      :type="inputType"
      :class="dangerClasses"
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', handleInput($event))"
    />
  </label>

  <div v-if="errorMessage" class="absolute text-xs text-danger" role="alert">
    {{ errorMessage }}
  </div>

  <div v-if="infoMessage" class="mt-5 text-xs">
    <div class="flex text-primary-80">
      <font-awesome-icon class="text-xl" :icon="['fas', 'info-circle']" />

      <span class="ml-1">{{ infoMessage }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref } from '@vue/reactivity';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  inputType: {
    type: String,
    default: 'text',
    validator(value: string) {
      return ['password', 'email', 'text'].includes(value);
    },
  },
  label: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String as () => string | Ref<string>,
    default: '',
  },
  infoMessage: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);

const dangerClasses = computed(() => {
  return props.errorMessage ? ['bg-danger-10', 'border-danger-70'] : null;
});

const handleInput = (event: Event) => {
  return (event.target as HTMLInputElement).value;
};
</script>
