<template>
  <label class="block mb-1.5 font-semibold" :for="inputType"
    >{{ formattedLabel }}
  </label>
  <input
    :id="inputType"
    class="
      p-2
      w-full
      border border-primary-40
      rounded
      focus:outline-none focus:shadow-input
    "
    :type="inputType"
    :class="dangerClasses"
    :value="modelValue"
    v-bind="$attrs"
    :required="required"
    @input="$emit('update:modelValue', handleInput($event))"
  />

  <div
    v-if="errorMessage"
    class="text-xs text-danger font-semibold mt-1.5"
    role="alert"
  >
    {{ errorMessage }}
  </div>

  <div v-if="infoMessage" class="mt-2 text-xs">
    <InfoMessage :message="infoMessage" />
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref } from '@vue/reactivity';
import handleInput from '../../utils/handle-input';
import InfoMessage from '../InfoMessage.vue';

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
  required: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['update:modelValue']);

const dangerClasses = computed(() => {
  return props.errorMessage ? ['bg-danger-10', 'border-danger-70'] : null;
});

const formattedLabel = computed(() => {
  return props.required ? props.label + '*' : props.label;
});
</script>
