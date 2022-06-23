<template>
  <form @submit.prevent="handleSubmit">
    <div v-if="joinContent" class="flex gap-8 mb-12">
      <div class="flex-1">
        <AppHeading class="mb-5">Join form editor</AppHeading>
        <AppInput
          v-model="joinContent.title"
          label="Title"
          required
          class="mb-4"
        />
        <RichTextEditor
          v-model="joinContent.subtitle"
          label="Subtitle"
          class="mb-4"
        />

        <h4 class="font-semibold text-lg mb-4">
          Suggested contribution amounts
        </h4>
        <div class="flex gap-4 mb-4">
          <div
            v-for="(period, periodI) in joinContent.periods"
            :key="period.name"
            class="flex-1"
          >
            <AppLabel :label="t('common.' + period.name)" />
            <AppInput
              v-for="(amount, i) in period.presetAmounts"
              :key="i"
              v-model="joinContent.periods[periodI].presetAmounts[i]"
              input-type="number"
              class="w-32 block mb-2"
            />
          </div>
        </div>
        <div class="flex gap-4 mb-4">
          <div class="flex-1">
            <AppLabel label="Minimum amount" />
            <AppInput
              v-model="joinContent.minMonthlyAmount"
              input-type="number"
              class="w-32 block mb-2"
            />
          </div>
          <div class="flex-1">
            <AppLabel label="Default amount" />
            <AppSelect
              v-model="selectedDefaultAmount"
              :items="defaultAmounts"
            />
          </div>
        </div>
        <AppCheckbox
          v-model="joinContent.showAbsorbFee"
          label="Ask about processing fee"
          class="font-semibold"
        />
      </div>
      <div class="flex-1 mt-4">
        <JoinForm :join-content="joinContent" />
      </div>
    </div>
    <div v-if="setupContent" class="flex gap-8">
      <div class="flex-1">
        <AppHeading class="mb-4">Account confirmation</AppHeading>
        <AppInput
          v-model="setupContent.welcome"
          class="mb-4"
          label="Welcome message"
          required
        />

        <AppCheckbox
          v-model="setupContent.showMailOptIn"
          label="Ask for postal address"
          class="font-semibold mb-4"
        />

        <template v-if="setupContent.showMailOptIn">
          <AppInput
            v-model="setupContent.mailTitle"
            label="Heading"
            class="mb-4"
            required
          />
          <AppTextArea
            v-model="setupContent.mailText"
            label="Subheading"
            class="mb-4"
          />
          <AppInput
            v-model="setupContent.mailOptIn"
            label="Checkbox label"
            class="mb-4"
          />
        </template>

        <AppCheckbox
          v-model="setupContent.showNewsletterOptIn"
          label="Ask to subscribe to newsletter"
          class="font-semibold mb-4"
        />

        <template v-if="setupContent.showNewsletterOptIn">
          <AppInput
            v-model="setupContent.newsletterTitle"
            label="Heading"
            class="mb-4"
            required
          />
          <AppTextArea
            v-model="setupContent.newsletterText"
            label="Subheading"
            class="mb-4"
          />
          <AppInput
            v-model="setupContent.newsletterOptIn"
            label="Checkbox label"
            class="mb-4"
          />
        </template>
      </div>
      <div class="flex-1"><SetupForm :setup-content="setupContent" /></div>
    </div>
    <AppButton
      v-if="joinContent && setupContent"
      type="submit"
      variant="link"
      class="w-32"
      >Save</AppButton
    >
  </form>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import {
  JoinContent,
  JoinSetupContent,
} from '../../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../../utils/api/content';
import AppInput from '../../../../components/forms/AppInput.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import AppHeading from '../../../../components/AppHeading.vue';
import AppLabel from '../../../../components/forms/AppLabel.vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../../components/forms/AppSelect.vue';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import AppCheckbox from '../../../../components/forms/AppCheckbox.vue';
import JoinForm from '../../../auth/join/components/JoinForm.vue';
import AppTextArea from '../../../../components/forms/AppTextArea.vue';
import SetupForm from '../../../auth/join/components/SetupForm.vue';
import AppButton from '../../../../components/forms/AppButton.vue';

const joinContent = ref<JoinContent>();
const setupContent = ref<JoinSetupContent>();

const { n, t } = useI18n();

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

async function handleSubmit() {
  if (joinContent.value && setupContent.value) {
    await Promise.all([
      updateContent('join', joinContent.value),
      updateContent('join/setup', setupContent.value),
    ]);
  }
}

onBeforeMount(async () => {
  joinContent.value = await fetchContent('join');
  setupContent.value = await fetchContent('join/setup');
});
</script>
