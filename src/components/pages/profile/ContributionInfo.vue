<template>
  <div class="flex w-[17rem] pt-3">
    <div class="flex-1">
      <div class="title uppercase">{{ t('common.joined') }}</div>

      <div class="content">
        <div v-for="(item, index) in formattedJoinedDate" :key="index">
          {{ item }}
        </div>
      </div>
    </div>

    <div v-if="member.contributionAmount" class="w-px bg-primary-20" />

    <div v-if="member.contributionAmount" class="flex-1 pl-4">
      <div class="title uppercase">{{ t('common.contributing') }}</div>

      <div class="content">
        {{ n(member.contributionAmount, 'currency') }}<br />
        {{ t('common.every') }}<br />
        {{ period }}<br />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import { GetMemberData } from '../../../utils/api/api.interface';

const { t, n } = useI18n();

const props = defineProps<{
  member: GetMemberData;
}>();

const period = computed(() => {
  return props.member.contributionPeriod === ContributionPeriod.Monthly
    ? t('common.month')
    : t('common.year');
});

const formattedJoinedDate = computed(() => {
  return formatLocale(props.member.joined, 'do MMMM y').split(' ');
});
</script>

<style lang="postcss" scoped>
.title {
  @apply -mt-3 mb-3 text-sm font-semibold text-primary-80;
}

.content {
  @apply font-bold;
}
</style>
