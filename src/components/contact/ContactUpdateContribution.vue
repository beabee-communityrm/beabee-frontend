<template>
  <template v-if="!loading">
    <AppForm
      v-if="
        contribution.type === ContributionType.Manual ||
        contribution.type === ContributionType.None
      "
      :button-text="t('contribution.updateContribution')"
      :success-text="t('form.saved')"
      @submit="() => onUpdate?.(contribution)"
    >
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
            ['monthly', t('common.monthly')],
            ['annually', t('common.annually')],
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
    <MessageBox v-else type="warning">
      {{ t('contacts.editNotice') }}
    </MessageBox>
  </template>
</template>
<script lang="ts" setup>
import { ContributionType } from '@beabee/beabee-common';
import { reactive, ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../forms/AppInput.vue';
import AppSelect from '../forms/AppSelect.vue';
import AppRadioGroup from '../forms/AppRadioGroup.vue';
import { fetchMember } from '../../utils/api/member';
import { fetchContent } from '../../utils/api/content';
import { generalContent } from '../../store';
import AppForm from '../forms/AppForm.vue';
import MessageBox from '../MessageBox.vue';
import { UpdateContribution } from './contact.interface';

const { t } = useI18n();

const props = defineProps<{
  id: string;
  onUpdate?: (contribution: UpdateContribution) => Promise<unknown>;
}>();

const loading = ref(true);
const contribution = reactive<UpdateContribution>({
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

const manualPaymentSources = [
  {
    id: '',
    label: '',
  },
  ...(await fetchContent('contacts')).manualPaymentSources.map((x) => {
    return { id: x, label: x };
  }),
];

watch(
  toRef(props, 'id'),
  async (id) => {
    loading.value = true;
    const contact = await fetchMember(id, ['contribution']);

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
    loading.value = false;
  },
  { immediate: true }
);
</script>
