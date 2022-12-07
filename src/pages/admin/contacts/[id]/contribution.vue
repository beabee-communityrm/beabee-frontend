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
        <ContactUpdateContribution :id="contact.id" />
      </Suspense>
    </div>
    <div>
      <ContactPaymentsHistory :id="contact.id" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { GetMemberData } from '../../../../utils/api/api.interface';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../components/AppHeading.vue';
import ContactPaymentsHistory from '../../../../components/contact/ContactPaymentsHistory.vue';
import ContactUpdateContribution from '../../../../components/contact/ContactUpdateContribution.vue';

const { t } = useI18n();

defineProps<{ contact: GetMemberData }>();
</script>
