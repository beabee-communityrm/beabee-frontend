<template>
  <div>
    <div class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <AppHeading class="mb-5">{{ stepT('title') }}</AppHeading>
        <p>{{ stepT('text') }}</p>
      </div>
    </div>
    <div v-if="joinContent" class="grid grid-cols-2 gap-8 mb-12">
      <div>
        <div class="mb-4">
          <AppInput
            v-model="joinContent.title"
            :label="stepT('formTitle')"
            :error-message="validation.joinContent.title.$errors[0]?.$message"
            required
            @blur="validation.joinContent.title.$touch"
          />
        </div>
        <RichTextEditor
          v-model="joinContent.subtitle"
          :label="stepT('formSubtitle')"
          class="mb-4"
        />

        <AppImageUpload
          v-model="backgroundUrl"
          :label="stepT('backgroundImage')"
          :width="1440"
          :height="810"
          class="mb-4"
          required
        />

        <h4 class="font-semibold text-lg mb-4">
          {{ stepT('suggestedAmounts') }} *
        </h4>
        <div class="flex gap-4 mb-4">
          <PeriodAmounts
            v-for="(period, periodI) in joinContent.periods"
            :key="period.name"
            v-model="joinContent.periods[periodI].presetAmounts"
            :period="period.name"
            :min-monthly-amount="joinContent.minMonthlyAmount"
            class="flex-1"
          />
        </div>
        <div class="flex gap-4 mb-4">
          <div class="flex-1">
            <AppLabel :label="stepT('minAmount')" />
            <AppInput
              v-model="joinContent.minMonthlyAmount"
              input-type="number"
              class="w-32 block mb-2"
              min="1"
            />
          </div>
          <div class="flex-1">
            <AppLabel :label="stepT('defaultAmount')" />
            <AppSelect
              v-model="selectedDefaultAmount"
              :items="defaultAmounts"
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
        class="p-4 pt-8 bg-center bg-cover"
        :style="`background-image: url(${backgroundUrl})`"
      >
        <AuthBox>
          <JoinForm :join-content="joinContent" @submit.prevent="" />
        </AuthBox>
      </div>
    </div>
    <div v-if="setupContent" class="grid grid-cols-2 gap-8">
      <div>
        <AppHeading class="mb-4">{{ stepT('accountConfirmation') }}</AppHeading>
        <AppInput
          v-model="setupContent.welcome"
          class="mb-4"
          :label="stepT('welcomeMessage')"
          required
        />

        <AppCheckbox
          v-model="setupContent.showMailOptIn"
          :label="stepT('showMailOptIn')"
          class="font-semibold mb-4"
        />

        <template v-if="setupContent.showMailOptIn">
          <div class="mb-4">
            <AppInput
              v-model="setupContent.mailTitle"
              :label="stepT('heading')"
              required
              :error-message="
                validation.setupContent.mailTitle.$errors[0]?.$message
              "
              @blur="validation.setupContent.mailTitle.$touch"
            />
          </div>
          <div class="mb-4">
            <AppTextArea
              v-model="setupContent.mailText"
              :label="stepT('subheading')"
              required
              :error-message="
                validation.setupContent.mailText.$errors[0]?.$message
              "
              @blur="validation.setupContent.mailText.$touch"
            />
          </div>
          <div class="mb-4">
            <AppInput
              v-model="setupContent.mailOptIn"
              :label="stepT('checkboxLabel')"
              required
              :error-message="
                validation.setupContent.mailOptIn.$errors[0]?.$message
              "
              @blur="validation.setupContent.mailOptIn.$touch"
            />
          </div>
        </template>

        <AppCheckbox
          v-model="setupContent.showNewsletterOptIn"
          :label="stepT('showNewsletterOptIn')"
          class="font-semibold mb-4"
        />

        <template v-if="setupContent.showNewsletterOptIn">
          <div class="mb-4">
            <AppInput
              v-model="setupContent.newsletterTitle"
              :label="stepT('heading')"
              required
              :error-message="
                validation.setupContent.newsletterTitle.$errors[0]?.$message
              "
              @blur="validation.setupContent.newsletterTitle.$touch"
            />
          </div>
          <div class="mb-4">
            <AppTextArea
              v-model="setupContent.newsletterText"
              :label="stepT('subheading')"
              required
              :error-message="
                validation.setupContent.newsletterText.$errors[0]?.$message
              "
              @blur="validation.setupContent.newsletterText.$touch"
            />
          </div>
          <div class="mb-4">
            <AppInput
              v-model="setupContent.newsletterOptIn"
              :label="stepT('checkboxLabel')"
              required
              :error-message="
                validation.setupContent.newsletterOptIn.$errors[0]?.$message
              "
              @blur="validation.setupContent.newsletterOptIn.$touch"
            />
          </div>
        </template>
      </div>
      <div
        class="p-4 pt-8 bg-center bg-cover"
        :style="`background-image: url(${backgroundUrl})`"
      >
        <AuthBox>
          <SetupForm :setup-content="setupContent" />
        </AuthBox>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
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
import AuthBox from '../../../auth/AuthBox.vue';
import AppImageUpload from '../../../../components/forms/AppImageUpload.vue';
import { generalContent } from '../../../../store';
import { MembershipBuilderEmitter } from '../../membership-builder.interface';
import useVuelidate from '@vuelidate/core';
import { required, requiredIf } from '@vuelidate/validators';
import PeriodAmounts from '../PeriodAmounts.vue';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  emitter: MembershipBuilderEmitter;
}>();

const joinContent = ref<JoinContent>();
const setupContent = ref<JoinSetupContent>();
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

async function handleUpdate() {
  if (joinContent.value && setupContent.value) {
    await Promise.all([
      updateContent('join', joinContent.value),
      updateContent('join/setup', setupContent.value),
      updateContent('general', {
        ...generalContent.value,
        backgroundUrl: backgroundUrl.value || '',
      }),
    ]);
  }

  props.emitter.emit('updated');
}

const rules = computed(() => {
  const requiredIfNewsletter = requiredIf(
    !!setupContent.value?.showNewsletterOptIn
  );
  const requiredIfMail = requiredIf(!!setupContent.value?.showMailOptIn);
  return {
    joinContent: {
      title: { required },
    },
    setupContent: {
      newsletterText: { required: requiredIfNewsletter },
      newsletterOptIn: { required: requiredIfNewsletter },
      newsletterTitle: { required: requiredIfNewsletter },
      mailText: { required: requiredIfMail },
      mailOptIn: { required: requiredIfMail },
      mailTitle: { required: requiredIfMail },
    },
    backgroundUrl: { required },
  };
});

const validation = useVuelidate(rules, {
  joinContent,
  setupContent,
  backgroundUrl,
});

watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});

onBeforeMount(async () => {
  props.emitter.on('update', handleUpdate);
  joinContent.value = await fetchContent('join');
  setupContent.value = await fetchContent('join/setup');
  backgroundUrl.value = generalContent.value.backgroundUrl || '';

  watch(
    [joinContent, setupContent, backgroundUrl],
    () => {
      props.emitter.emit('dirty');
    },
    { deep: true }
  );
});

onBeforeUnmount(() => {
  props.emitter.off('update', handleUpdate);
});
</script>
