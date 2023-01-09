<route lang="yaml">
name: adminContactsViewAccount
meta:
  pageTitle: menu.contacts
  role: admin
</route>

<template>
  <div class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <Suspense>
      <ContactUpdateAccount :id="contact.id" />
    </Suspense>
  </div>
</template>
<script lang="ts" setup>
import { GetContactData } from '../../../../utils/api/api.interface';
import ContactUpdateAccount from '../../../../components/contact/ContactUpdateAccount.vue';

defineProps<{
  contact: GetContactData;
}>();
</script>
