<template>
  <AuthBox>
    <form @submit.prevent>
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
          v-model:addressValidation="addressValidation"
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

      <MessageBox v-if="hasSetupError" class="mb-4" />

      <AppButton
        variant="link"
        type="submit"
        :loading="loading"
        :disabled="hasSetupError"
        class="w-full"
        @click="completeSetup(router)"
      >
        {{ t('joinSetup.continue') }}
      </AppButton>
    </form>
  </AuthBox>
</template>

<script lang="ts" setup>
import AuthBox from '../../AuthBox.vue';
import JoinHeader from '../components/JoinHeader.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import AppAddress from '../../../../components/AppAddress.vue';
import { useJoin } from '../use-join';
import { errorGenerator } from '../../../../utils/form-error-generator';
import AppButton from '../../../../components/forms/AppButton.vue';
import MessageBox from '../../../../components/MessageBox.vue';
import { onBeforeMount } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const router = useRouter();

const {
  setMemberData,
  setupMemberData,
  setSetupContent,
  setupContent,
  setupValidation,
  hasSetupError,
  addressValidation,
  loading,
  completeSetup,
} = useJoin();

onBeforeMount(() => {
  setMemberData();
  setSetupContent();
});
</script>
