<template>
  <div
    v-if="
      contribution.type !== ContributionType.None &&
      contribution.membershipStatus !== MembershipStatus.None
    "
    class="flex flex-col p-8 bg-white shadow"
  >
    <template v-if="contribution.membershipStatus === MembershipStatus.Expired">
      <p class="text-lg mb-2 font-semibold">{{ t('contribution.expired') }}</p>

      <p>
        {{ t('contribution.expiredText') }}
      </p>
    </template>

    <div v-else class="text-center">
      <div class="mb-2">{{ t('contribution.contributing') }}</div>

      <div class="text-3.5xl font-bold leading-7">
        {{ n(contribution.amount!, 'currency') }}
      </div>

      <div class="font-bold mb-1.5">{{ t('common.every') }} {{ period }}</div>

      <div v-if="contribution.membershipStatus === MembershipStatus.Expiring">
        <i18n-t keypath="contribution.willExpire">
          <template #expires>
            <b class="text-danger"> {{ formattedExpiryDate }}</b>
          </template>
        </i18n-t>
      </div>
      <div
        v-else-if="contribution.membershipStatus === MembershipStatus.Active"
      >
        <p>{{ t('common.thankYou') }}</p>
        <div class="mt-2 text-body-80 text-sm">
          <i18n-t
            v-if="contribution.hasPendingPayment"
            keypath="contribution.hasPendingPayment"
          />
          <i18n-t
            v-else-if="contribution.renewalDate"
            :keypath="
              contribution.type === ContributionType.Automatic
                ? 'contribution.willRenew'
                : 'contribution.dueToRenew'
            "
          >
            <template #renewalDate>
              <b>{{ formatLocale(contribution.renewalDate, 'PPP') }}</b>
            </template>
          </i18n-t>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {
  formatDistanceLocale,
  formatLocale,
} from '../../../utils/dates/locale-date-formats';
import { computed } from '@vue/reactivity';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import { ContributionInfo } from '../../../utils/api/api.interface';
import { MembershipStatus } from '../../../utils/enums/membership-status.enum';
import { ContributionType } from '../../../utils/enums/contribution-type.enum';

const { n, t } = useI18n();

const props = defineProps<{
  contribution: ContributionInfo;
}>();

const period = computed(() =>
  props.contribution.period === ContributionPeriod.Monthly
    ? t('common.month')
    : t('common.year')
);

const formattedExpiryDate = computed(() =>
  props.contribution.membershipExpiryDate
    ? formatDistanceLocale(new Date(), props.contribution.membershipExpiryDate)
    : undefined
);
</script>
