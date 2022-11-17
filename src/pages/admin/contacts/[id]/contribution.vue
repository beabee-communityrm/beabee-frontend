<route lang="yaml">
name: adminContactsViewContribution
meta:
  pageTitle: menu.community
  role: admin
</route>

<template>
  <div class="grid lg:grid-cols-2 xl:grid-cols-3">
    <Suspense>
      <EditManualContribution v-if="showEditForm" :id="contact.id" />
      <p v-else>
        Editing a member's contribution is only possible when their contribution
        is Manual.
      </p>
    </Suspense>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { GetMemberDataWith } from '../../../../utils/api/api.interface';
import { ContributionType } from '@beabee/beabee-common';
import EditManualContribution from '../../../../components/pages/admin/contacts/EditManualContribution.vue';

const showEditForm = ref(false);

const props = defineProps<{
  contact: GetMemberDataWith<'contribution'>;
}>();

onBeforeMount(() => {
  if (
    props.contact.contribution.type === ContributionType.Manual ||
    props.contact.contribution.type === ContributionType.None
  ) {
    showEditForm.value = true;
  }
});
</script>
