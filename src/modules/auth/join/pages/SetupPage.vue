<template>
  <AuthBox>
    <form @submit.prevent>
      <JoinHeader
        class="mb-6"
        :title="t('joinSetup.welcome', { firstName: memberData.firstName })"
        :sub-title="setupContent.welcome"
        :description="t('joinSetup.confirmDetails')"
      />

      <div class="mb-3">
        <AppInput
          v-model="memberData.email"
          input-type="email"
          label="Email"
          :error-message="errorGenerator(setupValidation, 'email')"
          @blur="setupValidation.email.$touch"
        />
      </div>

      <div class="mb-3">
        <AppInput
          v-model="memberData.firstName"
          label="First name"
          :error-message="errorGenerator(setupValidation, 'firstName')"
          @blur="setupValidation.firstName.$touch"
        />
      </div>

      <div class="mb-5">
        <AppInput
          v-model="memberData.lastName"
          label="Last name"
          :error-message="errorGenerator(setupValidation, 'lastName')"
          @blur="setupValidation.lastName.$touch"
        />
      </div>

      <template v-if="setupContent.showNewsletterOptIn">
        <p class="text-lg mb-1">
          {{ setupContent.newsletterTitle }}
        </p>

        <p class="mb-4 text-sm">
          {{ setupContent.newsletterText }}
        </p>

        <div class="mb-4">
          <input
            id="updates"
            v-model="memberData.profile.newsletterStatus"
            type="checkbox"
            name="updates"
          />

          <label for="updates" class="font-bold ml-1">
            {{ setupContent.newsletterOptIn }}
          </label>
        </div>
      </template>

      <MessageBox v-if="hasSetupError" class="mb-4" />

      <AppButton
        variant="link"
        :disabled="isSetupFormInvalid"
        @click="completeSetup"
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
import { useJoin } from '../use-join';
import { errorGenerator } from '../../../../utils/form-error-generator';
import AppButton from '../../../../components/forms/AppButton.vue';
import MessageBox from '../../../../components/MessageBox.vue';
import { updateMember } from '../join.service';
import { onBeforeMount } from '@vue/runtime-core';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const {
  setMemberData,
  memberData,
  setSetupContent,
  setupContent,
  setupValidation,
  hasSetupError,
  isSetupFormInvalid,
} = useJoin();

const router = useRouter();

const completeSetup = () => {
  updateMember(memberData, setupContent.showNewsletterOptIn)
    .then(() => {
      router.push('/profile');
    })
    .catch((err) => err);
};

onBeforeMount(() => {
  setMemberData();
  setSetupContent();
});
</script>
