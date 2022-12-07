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
        <EditManualContribution v-if="showEditForm" :contact="contact" />
        <MessageBox v-else type="warning">
          {{ t('contacts.editNotice') }}
        </MessageBox>
      </Suspense>
    </div>
    <div>
      <PaymentsHistory :id="contact.id" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { GetMemberDataWith } from '../../../../utils/api/api.interface';
import { ContributionType } from '@beabee/beabee-common';
import EditManualContribution from '../../../../components/pages/admin/contacts/EditManualContribution.vue';
import { useI18n } from 'vue-i18n';
import PaymentsHistory from '../../../../components/pages/profile/contribution/PaymentsHistory.vue';
import AppHeading from '../../../../components/AppHeading.vue';
import MessageBox from '../../../../components/MessageBox.vue';

const { t } = useI18n();

const props = defineProps<{
  contact: GetMemberDataWith<'contribution'>;
}>();

const showEditForm = computed(
  () =>
    props.contact.contribution.type === ContributionType.Manual ||
    props.contact.contribution.type === ContributionType.None
);
</script>
