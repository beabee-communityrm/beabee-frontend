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
      :class="classes"
    >
      <div class="flex px-6 py-3 items-baseline">
        <span class="text-primary-40">{{ currencySign }}</span>
        <div class="pl-2">
          <input
            :value="modelValue"
            class="
              amount
              text-6xl text-primary
              w-full
              border-0
              outline-none
              font-semibold
            "
            :min="minAmount"
            :class="{ 'bg-danger-10': hasError }"
            @input="$emit('update:modelValue', handleInput($event))"
          />
        </div>

        <div class="whitespace-nowrap text-primary-40">/ {{ period }}</div>
      </div>

      <div class="flex flex-col h-full text-sm">
        <button
          class="amount-button border-l border-b"
          type="button"
          @click="changeAmount(modelValue + 1)"
        >
          ▲
        </button>

        <button
          class="amount-button border-l"
          type="button"
          :disabled="isButtonDisabled"
          :class="disableClasses"
          @click="changeAmount(modelValue - 1)"
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
        border border-primary-40
        rounded
        overflow-hidden
        bg-white
      "
    >
      <button
        v-for="(amount, index) in definedAmounts"
        :key="index"
        type="button"
        :class="{
          'bg-link text-white': amount === modelValue,
        }"
        class="
          group-button
          h-9
          flex
          items-center
          justify-center
          text-primary
          font-semibold
        "
        @click="changeAmount(amount)"
      >
        {{ n(amount, 'currency') }}
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
import { computed } from '@vue/reactivity';
import handleInput from '../../../utils/handle-input';
import { useI18n } from 'vue-i18n';

const { t, n, getNumberFormat, locale } = useI18n();

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
  },
  isMonthly: {
    type: Boolean,
    required: true,
  },
  minAmount: {
    type: Number,
    required: true,
  },
  definedAmounts: {
    type: Array as () => number[],
    required: true,
    default: () => [],
  },
});

const emits = defineEmits(['update:modelValue']);

const changeAmount = (amount: number) => {
  emits('update:modelValue', amount);
};

const hasError = computed(
  () =>
    props.modelValue < props.minAmount || typeof props.modelValue !== 'number'
);

const isButtonDisabled = computed(() => props.modelValue <= props.minAmount);

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

const disableClasses = computed(() => {
  return isButtonDisabled.value ? 'cursor-not-allowed disabled' : null;
});

const classes = computed(() => {
  return hasError.value ? 'border-danger bg-danger-10' : 'bg-white';
});

const period = computed(() => {
  return props.isMonthly ? t('common.month') : t('common.year');
});
</script>

<style scoped>
.disabled {
  @apply text-grey !important;
}

.amount-button {
  @apply h-1/2 bg-white py-2 px-4 text-primary-70 hover:text-secondary border-primary-40;
}

.group-button {
  @apply border-none;
  @apply rounded-none !important;
}

/* group button */
.group-button:nth-child(2) {
  border-left: 1px solid theme('colors.primary.40');
  border-right: 1px solid theme('colors.primary.40');
}

@media screen and (min-width: 768px) {
  .group-button:nth-child(2) {
    border: none;
    border-bottom: 1px solid theme('colors.primary.40');
    border-top: 1px solid theme('colors.primary.40');
  }
}
</style>
