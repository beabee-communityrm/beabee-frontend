<template>
  <b v-if="readonly">{{ args.prefix }}{{ readonlyValue }}</b>
  <AppRadioGroup
    v-else-if="args.type === 'boolean'"
    v-model="value"
    :options="[
      [true, t('common.yes')],
      [false, t('common.no')],
    ]"
    inline
    required
  />
  <AppSelect
    v-else-if="args.type === 'enum'"
    v-model="value"
    :items="args.options"
    required
  />
  <AppInput
    v-else-if="args.type === 'array'"
    v-model="value"
    type="text"
    :prefix="args.prefix"
    required
    hide-error-message
  />
  <DateInput v-else-if="args.type === 'date'" v-model="value" />
  <AppInput
    v-else
    v-model="value"
    :type="args.type"
    :prefix="args.prefix"
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
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: FilterValue;
  args: FilterArgs;
  readonly: boolean;
}>();

const { t } = useI18n();

const value = computed({
  get: () => props.modelValue as any,
  set: (modelValue) => emit('update:modelValue', modelValue),
});

const readonlyValue = computed(() => {
  switch (props.args.type) {
    case 'date': {
      const date = props.modelValue as string;
      if (date.startsWith('$now')) {
        return props.modelValue;
      } else {
        return formatLocale(new Date(date), 'P');
      }
    }
    case 'boolean':
      return props.modelValue === true ? t('common.yes') : t('common.no');

    case 'enum':
      return (
        props.args.options.find((opt) => opt.id === props.modelValue)?.label ||
        props.modelValue
      );

    default:
      return props.modelValue;
  }
});
</script>
