<template>
  <form @submit.prevent="handleUpdate">
    <AppHeading class="mt-6 mb-2">
      {{ t('contribution.billing') }}
    </AppHeading>

    <AppInput label="Amount" type="number" class="mb-3" />

    <AppRadioGroup
      v-model="currentPeriod"
      name="period"
      label="Period"
      :options="[
        [false, 'Monthly'],
        [true, 'Yearly'],
      ]"
      class="mb-4"
    />

    <AppSelect label="Source" :items="periodOptions" class="mb-3" />

    <AppInput label="Reference" class="mb-3" />

    <AppButton
      :disabled="!canSubmit || validation.$invalid"
      type="submit"
      variant="link"
      class="mt-6"
      :loading="loading"
    >
      {{
        isManualActiveMember
          ? t('contribution.updatePaymentType')
          : isActiveMember
          ? t('contribution.updateContribution')
          : isExpiringMember
          ? t('contribution.restartContribution')
          : t('contribution.startContribution')
      }}
    </AppButton>
  </form>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import AppButton from '../../../forms/AppButton.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppSelect from '../../../forms/AppSelect.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import { ContributionContent } from '../../../contribution/contribution.interface';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import { ContributionInfo } from '../../../../utils/api/api.interface';
import { PaymentMethod } from '../../../../utils/enums/payment-method.enum';
import { ContributionType } from '../../../../utils/enums/contribution-type.enum';
import { MembershipStatus } from '../../../../utils/enums/membership-status.enum';
import { updateContribution } from '../../../../utils/api/member';
// import { currentUser } from '../../../../store/currentUser';
import AppHeading from '../../../AppHeading.vue';

const validation = useVuelidate();

const { t } = useI18n();

const props = defineProps<{
  modelValue: ContributionInfo;
  content: ContributionContent;
}>();

const contribution = reactive({
  amount: 5,
  period: ContributionPeriod.Monthly,
  source: '',
  reference: '',
});

const periodOptions = [
  {
    id: 'auto',
    label: 'Automatic',
  },
  {
    id: 'manual',
    label: 'Manual',
  },
];

const cantUpdate = ref(false);
const hasUpdated = ref(false);
const loading = ref(false);

const isActiveMember = computed(
  () => props.modelValue.membershipStatus === MembershipStatus.Active
);
const isExpiringMember = computed(
  () => props.modelValue.membershipStatus === MembershipStatus.Expiring
);

const isManualActiveMember = computed(
  () =>
    isActiveMember.value && props.modelValue.type === ContributionType.Manual
);
const isAutoActiveMember = computed(
  () =>
    isActiveMember.value && props.modelValue.type === ContributionType.Automatic
);

// Only non-active members and monthly manual contributors can change their period
// as otherwise proration gets complicated
/*
const showChangePeriod = computed(
  () =>
    !isActiveMember.value ||
    (isManualActiveMember.value &&
      props.modelValue.period !== ContributionPeriod.Annually)
);
*/

const canSubmit = computed(
  () =>
    !isAutoActiveMember.value || props.modelValue.amount != contribution.amount
);

async function handleUpdate() {
  loading.value = true;
  try {
    // const data = await updateContribution(contribution);
    await updateContribution(contribution);
    hasUpdated.value = true;
  } finally {
    loading.value = false;
  }
}
</script>
