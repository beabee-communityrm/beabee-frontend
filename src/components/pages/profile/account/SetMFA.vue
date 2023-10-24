<!--
  # SetMFA
  This component is used to set up MFA for a contact.
  It uses a slider to guide the user through the process.

  ## Props
  - `contactId` (string): The id of the contact to set up MFA for.

  ## Possible improvements
  - Add support for other MFA types (e.g. SMS)
  - Transform this component into a general useable wizard component

-->

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
            <!-- TODO: Allow other options like show url / secret key here? -->
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
            v-if="isFirstSlide"
            variant="linkOutlined"
            @click="closeMFAModal()"
          >
            {{ t(`accountPage.mfa.closeButton.label`) }}
          </AppButton>
          <AppButton v-else variant="linkOutlined" @click="prevSlide()">
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
          <AppButton v-else variant="link" @click="nextSlide()">
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
import { createContactMfa } from '../../../../utils/api/contact-mfa';
import { ContactMfaType } from '../../../../utils/api/api.interface';

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

/** Totp identity */
interface TotpIdentity {
  issuer?: string;
  label?: string;
}

const { t } = useI18n();

/** Reference to slider component */
const appSliderCo = ref<InstanceType<typeof AppSlider> | null>(null);

/** Used to show/hide the modal */
const showMFASettingsModal = ref(false);

/** Stepper component state */
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
const totpIdentity = ref<TotpIdentity>({
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
  closeMFAModal();
  resetState();
};

/** Close the modal */
const closeMFAModal = () => {
  showMFASettingsModal.value = false;
};

/** Toggle the modal */
const toggleMFAModal = () => {
  showMFASettingsModal.value = !showMFASettingsModal.value;
};

const saveMFA = async () => {
  closeMFAModal();
  const result = await createContactMfa('me', {
    secret: totpSecret.value.base32,
    token: userToken.value,
    type: ContactMfaType.TOTP,
  });
  resetState();
};

/** Called when the slider changes */
const onSlideChange = (details: AppSliderSlideEventDetails) => {
  syncStepperWithSlider(details);
  validateStep(details);
};

/** Reset / init the state of the component */
const resetState = () => {
  appSliderCo.value?.toSlide(0);
  appStepper.value.selectedStepIndex = 0;
  appStepper.value.steps.forEach((step) => {
    step.validated = false;
    step.error = false;
  });
  userToken.value = '';
  userTokenValid.value = false;
};

/** Sync the stepper with the slider */
const syncStepperWithSlider = (details: AppSliderSlideEventDetails) => {
  if (appStepper.value.selectedStepIndex === details.slideNumber) {
    return;
  }
  appStepper.value.selectedStepIndex = details.slideNumber;

  validatePreviousSteps();
};

/** Validate the current step */
const validateStep = (details: AppSliderSlideEventDetails) => {
  if (details.slideNumber === 2) {
    validateTOTOToken();
  }
};

/** Validate all previous steps */
const validatePreviousSteps = () => {
  for (let i = 0; i < appStepper.value.steps.length; i++) {
    const step = appStepper.value.steps[i];
    step.validated = i < appStepper.value.selectedStepIndex;
  }
};

/** Called when the stepper changes */
const onStepperChange = (stepIndex: number) => {
  appSliderCo.value?.toSlide(stepIndex);
  validatePreviousSteps();
};

/** Called when the totp identity changes */
const onTotpIdentityChanged = (newValue: TotpIdentity) => {
  totpSecret.value = new Secret();
  totp = new TOTP({
    issuer: newValue.issuer,
    label: newValue.label,
    secret: totpSecret.value,
  });
  totpUrl.value = totp.toString();
};

/** Validate the totp token / user input code */
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

/** Are all steps done with no errors? */
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

/** Fetch the contact and set the totp identity */
watch(
  toRef(props, 'contactId'),
  async (contactId) => {
    const contact = await fetchContact(contactId, ['profile']);
    totpIdentity.value.issuer = 'beabee'; // TODO: Use name of beabee instance
    totpIdentity.value.label = contact.email;
  },
  { immediate: true }
);

/** Watch totp identity changes */
watch(totpIdentity, onTotpIdentityChanged, { deep: true });

onBeforeMount(() => {
  resetState();
});
</script>
