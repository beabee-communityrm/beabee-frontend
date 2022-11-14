<template>
  <form @submit.prevent="handleUpdate">
    <AppHeading class="mt-6 mb-2">
      {{ t('contribution.billing') }}
    </AppHeading>

    <AppSelect
      v-model="contribution.type"
      label="Contribution Type"
      :items="contributionTypes"
      class="mb-3"
    />

    <AppInput
      v-model="contribution.amount"
      label="Amount"
      type="number"
      class="mb-3"
    />

    <AppRadioGroup
      v-if="showChangePeriod"
      v-model="contribution.period"
      name="period"
      label="Period"
      :options="[
        ['monthly', 'Monthly'],
        ['yearly', 'Yearly'],
      ]"
      class="mb-4"
    />

    <AppSelect label="Source" :items="sourceOptions" class="mb-3" />

    <AppInput label="Reference" class="mb-3" />

    <AppButton
      :disabled="!canSubmit || validation.$invalid"
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
import { computed, reactive, ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import AppButton from '../../../forms/AppButton.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppSelect from '../../../forms/AppSelect.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import { ContributionType } from '../../../../utils/enums/contribution-type.enum';
import { MembershipStatus } from '../../../../utils/enums/membership-status.enum';
import {
  fetchMember,
  forceUpdateContribution,
} from '../../../../utils/api/member';
import AppHeading from '../../../AppHeading.vue';

const validation = useVuelidate();

const { t } = useI18n();

const props = defineProps<{
  id: string;
}>();

const contribution = reactive({
  type: 'manual',
  amount: 0,
  period: ContributionPeriod.Monthly,
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
    label: 'Manual',
  },
];

const sourceOptions = [
  {
    id: 'none',
    label: 'None',
  },
  {
    id: 'cheque',
    label: 'Cheque',
  },
];

const loading = ref(false);

const isActiveMember = computed(
  () => contribution.membershipStatus === MembershipStatus.Active
);
const isManualActiveMember = computed(
  () => isActiveMember.value && contribution.type === ContributionType.Manual
);

// Only non-active members and monthly manual contributors can change their period
// as otherwise proration gets complicated
const showChangePeriod = computed(
  () =>
    !isActiveMember.value ||
    (isManualActiveMember.value &&
      contribution.period !== ContributionPeriod.Annually)
);

watch(
  toRef(props, 'id'),
  async (id) => {
    const member = await fetchMember(id, ['contribution']);
    console.log('watch changed, printing member');
    console.log(member);

    contribution.type = member.contribution.type;
    contribution.amount = member.contribution.amount;
    contribution.period = member.contribution.period;
    contribution.source = member.contribution.paymentSource.source;
    contribution.reference = member.contribution.paymentSource.reference;
  },
  { immediate: true }
);

async function handleUpdate() {
  loading.value = true;
  try {
    await forceUpdateContribution(contribution);
  } finally {
    loading.value = false;
  }
}
</script>
