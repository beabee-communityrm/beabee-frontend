<template>
  <div v-if="oneOffPayment >= 1">
    <p class="mb-3">
      {{
        t('contribution.prorateMessage', {
          monthsLeft: n(monthsLeft),
          months: t('common.month', monthsLeft),
          oneOffPayment: n(oneOffPayment, 'currency'),
        })
      }}
    </p>
    <label class="flex mb-2">
      <div class="flex-none mr-1">
        <input v-model="prorate" type="radio" :value="true" />
      </div>
      <div class="flex-auto">
        <h4 class="font-semibold">{{ t('contribution.prorateYesTitle') }}</h4>
        <p class="text-sm">
          {{
            t('contribution.prorateYesText', {
              oneOffPayment: n(oneOffPayment, 'currency'),
            })
          }}
        </p>
      </div>
    </label>
    <label class="flex mb-5">
      <div class="flex-none mr-1">
        <input v-model="prorate" type="radio" :value="false" />
      </div>
      <div class="flex-auto">
        <h4 class="font-semibold">
          {{
            t('contribution.prorateNoTitle', {
              renewalDate: formattedRenewalDate,
            })
          }}
        </h4>
        <p class="text-sm">
          {{ t('contribution.prorateNoText') }}
        </p>
      </div>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { differenceInCalendarMonths } from 'date-fns';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatLocale } from '../../../utils/dates/locale-date-formats';

const { t, n } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  newAmount: number;
  oldAmount: number;
  renewalDate: Date;
}>();

const emit = defineEmits(['update:modelValue']);

const prorate = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const monthsLeft = computed(() =>
  differenceInCalendarMonths(props.renewalDate, new Date())
);

const oneOffPayment = computed(
  () => ((props.newAmount - props.oldAmount) * monthsLeft.value) / 12
);

// TODO: formatLocale isn't imported if used directly in the template
const formattedRenewalDate = computed(() =>
  formatLocale(props.renewalDate, 'PPP')
);
</script>
