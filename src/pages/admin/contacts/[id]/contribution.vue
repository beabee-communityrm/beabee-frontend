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
      <template v-if="contribution">
        <AppForm
          v-if="
            contribution.type === ContributionType.Manual ||
            contribution.type === ContributionType.None
          "
          :button-text="t('contribution.updateContribution')"
          :success-text="t('form.saved')"
          @submit="handleUpdateContribution"
        >
          <ContactContributionFields v-model="contribution" />
        </AppForm>
        <MessageBox v-else type="warning">
          {{ t('contacts.editNotice') }}
        </MessageBox>
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
import { GetContactData } from '../../../../utils/api/api.interface';
import AppHeading from '../../../../components/AppHeading.vue';
import ContactPaymentsHistory from '../../../../components/contact/ContactPaymentsHistory.vue';
import {
  fetchContact,
  forceUpdateContribution,
} from '../../../../utils/api/contact';
import { UpdateContribution } from '../../../../components/contact/contact.interface';
import AppForm from '../../../../components/forms/AppForm.vue';
import ContactContributionFields from '../../../../components/contact/ContactContributionFields.vue';
import MessageBox from '../../../../components/MessageBox.vue';

const { t } = useI18n();

const props = defineProps<{ contact: GetContactData }>();

const contribution = ref<UpdateContribution>();

onBeforeMount(async () => {
  contribution.value = undefined;

  const contact = await fetchContact(props.contact.id, ['contribution']);

  contribution.value = {
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
  if (!contribution.value) return; // Can't submit without contribution laoded

  if (contribution.value.type === ContributionType.None) {
    // Save empty values, not what is currently in the form
    await forceUpdateContribution(props.contact.id, {
      type: ContributionType.None,
      amount: undefined,
      period: undefined,
    });
  } else if (contribution.value.type === ContributionType.Manual) {
    await forceUpdateContribution(props.contact.id, {
      ...contribution.value,
      type: ContributionType.Manual, // Why doesn't TS narrow this type?
    });
  }
}
</script>
