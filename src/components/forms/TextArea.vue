<template>
  <label class="block mb-1.5 font-semibold" :for="label">{{ label }} </label>

  <textarea
    :id="label"
    class="
      p-2
      w-full
      border border-primary-40
      rounded
      focus:outline-none focus:shadow-input
    "
    :class="dangerClasses"
    :value="modelValue"
    :required="required"
    @input="$emit('update:modelValue', handleInput($event))"
  />
</template>

<script lang="ts" setup>
import { computed, Ref } from '@vue/reactivity';
import handleInput from '../../utils/handle-input';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String as () => string | Ref<string>,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['update:modelValue']);

const dangerClasses = computed(() => {
  return props.errorMessage ? ['bg-danger-10', 'border-danger-70'] : null;
});
</script>
