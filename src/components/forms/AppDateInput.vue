<template>
  <AppInput
    v-model="dateText"
    type="date"
    required
    @change='modelValue = new Date($event.target.value)'
  />
</template>

<script lang="ts" setup>
import AppInput from './AppInput.vue';
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  id: string;
  modelValue: Date;
}>();

const validation = useVuelidate();
const dateText = ref(props.modelValue);


watch(
  dateText,
  (newDate) => {
    if (!validation.value.$invalid) {
      emit('update:modelValue', newDate);
    }
  },
  { flush: 'post' }
);
</script>
