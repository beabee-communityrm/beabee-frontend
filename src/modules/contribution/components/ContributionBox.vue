<template>
  <div class="flex flex-col p-8 bg-white shadow">
    <template v-if="status === 'expired'">
      <p class="text-lg mb-2 font-semibold">{{ t('contribution.expired') }}</p>

      <p>
        {{ t('contribution.expiredText') }}
      </p>
    </template>

    <div v-else class="text-center">
      <div class="mb-2">{{ t('contribution.contributing') }}</div>

      <div class="text-3.5xl font-bold leading-7">
        {{ n(amount, 'currency') }}
      </div>

      <div class="font-bold mb-1.5">{{ t('common.every') }} {{ period }}</div>

      <div v-if="status === 'expiring'">
        <i18n-t keypath="contribution.willExpire">
          <template #expires>
            <span class="text-danger"> {{ formattedExpiryDate }}</span>
          </template>
        </i18n-t>
      </div>

      <div v-else>
        <div>{{ t('common.thankYou') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { formatDistanceLocale } from '../../../utils/dates/locale-date-formats';
import { computed } from '@vue/reactivity';
import { parseISO } from 'date-fns';

const { n, t } = useI18n();

const props = defineProps({
  amount: {
    type: Number,
    default: 0,
  },
  period: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: '',
  },
  expiryDate: {
    type: String as () => null | string,
    default: '',
  },
});

const formattedExpiryDate = computed(() => {
  if (!props.expiryDate) return '';
  const parsedDate = parseISO(props.expiryDate);
  return formatDistanceLocale(new Date(), parsedDate);
});
</script>
