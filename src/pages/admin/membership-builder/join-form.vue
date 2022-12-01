<route lang="yaml">
name: adminMembershipBuilderJoinForm
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <div class="mb-8 grid grid-cols-2 gap-8">
    <div>
      <AppHeading class="mb-5">{{ stepT('title') }}</AppHeading>
      <p>{{ stepT('text') }}</p>
    </div>
  </div>
  <div v-if="joinContent" class="mb-12 grid grid-cols-2 gap-8">
    <div>
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

      <h4 class="mb-4 text-lg font-semibold">
        {{ stepT('suggestedAmounts') }} *
      </h4>
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
          <AppLabel :label="stepT('minAmount')" />
          <AppInput
            v-model="joinContent.minMonthlyAmount"
            type="number"
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
      <AppCheckbox
        v-model="joinContent.showAbsorbFee"
        :label="stepT('showAbsorbFee')"
        class="font-semibold"
      />
    </div>
    <div
      class="bg-cover bg-center p-4 pt-8"
      :style="`background-image: url(${backgroundUrl})`"
    >
      <AuthBox>
        <JoinForm :join-content="joinContent" @submit.prevent="" />
      </AuthBox>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { JoinContent } from '../../../utils/api/api.interface';
import { fetchContent } from '../../../utils/api/content';
import AppInput from '../../../components/forms/AppInput.vue';
import RichTextEditor from '../../../components/rte/RichTextEditor.vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppLabel from '../../../components/forms/AppLabel.vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../components/forms/AppSelect.vue';
import { ContributionPeriod } from '../../../utils/enums/contribution-period.enum';
import AppCheckbox from '../../../components/forms/AppCheckbox.vue';
import JoinForm from '../../../components/pages/join/JoinForm.vue';
import AuthBox from '../../../components/AuthBox.vue';
import AppImageUpload from '../../../components/forms/AppImageUpload.vue';
import { generalContent } from '../../../store';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import PeriodAmounts from '../../../components/pages/admin/membership-builder/PeriodAmounts.vue';

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

const validation = useVuelidate(
  { backgroundUrl: { required } },
  { backgroundUrl }
);

onBeforeMount(async () => {
  joinContent.value = await fetchContent('join');
  backgroundUrl.value = generalContent.value.backgroundUrl || '';
});
</script>
