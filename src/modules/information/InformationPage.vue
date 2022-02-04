<template>
  <PageTitle
    :title="t('informationPage.title')"
    :sub-title="t('informationPage.subTitle')"
  />

  <div class="grid lg:grid-cols-2 xl:grid-cols-3">
    <div>
      <AppHeading class="mb-3">
        {{ t('informationPage.loginDetail') }}
      </AppHeading>
      <ChangePassword />

      <form class="mt-5" @submit.prevent="submitFormHandler('me')">
        <AppHeading class="mb-3">
          {{ t('informationPage.contactInformation') }}
        </AppHeading>

        <div class="mb-5">
          <AppInput
            v-model="information.emailAddress"
            input-type="email"
            :label="t('form.email') + '*'"
            :error-message="
              errorGenerator(informationValidation, 'emailAddress')
            "
            @blur="informationValidation.emailAddress.$touch"
          />
        </div>

        <div class="mb-5">
          <AppInput
            v-model="information.firstName"
            input-type="text"
            :label="t('form.firstName') + '*'"
            :error-message="errorGenerator(informationValidation, 'firstName')"
            @blur="informationValidation.firstName.$touch"
          />
        </div>

        <div class="mb-5">
          <AppInput
            v-model="information.lastName"
            input-type="text"
            :label="t('form.lastName') + '*'"
            :error-message="errorGenerator(informationValidation, 'lastName')"
            @blur="informationValidation.lastName.$touch"
          />
        </div>

        <AppHeading class="mb-3">
          {{ t('informationPage.deliveryAddress') }}
        </AppHeading>

        <template v-if="infoContent.showMailOptIn">
          <p class="text-lg mb-1">
            {{ infoContent.mailTitle }}
          </p>

          <p class="mb-4 text-sm">
            {{ infoContent.mailText }}
          </p>

          <div class="mb-4">
            <input
              id="deliveryOptIn"
              v-model="information.deliveryOptIn"
              type="checkbox"
              name="updates"
            />

            <label for="deliveryOptIn" class="font-bold ml-1">
              {{ infoContent.mailOptIn }}
            </label>
          </div>
        </template>

        <AppAddress
          v-model:line1="information.addressLine1"
          v-model:line2="information.addressLine2"
          v-model:postCode="information.postCode"
          v-model:cityOrTown="information.cityOrTown"
          v-model:addressValidation="addressValidation"
          :is-address-required="information.deliveryOptIn"
        />

        <MessageBox v-if="hasFormError" type="error" class="mt-2" />

        <MessageBox v-if="isSaved" type="success" class="mt-2">
          {{ t('form.saved') }}
        </MessageBox>

        <AppButton
          type="submit"
          :disabled="hasFormError"
          class="mt-2"
          :loading="loading"
          variant="link"
          >{{ t('form.saveChanges') }}</AppButton
        >
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PageTitle from '../../components/PageTitle.vue';
import AppInput from '../../components/forms/AppInput.vue';
import AppButton from '../../components/forms/AppButton.vue';
import MessageBox from '../../components/MessageBox.vue';
import AppAddress from '../../components/AppAddress.vue';
import { useI18n } from 'vue-i18n';
import { useInformation } from './use-information';
import { onBeforeMount } from '@vue/runtime-core';
import AppHeading from '../../components/AppHeading.vue';
import ChangePassword from './components/ChangePassword.vue';

const { t } = useI18n();

const {
  informationValidation,
  errorGenerator,
  information,
  submitFormHandler,
  initPage,
  isSaved,
  loading,
  infoContent,
  hasFormError,
  addressValidation,
} = useInformation();

onBeforeMount(() => initPage('me'));
</script>
