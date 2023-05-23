<route lang="yaml">
name: adminContactsViewContribution
meta:
  pageTitle: menu.contacts
  role: admin
</route>

<template>
  <div class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <div>
      <AppHeading class="mb-2">
        {{ t('contribution.updateContribution') }}
      </AppHeading>
      <template v-if="contributionData && contributionInfo">
        <AppForm
          v-if="
            contributionInfo.type === ContributionType.Manual ||
            contributionInfo.type === ContributionType.None
          "
          :button-text="t('contribution.updateContribution')"
          :success-text="t('form.saved')"
          @submit="handleUpdateContribution"
        >
          <ContactContributionFields v-model="contributionData" />
        </AppForm>
        <template v-else>
          <AppNotification
            variant="warning"
            class="mb-6"
            :title="t('contactContribution.updateNotice.title')"
          >
            {{ t('contactContribution.updateNotice.text') }}
          </AppNotification>

          <ContactCancelContribution
            :id="contact.id"
            :contribution="contributionInfo"
            @cancel="showCancelDialog = true"
          />
          <AppConfirmDialog
            :open="showCancelDialog"
            :title="t('contactContribution.confirmCancel.title')"
            :confirm="t('contactContribution.confirmCancel.confirm')"
            :cancel="t('actions.noBack')"
            @close="showCancelDialog = false"
            @confirm="handleCancelContribution"
          >
            <p>{{ t('contactContribution.confirmCancel.text') }}</p>
          </AppConfirmDialog>
        </template>
      </template>
    </div>
    <div>
      <ContactPaymentsHistory :id="contact.id" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ContributionType } from '@beabee/beabee-common';
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ContributionInfo,
  GetContactData,
} from '../../../../utils/api/api.interface';
import AppHeading from '../../../../components/AppHeading.vue';
import ContactPaymentsHistory from '../../../../components/contact/ContactPaymentsHistory.vue';
import {
  fetchContact,
  forceUpdateContribution,
} from '../../../../utils/api/contact';
import { UpdateContribution } from '../../../../components/contact/contact.interface';
import AppForm from '../../../../components/forms/AppForm.vue';
import ContactContributionFields from '../../../../components/contact/ContactContributionFields.vue';
import ContactCancelContribution from '../../../../components/contact/ContactCancelContribution.vue';
import AppConfirmDialog from '../../../../components/AppConfirmDialog.vue';
import { cancelContribution } from '../../../../utils/api/contact';
import { useRouter } from 'vue-router';
import AppNotification from '../../../../components/AppNotification.vue';

const { t } = useI18n();

const props = defineProps<{ contact: GetContactData }>();

const router = useRouter();

const contributionInfo = ref<ContributionInfo>();
const contributionData = ref<UpdateContribution>();
const showCancelDialog = ref(false);

onBeforeMount(async () => {
  const contact = await fetchContact(props.contact.id, ['contribution']);

  contributionInfo.value = contact.contribution;
  contributionData.value = {
    type: contact.contribution.type,
    amount: contact.contribution.amount,
    period: contact.contribution.period,
    ...(contact.contribution.paymentSource?.method === null
      ? {
          source: contact.contribution.paymentSource.source,
          reference: contact.contribution.paymentSource.reference,
        }
      : {
          source: undefined,
          reference: undefined,
        }),
  };
});

async function handleUpdateContribution() {
  if (!contributionData.value) return; // Can't submit without contribution laoded

  if (contributionData.value.type === ContributionType.None) {
    // Save empty values, not what is currently in the form
    await forceUpdateContribution(props.contact.id, {
      type: ContributionType.None,
      amount: undefined,
      period: undefined,
    });
  } else if (contributionData.value.type === ContributionType.Manual) {
    await forceUpdateContribution(props.contact.id, {
      ...contributionData.value,
      type: ContributionType.Manual, // Why doesn't TS narrow this type?
    });
  }
}

async function handleCancelContribution() {
  await cancelContribution(props.contact.id);
  showCancelDialog.value = false;
  router.push({ path: '/admin/contacts/' + props.contact.id });
}
</script>
