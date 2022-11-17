<template>
  <form @submit.prevent="handleUpdate">
    <AppHeading class="mt-6 mb-2">
      {{ t('contribution.billing') }}
    </AppHeading>

    <AppSelect
      v-model="contribution.type"
      :label="t('contacts.data.contributionType')"
      :items="contributionTypes"
      class="mb-3"
    />

    <AppInput
      v-model="contribution.amount"
      :label="t('contacts.data.amount')"
      type="number"
      class="mb-3"
    />

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

    <AppInput
      v-model="contribution.reference"
      :label="t('contacts.data.paymentReference')"
      class="mb-3"
    />

    <AppButton
      :disabled="validation.$invalid"
      type="submit"
      variant="link"
      class="mt-6"
      :loading="loading"
    >
      {{ t('contribution.updateContribution') }}
    </AppButton>
  </form>
</template>
<script lang="ts" setup>
import { reactive, ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import AppButton from '../../../forms/AppButton.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppSelect from '../../../forms/AppSelect.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import { ContributionType } from '@beabee/beabee-common';
import {
  fetchMember,
  forceUpdateContribution,
} from '../../../../utils/api/member';
import { fetchContent } from '../../../../utils/api/content';
import AppHeading from '../../../AppHeading.vue';

const validation = useVuelidate();

const { t } = useI18n();

const props = defineProps<{
  id: string;
}>();

const contribution = reactive({
  type: ContributionType.None,
  amount: 0,
  period: null,
  source: '',
  reference: '',
});

const contributionTypes = [
  {
    id: 'None',
    label: 'None',
  },
  {
    id: 'Manual',
    label: t('common.contributionType.manual'),
  },
  {
    id: 'Automatic',
    label: t('common.contributionType.automatic'),
  },
];

const manualPaymentSources = (await fetchContent('contacts'))
  .manualPaymentSources;

const loading = ref(false);

watch(
  toRef(props, 'id'),
  async (id) => {
    const member = await fetchMember(id, ['contribution']);
    contribution.type = member.contribution.type;
    contribution.amount = member.contribution.amount
      ? member.contribution.amount
      : 0;
    contribution.period = member.contribution.period;

    const paymentSource = member.contribution.paymentSource;
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
  loading.value = true;
  try {
    await forceUpdateContribution(props.id, contribution);
  } finally {
    loading.value = false;
  }
}
</script>
