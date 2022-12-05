<route lang="yaml">
name: adminContactsViewInformation
meta:
  pageTitle: menu.community
  role: admin
</route>

<template>
  <div class="grid lg:grid-cols-2 xl:grid-cols-3">
    <Suspense>
      <UpdateContactInformation :id="contact.id" />
    </Suspense>
  </div>
</template>
<script lang="ts" setup>
import { GetContactData } from '../../../../utils/api/api.interface';
import UpdateContactInformation from '../../../../components/pages/profile/information/UpdateContactInformation.vue';

defineProps<{
  contact: GetContactData;
}>();
</script>
