<route lang="yaml">
name: adminContactsViewAccount
meta:
  pageTitle: menu.contacts
  role: admin
</route>

<template>
  <App2ColGrid>
    <template #col1>
      <Suspense>
        <ContactUpdateAccount :id="contact.id" />
      </Suspense>
    </template>
  </App2ColGrid>
</template>
<script lang="ts" setup>
import { GetContactData } from '../../../../utils/api/api.interface';
import ContactUpdateAccount from '../../../../components/contact/ContactUpdateAccount.vue';
import App2ColGrid from '../../../../components/App2ColGrid.vue';

defineProps<{
  contact: GetContactData;
}>();
</script>
