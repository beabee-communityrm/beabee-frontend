<template>
  <div class="grid grid-cols-12 gap-x-2 font-bold">
    <label
      class="col-span-12 flex items-center overflow-hidden rounded border border-primary-40 text-sm md:col-span-8"
      :class="hasError ? 'border-danger bg-danger-10' : 'bg-white'"
    >
      <div class="flex flex-1 items-baseline overflow-hidden px-6 py-3">
        <span class="text-body-60">{{ currencySign }}</span>
        <div class="relative mx-1 overflow-hidden">
          <div class="text-6xl font-semibold">
            {{ amount || '0' }}
          </div>
          <input
            :value="amount"
            class="absolute inset-0 h-full w-full border-0 text-6xl font-semibold text-body outline-none"
            :min="minAmount"
            :class="{ 'bg-danger-10': hasError }"
            @input="handleInput"
            @keydown.up.prevent="0 /* just stop caret moving */"
            @keyup.up="changeAmount(amount + 1)"
            @keyup.down="changeAmount(amount - 1)"
          />
        </div>

        <div class="whitespace-nowrap text-body-60">/ {{ period }}</div>
      </div>

      <div class="flex h-full flex-none flex-col text-sm">
        <button
          class="amount-button border-l border-b"
          type="button"
          @click="changeAmount(amount + 1)"
        >
          ▲
        </button>

        <button
          class="amount-button border-l"
          type="button"
          :class="{ 'is-invalid': amount <= minAmount }"
          @click="changeAmount(amount - 1)"
        >
          ▼
        </button>
      </div>
    </label>

    <div
      class="col-span-12 my-6 grid grid-cols-3 overflow-hidden md:col-span-4 md:my-0 md:grid-cols-1"
    >
      <button
        v-for="(definedAmount, index) in definedAmounts"
        :key="index"
        type="button"
        class="border-box flex items-center justify-center border border-primary-40 bg-white p-3 text-sm font-semibold first:rounded-l first:border-r-0 last:rounded-r last:rounded-l-none last:border-l-0 last:border-t md:p-2 md:first:rounded-t md:first:rounded-bl-none md:first:border-r md:first:border-b-0 md:last:rounded-b md:last:rounded-tr-none md:last:border-t-0 md:last:border-l"
        :class="
          definedAmount === amount
            ? '!border-link-110 bg-link font-bold !text-white'
            : 'hover:border-link hover:bg-link-10'
        "
        @click="changeAmount(definedAmount)"
      >
        {{ n(definedAmount, 'currency') }}
      </button>
    </div>

    <div
      v-if="hasError"
      class="col-span-12 mt-0 text-sm font-semibold text-danger md:mt-1.5"
      role="alert"
    >
      {{ t('join.minimumContribution') }}
      {{ n(minAmount, 'currency') }} / {{ period }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';
import { minValue } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

const { t, n, getNumberFormat, locale } = useI18n();

const emits = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: number;
  isMonthly: boolean;
  minAmount: number;
  definedAmounts: number[];
}>();

const amount = computed({
  get: () => props.modelValue,
  set: (newAmount) => {
    emits('update:modelValue', newAmount);
    validation.value.amount.$touch();
  },
});

function handleInput(event: Event) {
  changeAmount(Number((event.target as HTMLInputElement).value) || 0, true);
}

function changeAmount(newAmount: number, allowInvalid = false) {
  amount.value = allowInvalid
    ? newAmount
    : Math.max(props.minAmount, newAmount);
}

const hasError = computed(() => validation.value.$errors.length > 0);

const rules = computed(() => ({
  amount: {
    minValue: minValue(toRefs(props).minAmount),
  },
}));

const validation = useVuelidate(rules, { amount });

// hacky way to get the currency sign because
// setting `part` to `true` threw an error:
// n(100, { key: 'currency', part: true })
const currencySign = computed(() => {
  const { style, currency } = getNumberFormat(locale.value).currency;

  let formatter = new Intl.NumberFormat(locale.value, {
    style,
    currency,
  });

  const currencySignObject = formatter
    .formatToParts(0)
    .find((item) => item.type === 'currency');

  return currencySignObject?.value;
});

const period = computed(() => {
  return props.isMonthly ? t('common.month') : t('common.year');
});
</script>

<style lang="postcss" scoped>
.amount-button {
  @apply h-1/2 border-primary-40 bg-white py-2 px-4 text-primary-70 hover:bg-primary-5 hover:text-primary;
  &.is-invalid {
    @apply cursor-not-allowed text-grey;
  }
}
</style>
