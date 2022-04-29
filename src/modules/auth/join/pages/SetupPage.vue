<template>
  <AuthBox>
    <form @submit.prevent="completeSetup">
      <JoinHeader
        class="mb-6"
        :title="
          t('joinSetup.welcome', {
            firstName: setupMemberData.firstName,
            lastName: setupMemberData.lastName,
          })
        "
        :sub-title="setupContent.welcome"
        :description="t('joinSetup.confirmDetails')"
      />

      <div class="mb-3">
        <AppInput
          v-model="setupMemberData.email"
          input-type="email"
          required
          :label="t('form.email')"
          :error-message="errorGenerator(setupValidation, 'email')"
          @blur="setupValidation.email.$touch"
        />
      </div>

      <div class="mb-3">
        <AppInput
          v-model="setupMemberData.firstName"
          required
          :label="t('form.firstName')"
          :error-message="errorGenerator(setupValidation, 'firstName')"
          @blur="setupValidation.firstName.$touch"
        />
      </div>

      <div class="mb-5">
        <AppInput
          v-model="setupMemberData.lastName"
          required
          :label="t('form.lastName')"
          :error-message="errorGenerator(setupValidation, 'lastName')"
          @blur="setupValidation.lastName.$touch"
        />
      </div>

      <template v-if="setupContent.showMailOptIn">
        <p class="text-lg mb-1">
          {{ setupContent.mailTitle }}
        </p>

        <p class="mb-4 text-sm">
          {{ setupContent.mailText }}
        </p>

        <div class="mb-4">
          <input
            id="deliveryOptIn"
            v-model="setupMemberData.profile.deliveryOptIn"
            type="checkbox"
            name="updates"
          />

          <label for="deliveryOptIn" class="font-bold ml-1">
            {{ setupContent.mailOptIn }}
          </label>
        </div>

        <AppAddress
          v-model:line1="setupMemberData.addressLine1"
          v-model:line2="setupMemberData.addressLine2"
          v-model:postCode="setupMemberData.postCode"
          v-model:cityOrTown="setupMemberData.cityOrTown"
          :is-address-required="setupMemberData.profile.deliveryOptIn"
        />
      </template>

      <template v-if="setupContent.showNewsletterOptIn">
        <p class="text-lg mb-1">
          {{ setupContent.newsletterTitle }}
        </p>

        <p class="mb-4 text-sm">
          {{ setupContent.newsletterText }}
        </p>

        <div class="mb-4">
          <input
            id="newsletterOptIn"
            v-model="setupMemberData.profile.newsletterOptIn"
            type="checkbox"
            name="updates"
          />

          <label for="newsletterOptIn" class="font-bold ml-1">
            {{ setupContent.newsletterOptIn }}
          </label>
        </div>
      </template>

      <MessageBox v-if="setupValidation.$errors.length > 0" class="mb-4" />

      <AppButton
        variant="link"
        type="submit"
        :loading="saving"
        :disabled="setupValidation.$invalid"
        class="w-full"
      >
        {{ t('joinSetup.continue') }}
      </AppButton>
    </form>
  </AuthBox>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import AuthBox from '../../AuthBox.vue';
import JoinHeader from '../components/JoinHeader.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import AppAddress from '../../../../components/AppAddress.vue';
import { errorGenerator } from '../../../../utils/form-error-generator';
import AppButton from '../../../../components/forms/AppButton.vue';
import MessageBox from '../../../../components/MessageBox.vue';
import { NewsletterStatus } from '../../../../utils/enums/newsletter-status.enum';
import { fetchMember, updateMember } from '../../../../utils/api/member';
import {
  JoinSetupContent,
  UpdateMemberData,
} from '../../../../utils/api/api.interface';
import { fetchJoinSetupContent } from '../../../../utils/api/content';
import { SetupMemberData } from '../join.interface';
import { emailValidationRule } from '../../../../utils/form-validation/rules';

const { t } = useI18n();

const router = useRouter();

const setupMemberData = reactive<SetupMemberData>({
  email: '',
  firstName: '',
  lastName: '',
  profile: {
    newsletterOptIn: false,
    deliveryOptIn: false,
  },
  addressLine1: '',
  addressLine2: '',
  cityOrTown: '',
  postCode: '',
});

const setupContent = ref<JoinSetupContent>({
  welcome: '',
  newsletterText: '',
  newsletterOptIn: '',
  newsletterTitle: '',
  showNewsletterOptIn: false,
  showMailOptIn: false,
  mailTitle: '',
  mailText: '',
  mailOptIn: '',
});

const saving = ref(false);

const setupRules = {
  email: emailValidationRule,
  firstName: {
    required: helpers.withMessage(
      t('form.errors.firstName.required'),
      required
    ),
  },
  lastName: {
    required: helpers.withMessage(t('form.errors.lastName.required'), required),
  },
};

const setupValidation = useVuelidate(setupRules, setupMemberData);

async function completeSetup() {
  saving.value = true;

  const updateMemberData: UpdateMemberData = {
    email: setupMemberData.email,
    firstname: setupMemberData.firstName,
    lastname: setupMemberData.lastName,
  };

  if (
    setupMemberData.profile.newsletterOptIn ||
    setupContent.value.showMailOptIn
  ) {
    updateMemberData.profile = {
      ...(setupMemberData.profile.newsletterOptIn && {
        newsletterStatus: NewsletterStatus.Subscribed,
      }),
      ...(setupContent.value.showMailOptIn && {
        deliveryOptIn: setupMemberData.profile.deliveryOptIn,
        deliveryAddress: {
          line1: setupMemberData.addressLine1,
          line2: setupMemberData.addressLine2,
          city: setupMemberData.cityOrTown,
          postcode: setupMemberData.postCode,
        },
      }),
    };
  }

  await updateMember('me', updateMemberData);
  router.push({ path: '/profile', query: { welcomeMessage: 'true' } });
}

onBeforeMount(async () => {
  const member = await fetchMember('me', ['profile']);

  setupMemberData.firstName = member.firstname;
  setupMemberData.lastName = member.lastname;
  setupMemberData.email = member.email;
  setupMemberData.profile.newsletterOptIn =
    member.profile.newsletterStatus === NewsletterStatus.Subscribed
      ? true
      : false;
  setupMemberData.profile.deliveryOptIn = member.profile.deliveryOptIn;
  if (member.profile.deliveryAddress) {
    setupMemberData.addressLine1 = member.profile.deliveryAddress.line1;
    setupMemberData.addressLine2 = member.profile.deliveryAddress.line2 || '';
    setupMemberData.cityOrTown = member.profile.deliveryAddress.city;
    setupMemberData.postCode = member.profile.deliveryAddress.postcode;
  }

  setupContent.value = await fetchJoinSetupContent();
});
</script>
