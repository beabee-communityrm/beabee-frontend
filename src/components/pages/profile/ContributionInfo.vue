<template
  ><div class="flex pt-3">
    <AppInfoList>
      <AppInfoListItem
        :name="t('common.joined')"
        :value="formatLocale(contact.joined, 'PPP')"
      />
      <AppInfoListItem
        :name="t('common.contributing')"
        :value="
          contact.contributionAmount
            ? n(contact.contributionAmount, 'currency')
            : '–'
        "
      />
    </AppInfoList>
  </div>
</template>

<script lang="ts" setup>
import { ContributionPeriod } from '@beabee/beabee-common';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatLocale } from '../../../utils/dates';
import { GetContactData } from '../../../utils/api/api.interface';
import AppInfoList from '../../AppInfoList.vue';
import AppInfoListItem from '../../AppInfoListItem.vue';

const { t, n } = useI18n();

const props = defineProps<{
  contact: GetContactData;
}>();

const period = computed(() => {
  return props.contact.contributionPeriod === ContributionPeriod.Monthly
    ? t('common.month')
    : t('common.year');
});

const formattedJoinedDate = computed(() => {
  return formatLocale(props.contact.joined, 'do MMMM y').split(' ');
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
