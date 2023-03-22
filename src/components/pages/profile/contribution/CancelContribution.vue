<template>
  <div v-if="canCancel">
    <AppHeading class="mb-4">{{
      t('contribution.cancelContribution')
    }}</AppHeading>

    <p class="mb-3 text-sm">
      {{
        t('contribution.cancelDescription', {
          day: formattedDate.day,
          month: formattedDate.month,
        })
      }}
    </p>

    <AppButton
      class="w-full"
      variant="dangerOutlined"
      to="/profile/contribution/cancel"
    >
      {{ t('contribution.cancelContribution') }}
    </AppButton>
  </div>
</template>

<script lang="ts" setup>
import { ContributionType, MembershipStatus } from '@beabee/beabee-common';
import AppButton from '../../../button/AppButton.vue';
import { formatLocale } from '../../../../utils/dates';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ContributionInfo } from '../../../../utils/api/api.interface';
import AppHeading from '../../../AppHeading.vue';

const { t } = useI18n();

const props = defineProps<{
  contribution: ContributionInfo;
}>();

const canCancel = computed(
  () =>
    props.contribution.membershipStatus === MembershipStatus.Active &&
    props.contribution.type === ContributionType.Automatic
);

const formattedDate = computed(() => {
  return props.contribution.membershipExpiryDate
    ? {
        day: formatLocale(props.contribution.membershipExpiryDate, 'do'),
        month: formatLocale(props.contribution.membershipExpiryDate, 'LLLL'),
      }
    : {};
});
</script>
