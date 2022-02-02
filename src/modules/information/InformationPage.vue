<template>
  <PageTitle
    :title="t('informationPage.title')"
    :sub-title="t('informationPage.subTitle')"
  />

  <form @submit.prevent>
    <div class="grid lg:grid-cols-2 xl:grid-cols-3">
      <div>
        <AppHeading class="mb-3">
          {{ t('informationPage.loginDetail') }}
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
            v-model="information.password"
            input-type="password"
            :label="t('form.password')"
            :info-message="t('form.passwordInfo')"
            :error-message="errorGenerator(informationValidation, 'password')"
            @blur="informationValidation.password.$touch"
          />
        </div>

        <AppHeading class="mb-3">
          {{ t('informationPage.contactInformation') }}
        </AppHeading>

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

        <AppAddress
          v-model:line1="information.addressLine1"
          v-model:line2="information.addressLine2"
          v-model:postCode="information.postCode"
          v-model:cityOrTown="information.cityOrTown"
          v-model:addressValidation="addressValidation"
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
          @click="submitFormHandler('me')"
          >{{ t('form.saveChanges') }}</AppButton
        >
      </div>
    </div>
  </form>
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

const {
  informationValidation,
  errorGenerator,
  information,
  submitFormHandler,
  initPage,
  isSaved,
  loading,
  hasFormError,
  addressValidation,
} = useInformation();

onBeforeMount(() => initPage('me'));

const { t } = useI18n();
</script>
