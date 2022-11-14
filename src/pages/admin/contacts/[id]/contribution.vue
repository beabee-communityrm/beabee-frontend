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
import { ref, onBeforeMount } from 'vue';
import {
  GetMemberData,
  GetMemberDataWith,
} from '../../../../utils/api/api.interface';
import { ContributionContent } from '../../../../components/contribution/contribution.interface';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import { PaymentMethod } from '../../../../utils/enums/payment-method.enum';
import { fetchMember } from '../../../../utils/api/member';
import EditManualContribution from '../../../../components/pages/profile/contribution/EditManualContribution.vue';

// const { t } = useI18n();

const props = defineProps<{
  contact: GetMemberData;
}>();

const contact = ref<GetMemberDataWith<
  'profile' | 'contribution' | 'roles'
> | null>(null);

onBeforeMount(async () => {
  contact.value = await fetchMember(props.contact.id, [
    'profile',
    'contribution',
    'roles',
  ]);
});
</script>
