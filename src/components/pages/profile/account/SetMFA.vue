<template>
  <AppHeading class="my-3">
    {{ t('accountPage.enableMFA') }}
  </AppHeading>

  <AppButton
    variant="primaryOutlined"
    :icon="faMobileAlt"
    @click="toggleMFAModal"
  >
    {{ t(`accountPage.enableMFA`) }}
  </AppButton>

  <AppModal
    :open="showMFASettingsModal"
    :title="changeLabel"
    class="w-full"
    @close="onCloseMFAModal"
  >
    <AppStepper
      v-model="appStepper.selectedStepIndex"
      :steps="appStepper.steps"
      @update:model-value="onStepperChange"
    />
    <AppSlider ref="appSliderCo" @slide="onSlideChange">
      <template #slides>
        <AppSlide>
          <div class="whitespace-break-spaces text-center">
            <p>Scan the QR code below with your authenticator app.</p>
            <AppQRCode v-if="totpUrl" :qr-data="totpUrl" />
          </div>
        </AppSlide>
        <AppSlide>
          <div class="h-full flex justify-center items-center">
            <div>
              <AppInput
                v-model="userToken"
                :value="userToken"
                label="Verify code"
                name="verify-code"
                required
              />
            </div>
          </div>
        </AppSlide>
        <AppSlide>
          <div class="h-full flex justify-center items-center">
            <p v-if="userTokenValid">2FA has been successfully set up</p>
            <p v-else>Invalid token</p>
          </div>
        </AppSlide>
      </template>

      <template #navigation="{ nextSlide, prevSlide }">
        <span class="flex justify-between mt-3">
          <AppButton variant="linkOutlined" @click="prevSlide()"
            >Back</AppButton
          >
          <AppButton variant="link" @click="nextSlide()">Continue</AppButton>
        </span>
      </template>
    </AppSlider>
  </AppModal>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref, toRef, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { TOTP, Secret } from 'otpauth';
import { fetchContact } from '../../../../utils/api/contact';

import AppButton from '../../../button/AppButton.vue';
import AppModal from '../../../AppModal.vue';
import AppHeading from '../../../AppHeading.vue';
import AppSlider from '../../../slider/AppSlider.vue';
import AppSlide from '../../../slider/AppSlide.vue';
import AppQRCode from '../../../AppQRCode.vue';
import AppStepper from '../../../stepper/AppStepper.vue';
import AppInput from '../../../forms/AppInput.vue';

import type { Step } from '../../../stepper/stepper.interface';
import type { AppSliderSlideEventDetails } from '../../../slider/slider.interface';

interface TOTPApp {
  issuer?: string;
  label?: string;
}

const { t } = useI18n();

const appSliderCo = ref<InstanceType<typeof AppSlider> | null>(null);
const showMFASettingsModal = ref(false);
const appStepper = ref({
  selectedStepIndex: 0,
  steps: [
    {
      name: 'Scan QR Code',
      validated: false,
      error: false,
    },
    {
      name: 'Verify code',
      validated: false,
      error: false,
    },
    {
      name: 'Result',
      validated: false,
      error: false,
    },
  ] as Step[],
});

const props = defineProps<{
  contactId: string;
}>();

/** Authentificator app url to scan (otpauth://totp/...) */
const totpUrl = ref<string | undefined>(undefined);

/** Information about the app totp is set up for */
const totpApp = ref<TOTPApp>({
  issuer: undefined,
  label: undefined,
});

/** Secret used to generate totp */
const totpSecred = ref(new Secret());

/** User token used to verify totp  */
const userToken = ref('');

/** Is the user token valid? */
const userTokenValid = ref(false);

/** TOTP instance */
let totp: TOTP | null = null;

onBeforeMount(() => {
  showMFASettingsModal.value = false;
});

const changeLabel = computed(() => t(`accountPage.enableMFA`));

/** Called when the modal is closed */
const onCloseMFAModal = () => {
  showMFASettingsModal.value = false;
};

/** Toggle the modal */
const toggleMFAModal = () => {
  showMFASettingsModal.value = !showMFASettingsModal.value;
};

/** Called when the slider changes */
const onSlideChange = (details: AppSliderSlideEventDetails) => {
  syncStepperWithSlider(details.slideNumber);
  validateStep(details.slideNumber);
};

/** Sync the stepper with the slider */
const syncStepperWithSlider = (slideNumber: number) => {
  if (appStepper.value.selectedStepIndex === slideNumber) {
    return;
  }
  appStepper.value.selectedStepIndex = slideNumber;

  validatePreviousSteps();
};

const validateStep = (stepIndex: number) => {
  if (stepIndex === 2) {
    validateTOTOToken();
  }
};

const validatePreviousSteps = () => {
  for (let i = 0; i < appStepper.value.steps.length; i++) {
    const step = appStepper.value.steps[i];
    step.validated = i < appStepper.value.selectedStepIndex;
  }
};

const onStepperChange = (stepIndex: number) => {
  appSliderCo.value?.toSlide(stepIndex);
  validatePreviousSteps();
};

const onTOPTAppChanged = (newValue: TOTPApp) => {
  totpSecred.value = new Secret();
  totp = new TOTP({
    issuer: newValue.issuer,
    label: newValue.label,
    secret: totpSecred.value,
  });
  totpUrl.value = totp.toString();
};

const validateTOTOToken = () => {
  if (!totp) {
    throw new Error('totp is null!');
  }
  const resultStep = appStepper.value.steps[2];
  const delta = totp.validate({
    token: userToken.value,
    window: 1,
  });

  // To check if the authenticator works it should be enough to check if the token is one step ahead or behind
  userTokenValid.value = delta !== null && delta <= 1 && delta >= -1;

  resultStep.error = !userTokenValid.value;

  return userTokenValid.value;
};

watch(
  toRef(props, 'contactId'),
  async (contactId) => {
    const contact = await fetchContact(contactId, ['profile']);
    totpApp.value.issuer = 'beabee'; // TODO use name of beabee instance
    totpApp.value.label = contact.email;
  },
  { immediate: true }
);

watch(totpApp, onTOPTAppChanged, { deep: true });
</script>
