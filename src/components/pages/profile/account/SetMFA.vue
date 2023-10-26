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
    v-if="isEnabled"
    variant="primaryOutlined"
    :icon="faMobileAlt"
    @click="showDisableConfirmModal = true"
  >
    {{ t(`actions.disable`) }}
  </AppButton>

  <AppButton
    v-else
    variant="primaryOutlined"
    :icon="faMobileAlt"
    @click="showMFASettingsModal = !showMFASettingsModal"
  >
    {{ t(`actions.enable`) }}
  </AppButton>

  <AppConfirmDialog
    :open="showDisableConfirmModal"
    :title="t('accountPage.mfa.confirmDelete.title')"
    :cancel="t('actions.noBack')"
    :confirm="t('actions.yesDisable')"
    variant="danger"
    @close="showDisableConfirmModal = false"
    @confirm="disableMfaAndNotify"
  >
    <p>{{ t('accountPage.mfa.confirmDelete.desc') }}</p>
  </AppConfirmDialog>

  <AppModal
    :open="showMFASettingsModal"
    :title="t(`accountPage.mfa.modalTitle`)"
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
            <p class="text-center">
              {{ t(`accountPage.mfa.secretInput.desc`) }}
            </p>
            <div class="p-4">
              <AppInput
                readonly
                type="text"
                :value="totpSecret.base32"
                :label="t(`accountPage.mfa.secretInput.label`)"
              ></AppInput>
            </div>
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
                type="text"
                :label="t(`accountPage.mfa.codeInput.label`)"
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
            <p v-if="userTokenValid" class="text-success">
              {{ t(`accountPage.mfa.result.successful`) }}
            </p>
            <p v-else class="text-danger">
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
            {{ t(`actions.close`) }}
          </AppButton>
          <AppButton v-else variant="linkOutlined" @click="prevSlide()">
            {{ t(`actions.back`) }}
          </AppButton>
          <AppButton
            v-if="isLastSlide"
            :disabled="!allStepsDone"
            variant="link"
            @click="saveMfaAndNotify()"
          >
            {{ t(`actions.save`) }}
          </AppButton>
          <AppButton v-else variant="link" @click="nextSlide()">
            {{ t(`actions.next`) }}
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
import {
  createContactMfa,
  fetchContactMfa,
  deleteContactMfa,
} from '../../../../utils/api/contact-mfa';
import { ContactMfaType } from '../../../../utils/api/api.interface';

import AppButton from '../../../button/AppButton.vue';
import AppModal from '../../../AppModal.vue';
import AppHeading from '../../../AppHeading.vue';
import AppSlider from '../../../slider/AppSlider.vue';
import AppSlide from '../../../slider/AppSlide.vue';
import AppQRCode from '../../../AppQRCode.vue';
import AppStepper from '../../../stepper/AppStepper.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppConfirmDialog from '../../../AppConfirmDialog.vue';

import { addNotification } from '../../../../store/notifications';
import { generalContent } from '../../../../store';

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

const showDisableConfirmModal = ref(false);

/** Is multi factor authentication enabled? */
const isEnabled = ref(false);

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

/** Called when the modal is closed */
const onCloseMFAModal = () => {
  closeMFAModal();
  resetState();
};

/** Close the modal */
const closeMFAModal = () => {
  showMFASettingsModal.value = false;
};

const saveMfaAndNotify = async () => {
  closeMFAModal();
  const result = await createContactMfa(props.contactId, {
    secret: totpSecret.value.base32,
    token: userToken.value,
    type: ContactMfaType.TOTP,
  });
  isEnabled.value = true;
  resetState();
  addNotification({
    title: t('accountPage.mfa.enabledNotification'),
    variant: 'success',
  });
  return result;
};

const disableMfaAndNotify = async () => {
  showDisableConfirmModal.value = false;
  await disableMfa();
  addNotification({
    title: t('accountPage.mfa.disabledNotification'),
    variant: 'error',
  });
};

/**
 * Disable MFA for the contact
 */
const disableMfa = async () => {
  await deleteContactMfa(props.contactId);
  isEnabled.value = false;
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
    validateTotpToken();
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

/** Validate the **T**imed **O**ne **T**ime **P**assword token / user input code */
const validateTotpToken = (window = 2) => {
  if (!totp) {
    throw new Error('totp is falsy!');
  }
  const validateStep = appStepper.value.steps[1];
  const resultStep = appStepper.value.steps[2];
  const delta = totp.validate({
    token: userToken.value,
    window,
  });

  userTokenValid.value = delta === 0;

  validateStep.error = !userTokenValid.value;
  resultStep.error = !userTokenValid.value;
  validateStep.validated = userTokenValid.value;
  resultStep.validated = userTokenValid.value;

  return userTokenValid.value;
};

/** Are all steps done with no errors? */
const allStepsDone = computed(() => {
  return appStepper.value.steps.every((s) => s.validated && !s.error);
});

/** Fetch the contact and set the TOTP identity */
watch(
  toRef(props, 'contactId'),
  async (contactId) => {
    const contact = await fetchContact(contactId, ['profile']);
    totpIdentity.value.issuer =
      generalContent.value.organisationName || 'beabee';
    totpIdentity.value.label = contact.email;

    const contactMfa = await fetchContactMfa(contactId);
    if (contactMfa && contactMfa.type === ContactMfaType.TOTP) {
      isEnabled.value = true;
    }
  },
  { immediate: true }
);

/** Watch TOTP identity changes */
watch(totpIdentity, onTotpIdentityChanged, { deep: true });

onBeforeMount(() => {
  resetState();
});
</script>
