<template>
  <div class="mb-2">
    <AppInput
      v-model="amount"
      type="number"
      :min="minAmount"
      required
      class="block w-32"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import AppInput from '../../../forms/AppInput.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: number;
  minAmount: number;
}>();

const amount = computed({
  get: () => props.modelValue,
  set: (newAmount) => emit('update:modelValue', newAmount),
});
</script>
