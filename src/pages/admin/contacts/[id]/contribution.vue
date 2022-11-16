<route lang="yaml">
name: adminContactsViewContribution
meta:
  pageTitle: menu.community
  role: admin
</route>

<template>
  <div class="grid lg:grid-cols-2 xl:grid-cols-3">
    <Suspense>
      <EditManualContribution :id="contact.id" />
    </Suspense>
  </div>
</template>
<script lang="ts" setup>
// import { useI18n } from 'vue-i18n';
import { GetMemberData } from '../../../../utils/api/api.interface';
import EditManualContribution from '../../../../components/pages/admin/contacts/EditManualContribution.vue';

defineProps<{
  contact: GetMemberData;
}>();
</script>
