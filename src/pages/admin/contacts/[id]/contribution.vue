<route lang="yaml">
name: adminContactsViewContribution
meta:
  pageTitle: menu.community
  role: admin
</route>

<template>
  <div class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <div>
      <AppHeading class="mb-2">
        {{ t('contribution.billing') }}
      </AppHeading>
      <Suspense>
        <ContactUpdateContribution
          :id="contact.id"
          @update="handleUpdateContribution"
        />
      </Suspense>
    </div>
    <div>
      <ContactPaymentsHistory :id="contact.id" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ContributionType } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import { GetMemberData } from '../../../../utils/api/api.interface';
import AppHeading from '../../../../components/AppHeading.vue';
import ContactPaymentsHistory from '../../../../components/contact/ContactPaymentsHistory.vue';
import ContactUpdateContribution from '../../../../components/contact/ContactUpdateContribution.vue';
import { forceUpdateContribution } from '../../../../utils/api/member';
import { UpdateContribution } from '../../../../components/contact/contact.interface';

const { t } = useI18n();

const props = defineProps<{ contact: GetMemberData }>();

async function handleUpdateContribution(contribution: UpdateContribution) {
  if (contribution.type === ContributionType.None) {
    // Save empty values, not what is currently in the form
    await forceUpdateContribution(props.contact.id, {
      type: ContributionType.None,
      amount: undefined,
      period: undefined,
    });
  } else if (contribution.type === ContributionType.Manual) {
    await forceUpdateContribution(props.contact.id, {
      ...contribution,
      type: ContributionType.Manual, // Why doesn't TS narrow this type?
    });
  }
}
</script>
