<route lang="yaml">
name: adminContactsViewContribution
meta:
  pageTitle: menu.community
  role: admin
</route>

<template>
  <div class="grid lg:grid-cols-2 xl:grid-cols-3">
    <Suspense>
      <EditManualContribution v-if="showEditForm" :contact="contact" />
      <p v-else>
        {{ t('contacts.editNotice') }}
      </p>
    </Suspense>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { GetMemberDataWith } from '../../../../utils/api/api.interface';
import { ContributionType } from '@beabee/beabee-common';
import EditManualContribution from '../../../../components/pages/admin/contacts/EditManualContribution.vue';
import { useI18n } from 'vue-i18n';

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
