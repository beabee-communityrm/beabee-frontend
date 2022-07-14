<template>
  <div class="mb-2">
    <AppInput
      v-model="amount"
      input-type="number"
      class="w-32 block"
      :error-message="validation.$errors[0]?.$message"
      required
      @blur="validation.$touch"
    />
  </div>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { minValue } from '@vuelidate/validators';
import { computed, toRef } from 'vue';
import AppInput from '../../../components/forms/AppInput.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: number;
  minAmount: number;
}>();

const amount = computed({
  get: () => props.modelValue,
  set: (newAmount) => emit('update:modelValue', newAmount),
});

const validation = useVuelidate(
  {
    amount: {
      minValue: minValue(toRef(props, 'minAmount')),
    },
  },
  { amount }
);
</script>
