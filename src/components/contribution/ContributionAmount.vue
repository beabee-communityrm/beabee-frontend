<template>
  <div class="grid grid-cols-12 gap-x-2 font-bold">
    <label
      class="
        col-span-12
        md:col-span-8
        border border-primary-40
        rounded
        flex
        items-center
        overflow-hidden
        text-sm
      "
      :class="hasError ? 'border-danger bg-danger-10' : 'bg-white'"
    >
      <div class="flex flex-1 px-6 py-3 items-baseline overflow-hidden">
        <span class="text-primary-40">{{ currencySign }}</span>
        <div class="relative mx-1 overflow-hidden">
          <div class="text-6xl font-semibold">
            {{ amount || '0' }}
          </div>
          <input
            :value="amount"
            class="
              absolute
              text-6xl text-primary
              inset-0
              w-full
              h-full
              border-0
              outline-none
              font-semibold
            "
            :min="minAmount"
            :class="{ 'bg-danger-10': hasError }"
            @input="handleInput"
            @keydown.up.prevent="0 /* just stop caret moving */"
            @keyup.up="changeAmount(amount + 1)"
            @keyup.down="changeAmount(amount - 1)"
          />
        </div>

        <div class="whitespace-nowrap text-primary-40">/ {{ period }}</div>
      </div>

      <div class="flex flex-none flex-col h-full text-sm">
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
      class="
        col-span-12
        md:col-span-4
        my-6
        md:my-0
        grid grid-cols-3
        md:grid-cols-1
        overflow-hidden
      "
    >
      <button
        v-for="(definedAmount, index) in definedAmounts"
        :key="index"
        type="button"
        class="
          bg-white
          border border-primary-40
          first:rounded-l first:border-r-0
          last:rounded-r last:rounded-l-none last:border-l-0 last:border-t
          md:first:rounded-t
          md:first:rounded-bl-none
          md:first:border-r
          md:first:border-b-0
          md:last:rounded-b
          md:last:rounded-tr-none
          md:last:border-t-0
          md:last:border-l
          p-3
          md:p-2
          border-box
          flex
          items-center
          justify-center
          font-semibold
          fir
        "
        :class="
          definedAmount === amount
            ? 'bg-link-10 text-link-110 font-bold !border-link'
            : 'hover:text-link'
        "
        @click="changeAmount(definedAmount)"
      >
        {{ n(definedAmount, 'currency') }}
      </button>
    </div>

    <div
      v-if="hasError"
      class="text-sm text-danger font-semibold mt-0 md:mt-1.5 col-span-12"
      role="alert"
    >
      {{ t('join.minimumContribution') }}
      {{ n(minAmount, 'currency') }} / {{ period }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRefs } from '@vue/reactivity';
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

<style scoped>
.amount-button {
  @apply h-1/2 bg-white py-2 px-4 text-primary-70 hover:text-link border-primary-40;
  &.is-invalid {
    @apply text-grey cursor-not-allowed;
  }
}
</style>
