<template>
  <div class="flex pt-3 w-76">
    <div class="flex-1">
      <div class="title uppercase">{{ t('common.joined') }}</div>

      <div class="content">
        <div v-for="(item, index) in formattedJoinedDate" :key="index">
          {{ item }}
        </div>
      </div>
    </div>

    <div class="w-px bg-primary-20" />

    <div class="flex-1 pl-4">
      <div class="title uppercase">{{ t('common.contributing') }}</div>

      <div class="content">
        {{ n(contributionInfo.contributionAmount, 'currency') }}<br />
        {{ t('common.every') }}<br />
        {{ period }}<br />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { useI18n } from 'vue-i18n';
import { ContributionInfo } from './contribution.interface';
import { ContributionPeriod } from '../../utils/enums/contribution-period.enum';
import { parseISO } from 'date-fns';
import { formatLocale } from '../../utils/dates/locale-date-formats';

const { t, n } = useI18n();

const props = defineProps({
  contributionInfo: {
    type: Object as () => ContributionInfo,
    default: () => ({}),
  },
});

const period = computed(() => {
  return props.contributionInfo.contributionPeriod ===
    ContributionPeriod.Monthly
    ? t('common.month')
    : t('common.year');
});

const formattedJoinedDate = computed(() => {
  if (!props.contributionInfo.joined) return;
  const parsedDate = parseISO(props.contributionInfo.joined);
  return formatLocale(parsedDate, 'do MMMM y').split(' ');
});
</script>

<style scoped>
.title {
  @apply text-sm text-primary-40 font-semibold -mt-3 mb-3;
}

.content {
  @apply font-bold;
}
</style>
