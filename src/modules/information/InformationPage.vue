<template>
  <PageTitle
    :title="t('informationPage.title')"
    :sub-title="t('informationPage.subTitle')"
  />

  <h2 class="mb-3 text-lg font-bold">{{ t('informationPage.loginDetail') }}</h2>

  <form @submit.prevent>
    <div class="grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-24">
      <div>
        <div class="mb-5">
          <AppInput
            v-model="information.emailAddress"
            input-type="email"
            :label="t('form.email')"
            required
            :error-message="
              errorGenerator(informationValidation, 'emailAddress')
            "
            @blur="informationValidation.emailAddress.$touch"
          />
        </div>

        <div class="mb-5">
          <AppInput
            v-model="information.password"
            input-type="password"
            :label="t('form.password')"
            :info-message="t('form.passwordInfo')"
            :error-message="errorGenerator(informationValidation, 'password')"
            @blur="informationValidation.password.$touch"
          />
        </div>

        <h2 class="mb-3 text-lg font-bold">
          {{ t('informationPage.contactInformation') }}
        </h2>

        <div class="mb-5">
          <AppInput
            v-model="information.firstName"
            input-type="text"
            :label="t('form.firstName')"
            required
            :error-message="errorGenerator(informationValidation, 'firstName')"
            @blur="informationValidation.firstName.$touch"
          />
        </div>

        <div class="mb-5">
          <AppInput
            v-model="information.lastName"
            input-type="text"
            :label="t('form.lastName')"
            required
            :error-message="errorGenerator(informationValidation, 'lastName')"
            @blur="informationValidation.lastName.$touch"
          />
        </div>

        <!-- TODO: remove 'member' from array -->
        <div v-can-see="['member', 'admin', 'super-admin']" class="mb-5">
          <AppInput
            v-model="information.phone"
            input-type="text"
            :label="t('form.phone')"
          />
        </div>

        <div class="mb-2">
          <AppAddress
            v-model:line1="information.addressLine1"
            v-model:line2="information.addressLine2"
            v-model:postCode="information.postCode"
            v-model:cityOrTown="information.cityOrTown"
            v-model:addressValidation="addressValidation"
            :is-address-required="information.deliveryOptIn"
          />
        </div>

        <div class="mb-4">
          <input
            id="delivery-opt-in"
            v-model="information.deliveryOptIn"
            type="checkbox"
          />

          <label for="delivery-opt-in" class="font-bold ml-1">
            {{ t('form.deliveryOptIn') }}
          </label>
        </div>

        <MessageBox v-if="hasFormError" type="error" class="mb-4" />

        <MessageBox v-if="isSaved" type="success" class="mb-4">
          {{ t('form.saved') }}
        </MessageBox>

        <MessageBox v-if="isContactPage" type="warning" class="mb-4">
          {{ t('form.warning') }}
        </MessageBox>
      </div>

      <!-- TODO: remove 'member' from array -->
      <div v-can-see="['member', 'admin', 'super-admin']">
        <div class="mb-5">
          <AppInput
            v-model="information.description"
            input-type="text"
            :label="t('form.description')"
          />
        </div>

        <div>
          <TextArea v-model="information.notes" :label="t('form.notes')" />
        </div>
      </div>
    </div>

    <AppButton
      :disabled="hasFormError"
      class="mt-5"
      :loading="loading"
      variant="secondary"
      @click="submitFormHandler"
      >{{ t('form.saveChanges') }}</AppButton
    >
  </form>
</template>

<script lang="ts" setup>
import PageTitle from '../../components/PageTitle.vue';
import AppInput from '../../components/forms/AppInput.vue';
import TextArea from '../../components/forms/TextArea.vue';
import AppButton from '../../components/forms/AppButton.vue';
import MessageBox from '../../components/MessageBox.vue';
import AppAddress from '../../components/AppAddress.vue';
import { useI18n } from 'vue-i18n';
import { useInformation } from './use-information';
import { onBeforeMount } from '@vue/runtime-core';

const {
  informationValidation,
  errorGenerator,
  information,
  submitFormHandler,
  setInformation,
  isSaved,
  loading,
  hasFormError,
  addressValidation,
  isContactPage,
} = useInformation();

onBeforeMount(() => {
  setInformation();
  // - TODO: Why component isn't destroyed on route change?
  // It's here because when you saved the information and showed the succes message,
  // if you went to other pages and come back, you still saw the success
  // message because isSaved remained true.
  isSaved.value = false;
});

const { t } = useI18n();
</script>
