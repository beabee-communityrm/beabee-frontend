<template>
  <b v-if="readonly"
    >{{ item.type === 'enum' ? '' : item.prefix }}{{ readonlyValue }}</b
  >
  <AppRadioGroup
    v-else-if="item.type === 'boolean'"
    v-model="value"
    :options="[
      [true, t('common.yes')],
      [false, t('common.no')],
    ]"
    inline
    required
  />
  <AppSelect
    v-else-if="item.type === 'enum'"
    v-model="value"
    :items="item.options"
    required
  />
  <AppInput
    v-else-if="item.type === 'array'"
    v-model="value"
    type="text"
    :prefix="item.prefix"
    required
    hide-error-message
  />
  <DateInput v-else-if="item.type === 'date'" v-model="value" />
  <AppInput
    v-else
    v-model="value"
    :type="item.type"
    :prefix="item.prefix"
    required
    hide-error-message
  />
</template>
<script lang="ts" setup>
import { FilterValue } from '@beabee/beabee-common';
import { computed } from 'vue';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import AppInput from '../../forms/AppInput.vue';
import AppRadioGroup from '../../forms/AppRadioGroup.vue';
import AppSelect from '../../forms/AppSelect.vue';
import DateInput from './DateInput.vue';
import { useI18n } from 'vue-i18n';
import { FilterItem } from '../search.interface';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: FilterValue;
  item: FilterItem;
  readonly: boolean;
}>();

const { t } = useI18n();

const value = computed({
  get: () => props.modelValue as any,
  set: (modelValue) => emit('update:modelValue', modelValue),
});

const readonlyValue = computed(() => {
  switch (props.item.type) {
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
        props.item.options.find((opt) => opt.id === props.modelValue)?.label ||
        props.modelValue
      );

    default:
      return props.modelValue;
  }
});
</script>
