<template>
  <b v-if="readonly">
    {{ readonlyValue }}
  </b>
  <AppRadioGroup
    v-else-if="args.type === 'boolean'"
    v-model="value"
    :options="[
      [true, 'Yes'],
      [false, 'No'],
    ]"
    class="flex gap-2"
    required
  />
  <AppSelect
    v-else-if="args.type === 'enum'"
    v-model="value"
    :items="args.options?.map((opt) => ({ id: opt, label: opt })) || []"
    required
  />
  <AppInput
    v-else-if="args.type === 'array'"
    v-model="value"
    type="text"
    required
    hide-error-message
  />
  <DateInput v-else-if="args.type === 'date'" v-model="value" />
  <AppInput
    v-else
    v-model="value"
    :type="args.type"
    required
    hide-error-message
  />
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import AppInput from '../../forms/AppInput.vue';
import { FilterArgs, FilterValue } from '../search.interface';
import AppRadioGroup from '../../forms/AppRadioGroup.vue';
import AppSelect from '../../forms/AppSelect.vue';
import DateInput from './DateInput.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: FilterValue;
  args: FilterArgs;
  readonly: boolean;
}>();

const value = computed({
  get: () => props.modelValue as any,
  set: (modelValue) => emit('update:modelValue', modelValue),
});

const readonlyValue = computed(() => {
  if (props.args.type === 'date') {
    const date = props.modelValue as string;
    if (date.startsWith('$now')) {
      return props.modelValue;
    } else {
      return formatLocale(new Date(date), 'P');
    }
  } else {
    return props.modelValue;
  }
});
</script>
