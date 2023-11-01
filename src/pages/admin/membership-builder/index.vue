<route lang="yaml">
name: adminMembershipBuilderJoinForm
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <p class="mb-8">{{ stepT('text') }}</p>

  <App2ColGrid v-if="joinContent" extended>
    <template #col1>
      <AppForm
        :button-text="t('form.saveChanges')"
        :success-text="t('form.saved')"
        @submit="handleUpdate"
      >
        <div class="mb-4">
          <AppInput
            v-model="joinContent.title"
            :label="stepT('formTitle')"
            required
          />
        </div>
        <RichTextEditor
          v-model="joinContent.subtitle"
          :label="stepT('formSubtitle')"
          class="mb-4"
        />

        <AppImageUpload
          v-model="validation.backgroundUrl.$model"
          :label="stepT('backgroundImage')"
          :width="1440"
          :height="810"
          class="mb-4"
          required
          :error-message="validation.backgroundUrl.$errors[0]?.$message"
        />

        <AppSubHeading class="mb-2">
          {{ stepT('suggestedAmounts') }}
        </AppSubHeading>
        <div class="mb-4 flex gap-4">
          <PeriodAmounts
            v-for="(period, periodI) in joinContent.periods"
            :key="period.name"
            v-model="joinContent.periods[periodI].presetAmounts"
            :period="period.name"
            :min-monthly-amount="joinContent.minMonthlyAmount"
            class="flex-1"
          />
        </div>
        <div class="mb-4 flex gap-4">
          <div class="flex-1">
            <AppInput
              v-model="joinContent.minMonthlyAmount"
              type="number"
              :label="stepT('minAmount')"
              :min="1"
              required
              class="block w-32"
            />
          </div>
          <div class="flex-1">
            <AppSelect
              v-model="selectedDefaultAmount"
              :label="stepT('defaultAmount')"
              :items="defaultAmounts"
              required
            />
          </div>
        </div>

        <AppSubHeading class="mb-2">
          {{ stepT('payment') }}
        </AppSubHeading>

        <AppCheckboxGroup
          v-model="joinContent.paymentMethods"
          :label="stepT('paymentMethods.label')"
          :info-message="stepT('paymentMethods.help')"
          :options="availablePaymentMethods"
          class="mb-4"
          required
        />
        <AppCheckbox
          v-model="joinContent.showAbsorbFee"
          :label="stepT('showAbsorbFee')"
          class="mb-4"
        />
      </AppForm>
    </template>
    <template #col2>
      <JoinForm :join-content="joinContent" preview />
    </template>
  </App2ColGrid>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { JoinContent } from '../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../utils/api/content';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import RichTextEditor from '../../../components/rte/RichTextEditor.vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../components/forms/AppSelect.vue';
import { ContributionPeriod } from '@beabee/beabee-common';
import AppCheckbox from '../../../components/forms/AppCheckbox.vue';
import JoinForm from '../../../components/pages/join/JoinForm.vue';
import AppImageUpload from '../../../components/forms/AppImageUpload.vue';
import { generalContent } from '../../../store';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import PeriodAmounts from '../../../components/pages/admin/membership-builder/PeriodAmounts.vue';
import App2ColGrid from '../../../components/App2ColGrid.vue';
import AppSubHeading from '../../../components/AppSubHeading.vue';
import AppCheckboxGroup from '../../../components/forms/AppCheckboxGroup.vue';

const joinContent = ref<JoinContent>();
const backgroundUrl = ref('');

const { n, t } = useI18n();

const stepT = (key: string) => t('membershipBuilder.steps.joinForm.' + key);

const selectedDefaultAmount = computed({
  get: () =>
    joinContent.value
      ? `${joinContent.value.initialPeriod}_${joinContent.value.initialAmount}`
      : '',
  set: (defaultAmount) => {
    if (joinContent.value) {
      const [periodName, amount] = defaultAmount.split('_');
      joinContent.value.initialPeriod = periodName as ContributionPeriod;
      joinContent.value.initialAmount = Number(amount);
    }
  },
});

const defaultAmounts = computed(() => {
  return joinContent.value
    ? joinContent.value.periods.flatMap((period) =>
        period.presetAmounts.map((amount) => ({
          id: `${period.name}_${amount}`,
          label: `${n(amount, 'currency')}/${t('common.' + period.name)}`,
        }))
      )
    : [];
});

const availablePaymentMethods = computed<[string, string][]>(() =>
  joinContent.value
    ? joinContent.value.availablePaymentMethods.map((method) => [
        method,
        `${method.startsWith('s_') ? 'Stripe' : 'GoCardless'}: ${t(
          `paymentMethods.${method}.label`
        )}`,
      ])
    : []
);

const validation = useVuelidate(
  { backgroundUrl: { required } },
  { backgroundUrl }
);

async function handleUpdate() {
  if (joinContent.value) {
    await Promise.all([
      updateContent('join', joinContent.value),
      updateContent('general', {
        backgroundUrl: backgroundUrl.value || '',
      }),
    ]);
  }
}

onBeforeMount(async () => {
  joinContent.value = await fetchContent('join');
  backgroundUrl.value = generalContent.value.backgroundUrl || '';
});
</script>
