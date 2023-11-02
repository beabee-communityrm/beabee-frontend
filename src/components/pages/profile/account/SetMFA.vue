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
    <AppSlider ref="appSliderCo" :steps="stepsInOrder" @slide="onSlideChange">
      <template #slides>
        <!-- QR code and secret slide -->
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
        <!-- User token verification slide -->
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

              <AppNotification
                :class="{
                  'opacity-1': steps.enterCode.error,
                  'opacity-0': !steps.enterCode.error,
                }"
                class="my-4"
                variant="error"
                :title="t('accountPage.mfa.result.invalidCode')"
              />
            </span>
          </div>
        </AppSlide>
        <!-- Last result slide with save button -->
        <AppSlide>
          <div
            class="whitespace-break-spaces h-full flex justify-center items-center text-center"
          >
            <span class="w-full h-full flex flex-col justify-center px-4">
              <AppNotification
                v-if="userTokenValid"
                class="my-4"
                variant="success"
                :title="t('accountPage.mfa.result.successful')"
              />
              <AppNotification
                v-else
                class="my-4"
                variant="error"
                :title="t('accountPage.mfa.result.invalidCode')"
              />
            </span>
          </div>
        </AppSlide>
      </template>

      <template
        #navigation="{
          nextSlide,
          prevSlide,
          isFirstSlide,
          isLastSlide,
          activeSlide,
        }"
      >
        <span class="flex justify-between mt-3">
          <!-- Back buttons -->
          <section>
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
          </section>

          <!-- Next button variants -->
          <section>
            <!-- Last save button -->
            <AppButton
              v-if="isLastSlide"
              :disabled="!validationStepsDone"
              variant="link"
              @click="saveMfaAndNotify()"
            >
              {{ t(`actions.save`) }}
            </AppButton>

            <!-- Verify token next button -->
            <AppButton
              v-else-if="
                activeSlide === 1 &&
                (!steps.enterCode.validated || steps.enterCode.error)
              "
              :disabled="!userToken"
              variant="link"
              @click="nextSlideIfValid()"
            >
              {{ t(`accountPage.mfa.validateButton.label`) }}
            </AppButton>

            <!-- Default next button -->
            <AppButton v-else variant="link" @click="nextSlide()">
              {{ t(`actions.next`) }}
            </AppButton>
          </section>
        </span>
      </template>
    </AppSlider>
  </AppModal>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref, toRef, computed, watch, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import { TOTP, Secret } from 'otpauth';

import { fetchContact } from '@utils/api/contact';
import {
  createContactMfa,
  fetchContactMfa,
  deleteContactMfa,
} from '@utils/api/contact-mfa';
import { ContactMfaType } from '@utils/api/api.interface';
import { isRequestError } from '@utils/api/index';
import { LOGIN_CODES } from '@utils/api/api.interface';

import AppButton from '@components/button/AppButton.vue';
import AppModal from '@components/AppModal.vue';
import AppHeading from '@components/AppHeading.vue';
import AppSlider from '@components/slider/AppSlider.vue';
import AppSlide from '@components/slider/AppSlide.vue';
import AppQRCode from '@components/AppQRCode.vue';
import AppInput from '@components/forms/AppInput.vue';
import AppConfirmDialog from '@components/AppConfirmDialog.vue';
import AppNotification from '@components/AppNotification.vue';

import { addNotification } from '@store/notifications';
import { generalContent } from '@store/index';

import type { AppStepperStep } from '@type/app-stepper-step';
import type { AppSliderSlideEventDetails } from '@type/app-slider-slide-event-details';
import type { SetMfaSteps } from '@type/set-mfa-steps';
import type { SetMfaTotpIdentity } from '@type/set-mfa-totp-identity';
import type { ContactMfaCreateApiErrorData } from '@type/contact-mfa-create-api-error-data';

const { t } = useI18n();

/** Reference to slider component */
const appSliderCo = ref<InstanceType<typeof AppSlider> | null>(null);

/** Used to show/hide the modal */
const showMFASettingsModal = ref(false);

const showDisableConfirmModal = ref(false);

/** Is multi factor authentication enabled? */
const isEnabled = ref(false);

/** Stepper steps */
const steps = reactive<SetMfaSteps>({
  qrCode: {
    name: t(`accountPage.mfa.scan.title`),
    validated: false,
    error: false,
  },
  enterCode: {
    name: t(`accountPage.mfa.enterCode.title`),
    validated: false,
    error: false,
  },
  result: {
    name: t(`accountPage.mfa.result.title`),
    validated: false,
    error: false,
  },
});

