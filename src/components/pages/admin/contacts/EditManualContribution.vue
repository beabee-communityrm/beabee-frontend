<template>
  <AppForm
    :button-text="t('contribution.updateContribution')"
    @submit.prevent="handleUpdate"
  >
    <AppHeading class="mt-6 mb-2">
      {{ t('contribution.billing') }}
    </AppHeading>

    <AppSelect
      v-model="contribution.type"
      :label="t('contacts.data.contributionType')"
      :items="contributionTypes"
      class="mb-3"
    />

    <template v-if="contribution.type === ContributionType.Manual">
      <div class="mb-3">
        <AppInput
          v-model="contribution.amount"
          :label="t('contacts.data.amount')"
          type="number"
          :prefix="generalContent.currencySymbol"
        />
      </div>

      <AppRadioGroup
        v-model="contribution.period"
        name="period"
        :label="t('contacts.data.period')"
        :options="[
          ['monthly', 'Monthly'],
          ['yearly', 'Yearly'],
        ]"
        class="mb-4"
      />

      <AppSelect
        v-model="contribution.source"
        :label="t('contacts.data.paymentSource')"
        :items="manualPaymentSources"
        class="mb-3"
      />

      <div class="mb-3">
        <AppInput
          v-model="contribution.reference"
          :label="t('contacts.data.paymentReference')"
        />
      </div>
    </template>
  </AppForm>
</template>
<script lang="ts" setup>
import { reactive, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../forms/AppInput.vue';
import AppSelect from '../../../forms/AppSelect.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import { ContributionType } from '@beabee/beabee-common';
import { forceUpdateContribution } from '../../../../utils/api/member';
import {
  ForceUpdateContributionData,
  GetMemberDataWith,
} from '../../../../utils/api/api.interface';
import { fetchContent } from '../../../../utils/api/content';
import AppHeading from '../../../AppHeading.vue';
import { generalContent } from '../../../../store';
import AppForm from '../../../forms/AppForm.vue';

const { t } = useI18n();

const props = defineProps<{ contact: GetMemberDataWith<'contribution'> }>();

const contribution = reactive<ForceUpdateContributionData>({
  type: ContributionType.None,
  amount: 0,
  period: undefined,
  source: '',
  reference: '',
});

const contributionTypes = [
  {
    id: 'None',
    label: t('common.contributionType.none'),
  },
  {
    id: 'Manual',
    label: t('common.contributionType.manual'),
  },
];

const manualPaymentSources = (
  await fetchContent('contacts')
).manualPaymentSources.map((x) => {
  return { id: x, label: x };
});

watch(
  toRef(props, 'contact'),
  (contact) => {
    // This can't happen as component is only mounted for None/Manual
    if (
      contact.contribution.type !== ContributionType.Manual &&
      contact.contribution.type !== ContributionType.None
    ) {
      return;
    }

    contribution.type = contact.contribution.type;
    contribution.amount = contact.contribution.amount;
    contribution.period = contact.contribution.period;

    const paymentSource = contact.contribution.paymentSource;
    if (paymentSource?.method === null) {
      contribution.source = paymentSource.source || '';
      contribution.reference = paymentSource.reference || '';
    } else {
      // In practice this shouldn't be possible as we've checked that the type is Manual or None
      contribution.source = '';
      contribution.reference = '';
    }
  },
  { immediate: true }
);

async function handleUpdate() {
  if (contribution.type === ContributionType.None) {
    // Save empty values, not what is currently in the form
    await forceUpdateContribution(props.contact.id, {
      type: ContributionType.None,
      amount: undefined,
      period: undefined,
    });
  } else {
    await forceUpdateContribution(props.contact.id, contribution);
  }
}
</script>
