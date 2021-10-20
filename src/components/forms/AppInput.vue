<template>
  <label class="block mb-1.5 font-semibold" :for="inputType"
    >{{ label }}
  </label>
  <input
    :id="inputType"
    class="p-2 w-full border border-primary-40 rounded focus:outline-none input"
    :type="inputType"
    :class="dangerClasses"
    :value="modelValue"
    v-bind="$attrs"
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
    <div class="flex text-primary-80">
      <font-awesome-icon
        class="text-xl -mt-0.5"
        :icon="['fas', 'info-circle']"
      />

      <span class="ml-1">{{ infoMessage }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, Ref } from '@vue/reactivity';
import handleInput from '../../utils/handle-input';

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
</script>

<style scoped>
.input:focus {
  box-shadow: var(--input-focus-box-shadow-size)
    var(--input-focus-box-shadow-color);
}
</style>
