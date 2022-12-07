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
        <EditManualContribution :id="contact.id" />
      </Suspense>
    </div>
    <div>
      <PaymentsHistory :id="contact.id" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { GetMemberData } from '../../../../utils/api/api.interface';
import EditManualContribution from '../../../../components/pages/admin/contacts/EditManualContribution.vue';
import { useI18n } from 'vue-i18n';
import PaymentsHistory from '../../../../components/pages/profile/contribution/PaymentsHistory.vue';
import AppHeading from '../../../../components/AppHeading.vue';

const { t } = useI18n();

defineProps<{ contact: GetMemberData }>();
</script>
