<template>
  <b v-if="readonly">
    {{ type === 'date' ? formatLocale(new Date(modelValue), 'P') : modelValue }}
  </b>
  <AppInput v-else v-model="value" :type="type" required hide-error-message />
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { formatLocale } from '../../../../../utils/dates/locale-date-formats';
import AppInput from '../../../../forms/AppInput.vue';
import { FilterType, FilterValue } from '../contacts.interface';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: FilterValue;
  type: FilterType;
  readonly: boolean;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (modelValue) => emit('update:modelValue', modelValue),
});
</script>