/** Stepper steps as array */
const stepsInOrder = ref<AppStepperStep[]>([
  steps.qrCode,
  steps.enterCode,
  steps.result,
]);

const props = defineProps<{
  contactId: string;
}>();

/** Authenticator app url to scan (otpauth://totp/...) */
const totpUrl = ref<string | undefined>(undefined);

/** Information about the app totp is set up for */
const totpIdentity = ref<SetMfaTotpIdentity>({
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

/** Save MFA on server and notify the user */
const saveMfaAndNotify = async () => {
  try {
    await createContactMfa(props.contactId, {
      secret: totpSecret.value.base32,
      token: userToken.value,
      type: ContactMfaType.TOTP,
    });
  } catch (error) {
    return onCreateError(error);
  }

  isEnabled.value = true;
  closeMFAModal();
  resetState();
  addNotification({
    title: t('accountPage.mfa.enabledNotification'),
    variant: 'success',
  });
};

/** Called when an error occurs while creating MFA */
const onCreateError = (error: unknown) => {
  if (
    isRequestError<ContactMfaCreateApiErrorData>(error) &&
    error.response.data.message === LOGIN_CODES.INVALID_TOKEN
  ) {
    // If server says the token is invalid, set the token as invalid and go to the previous slide
    setValidationStates(false);
    appSliderCo.value?.prevSlide();
    return;
  }

  // Start from the beginning on an unknown error
  resetState();
  addNotification({
    title: t('accountPage.mfa.createUnknownErrorNotification'),
    variant: 'error',
  });
};

/** Disable MFA and notify the user */
const disableMfaAndNotify = async () => {
  showDisableConfirmModal.value = false;
  await disableMfa();
  addNotification({
    title: t('accountPage.mfa.disabledNotification'),
    variant: 'error',
  });
};

/** Disable MFA for the contact */
const disableMfa = async () => {
  await deleteContactMfa(props.contactId);
  isEnabled.value = false;
  resetState();
};

/** Called when the slider changes */
const onSlideChange = (details: AppSliderSlideEventDetails) => {
  // Reset state if the user goes back to the first slide
  if (details.slideNumber === 0) {
    resetState();
  }

  // Validate previous steps
  validatePreviousSteps(details.slideNumber);
};

/** Reset / init the state of the component */
const resetState = () => {
  appSliderCo.value?.toSlide(0);
  stepsInOrder.value.forEach((step) => {
    step.validated = false;
    step.error = false;
  });
  userToken.value = '';
  userTokenValid.value = false;
};

/** Validate all previous steps */
const validatePreviousSteps = (slideNumber: number) => {
  if (!stepsInOrder.value) return;
  for (let i = 0; i < stepsInOrder.value.length; i++) {
    const step = stepsInOrder.value[i];
    step.validated = i < slideNumber;
  }
};

/** Called when the totp identity changes */
const onTotpIdentityChanged = (newValue: SetMfaTotpIdentity) => {
  totpSecret.value = new Secret();
  totp = new TOTP({
    issuer: newValue.issuer,
    label: newValue.label,
    secret: totpSecret.value,
  });
  totpUrl.value = totp.toString();
};

/** Reset the user token validation state if the user token changes */
const onUserTokenChanged = () => {
  userTokenValid.value = false;
  steps.enterCode.error = false;
  steps.enterCode.validated = false;
};

/** Validate the **T**imed **O**ne **T**ime **P**assword token / user input code */
const validateTotpToken = (window = 2) => {
  if (!totp) {
    throw new Error('totp is falsy!');
  }

  const delta = totp.validate({
    token: userToken.value,
    window,
  });

  userTokenValid.value = delta === 0;

  return userTokenValid.value;
};

/**
 * Set the validation state of the slides
 * @param isValid Is the token valid?
 */
const setValidationStates = (isValid: boolean) => {
  userTokenValid.value = isValid;

  steps.enterCode.error = !isValid;
  steps.enterCode.validated = isValid;

  if (isValid) {
    steps.result.error = !isValid;
    steps.result.validated = isValid;
  }

  return isValid;
};

/** Validate token and go to next slide if valid */
const nextSlideIfValid = () => {
  const isValid = setValidationStates(validateTotpToken());

  if (isValid) {
    appSliderCo.value?.nextSlide();
  }
};

/** Are all steps done with no errors? */
const validationStepsDone = computed(() => {
  return (
    steps.qrCode.validated &&
    !steps.qrCode.error &&
    steps.enterCode.validated &&
    !steps.enterCode.error
  );
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

watch(userToken, onUserTokenChanged);

onBeforeMount(() => {
  resetState();
});
</script>
