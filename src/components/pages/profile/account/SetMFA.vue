<template>
  <AppHeading class="my-3">
    {{ t('accountPage.mfa.title') }}
  </AppHeading>

  <AppButton
    variant="primaryOutlined"
    :icon="faMobileAlt"
    @click="toggleMFAModal"
  >
    {{ t(`accountPage.mfa.enable`) }}
  </AppButton>

  <AppModal
    :open="showMFASettingsModal"
    :title="modalTitle"
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
          <div class="whitespace-break-spaces">
            <p class="text-center">
              {{ t(`accountPage.mfa.scan.desc`) }}
            </p>
            <AppQRCode v-if="totpUrl" :qr-data="totpUrl" />
          </div>
        </AppSlide>
        <AppSlide>
          <div
            class="whitespace-break-spaces h-full flex flex-col justify-between items-center"
          >
            <p class="text-center">
              {{ t(`accountPage.mfa.enterCode.desc`) }}
            </p>
            <span class="w-full h-full flex flex-col justify-center px-4">
              <AppInput
                v-model="userToken"
                :value="userToken"
                type="text"
                :label="codeLabel"
                name="verifyCode"
                required
              />
            </span>
          </div>
        </AppSlide>
        <AppSlide>
          <div
            class="whitespace-break-spaces h-full flex justify-center items-center text-center"
          >
            <p class="text-success" v-if="userTokenValid">
              {{ t(`accountPage.mfa.result.successful`) }}
            </p>
            <p class="text-danger" v-else>
              {{ t(`accountPage.mfa.result.invalidCode`) }}
            </p>
          </div>
        </AppSlide>
      </template>

      <template
        #navigation="{ nextSlide, prevSlide, isFirstSlide, isLastSlide }"
      >
        <span class="flex justify-between mt-3">
          <AppButton
            :disabled="isFirstSlide"
            variant="linkOutlined"
            @click="prevSlide()"
          >
            {{ t(`accountPage.mfa.prevButton.label`) }}
          </AppButton>
          <AppButton
            v-if="isLastSlide"
            :disabled="!allStepsDone"
            variant="link"
            @click="saveMFA()"
          >
            {{ t(`accountPage.mfa.saveButton.label`) }}
          </AppButton>
          <AppButton v-else="isLastSlide" variant="link" @click="nextSlide()">
            {{ t(`accountPage.mfa.nextButton.label`) }}
          </AppButton>
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
      name: t(`accountPage.mfa.scan.title`),
      validated: false,
      error: false,
    },
    {
      name: t(`accountPage.mfa.enterCode.title`),
      validated: false,
      error: false,
    },
    {
      name: t(`accountPage.mfa.result.title`),
      validated: false,
      error: false,
    },
  ] as Step[],
});

const props = defineProps<{
  contactId: string;
}>();

/** Authenticator app url to scan (otpauth://totp/...) */
const totpUrl = ref<string | undefined>(undefined);

/** Information about the app totp is set up for */
const totpApp = ref<TOTPApp>({
  issuer: undefined,
  label: undefined,
});

/** Secret used to generate totp */
const totpSecret = ref(new Secret());

/** User token used to verify totp  */
const userToken = ref('');

/** Is the user token valid? */
const userTokenValid = ref(false);

/** TOTP instance */
let totp: TOTP | null = null;

const modalTitle = computed(() => t(`accountPage.mfa.modalTitle`));
const codeLabel = computed(() => t(`accountPage.mfa.codeInput.label`));

/** Called when the modal is closed */
const onCloseMFAModal = () => {
  showMFASettingsModal.value = false;
};

/** Toggle the modal */
const toggleMFAModal = () => {
  showMFASettingsModal.value = !showMFASettingsModal.value;
};

const saveMFA = () => {
  onCloseMFAModal();
  // TODO: save totp to contact in db
};

/** Called when the slider changes */
const onSlideChange = (details: AppSliderSlideEventDetails) => {
  syncStepperWithSlider(details);
  validateStep(details);
};

/** Sync the stepper with the slider */
const syncStepperWithSlider = (details: AppSliderSlideEventDetails) => {
  if (appStepper.value.selectedStepIndex === details.slideNumber) {
    return;
  }
  appStepper.value.selectedStepIndex = details.slideNumber;

  validatePreviousSteps();
};

const validateStep = (details: AppSliderSlideEventDetails) => {
  if (details.slideNumber === 2) {
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

const onTOTPAppChanged = (newValue: TOTPApp) => {
  totpSecret.value = new Secret();
  totp = new TOTP({
    issuer: newValue.issuer,
    label: newValue.label,
    secret: totpSecret.value,
  });
  totpUrl.value = totp.toString();
};

const validateTOTOToken = () => {
  if (!totp) {
    throw new Error('totp is null!');
  }
  const validateStep = appStepper.value.steps[1];
  const resultStep = appStepper.value.steps[2];
  const delta = totp.validate({
    token: userToken.value,
    window: 1,
  });

  // To check if the authenticator works it should be enough to check if the token is one step ahead or behind
  userTokenValid.value = delta !== null && delta <= 1 && delta >= -1;

  validateStep.error = !userTokenValid.value;
  resultStep.error = !userTokenValid.value;
  validateStep.validated = userTokenValid.value;
  resultStep.validated = userTokenValid.value;

  return userTokenValid.value;
};

const allStepsDone = computed(() => {
  return (
    appStepper.value.steps[0].validated &&
    !appStepper.value.steps[0].error &&
    appStepper.value.steps[1].validated &&
    !appStepper.value.steps[1].error &&
    appStepper.value.steps[2].validated &&
    !appStepper.value.steps[2].error
  );
});

watch(
  toRef(props, 'contactId'),
  async (contactId) => {
    const contact = await fetchContact(contactId, ['profile']);
    totpApp.value.issuer = 'beabee'; // TODO use name of beabee instance
    totpApp.value.label = contact.email;
  },
  { immediate: true }
);

watch(totpApp, onTOTPAppChanged, { deep: true });

onBeforeMount(() => {
  showMFASettingsModal.value = false;
});
</script>
