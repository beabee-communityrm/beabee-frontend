<template>
  <div class="flex flex-wrap gap-2">
    <div
      class="flex flex-grow basis-[250px] rounded border border-primary-40 text-sm"
      :class="hasError ? 'border-danger bg-danger-10' : 'bg-white'"
    >
      <label class="flex-1 px-6 flex items-baseline text-body-60 font-bold">
        <span>{{ generalContent.currencySymbol }}</span>
        <div class="relative mx-1 font-semibold">
          <div class="text-6xl/[7rem]">
            {{ amount || '0' }}
          </div>
          <input
            :value="amount"
            class="absolute inset-0 w-full border-0 text-body text-6xl/[7rem] outline-none"
            :min="minAmount"
            :class="{ 'bg-danger-10': hasError }"
            @input="handleInput"
            @keydown.up.prevent="0 /* just stop caret moving */"
            @keyup.up="changeAmount(amount + 1)"
            @keyup.down="changeAmount(amount - 1)"
          />
        </div>
        <div class="flex-0">/ {{ period }}</div>
      </label>

      <div class="flex h-full flex-none flex-col">
        <button
          class="amount-button border-b border-l"
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
    </div>

    <div
      class="flex flex-grow basis-[120px] flex-wrap overflow-hidden rounded p-[1px]"
    >
      <button
        v-for="(definedAmount, index) in definedAmounts"
        :key="index"
        type="button"
        class="flex-grow basis-[90px] p-2 text-sm font-semibold outline outline-1"
        :class="
          definedAmount === amount
            ? 'z-20 bg-link font-bold text-white outline-link-110'
            : 'bg-white outline-primary-40 hover:z-10 hover:bg-link-10 hover:outline-link'
        "
        @click="changeAmount(definedAmount)"
      >
        {{ n(definedAmount, 'currency') }}
      </button>
    </div>

    <div
      v-if="hasError"
      class="col-span-12 mt-0 text-sm font-semibold text-danger"
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
import { generalContent } from '../../store';

const { t, n } = useI18n();

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

const period = computed(() => {
  return props.isMonthly ? t('common.month') : t('common.year');
});
</script>

<style lang="postcss" scoped>
.amount-button {
  @apply h-1/2 border-primary-40 bg-white px-4 py-2 text-primary-70 hover:bg-primary-5 hover:text-primary;
  &.is-invalid {
    @apply cursor-not-allowed text-grey;
  }
}
</style>
