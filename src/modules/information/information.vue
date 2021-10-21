<template>
  <page-title
    :title="t('informationPage.title')"
    :sub-title="t('informationPage.subTitle')"
  />

  <h2 class="mb-3 text-lg font-bold">{{ t('informationPage.loginDetail') }}</h2>

  <form @submit.prevent>
    <div class="grid lg:grid-cols-2 xl:grid-cols-3">
      <div>
        <div class="mb-5">
          <app-input
            v-model="information.emailAddress"
            input-type="email"
            :label="t('form.email') + '*'"
            :error-message="errorGenerator(v$, 'emailAddress')"
            @blur="v$.emailAddress.$touch"
          />
        </div>

        <div class="mb-5">
          <app-input
            v-model="information.password"
            input-type="password"
            :label="t('form.password')"
            :info-message="t('form.passwordInfo')"
            :error-message="errorGenerator(v$, 'password')"
            @blur="v$.password.$touch"
          />
        </div>

        <h2 class="mb-3 text-lg font-bold">
          {{ t('informationPage.contactInformation') }}
        </h2>

        <div class="mb-5">
          <app-input
            v-model="information.firstName"
            input-type="text"
            :label="t('form.firstName') + '*'"
            :error-message="errorGenerator(v$, 'firstName')"
            @blur="v$.firstName.$touch"
          />
        </div>

        <div class="mb-5">
          <app-input
            v-model="information.lastName"
            input-type="text"
            :label="t('form.lastName') + '*'"
            :error-message="errorGenerator(v$, 'lastName')"
            @blur="v$.lastName.$touch"
          />
        </div>

        <div class="mb-5">
          <app-input
            v-model="information.addressLine1"
            input-type="text"
            :label="t('form.addressLine1')"
            :error-message="errorGenerator(v$, 'addressLine1')"
            @update:modelValue="touchAddressFields"
          />
        </div>

        <div class="mb-5">
          <app-input
            v-model="information.addressLine2"
            input-type="text"
            :label="t('form.addressLine2')"
            @update:modelValue="touchAddressFields"
          />
        </div>

        <div class="grid grid-cols-6 gap-4">
          <div class="mb-5 col-span-4">
            <app-input
              v-model="information.cityOrTown"
              input-type="text"
              :label="t('form.cityOrTown')"
              :error-message="errorGenerator(v$, 'cityOrTown')"
              @update:modelValue="touchAddressFields"
            />
          </div>

          <div class="mb-5 col-span-2">
            <app-input
              v-model="information.postCode"
              input-type="text"
              :label="t('form.postCode')"
              :error-message="errorGenerator(v$, 'postCode')"
              @update:modelValue="touchAddressFields"
            />
          </div>
        </div>

        <error-aggregator v-if="isFormInvalid" class="mt-2" />

        <app-button
          :disabled="isFormInvalid"
          class="mt-5 w-full"
          color="link"
          @click="submitFormHandler"
          >{{ t('form.saveChanges') }}</app-button
        >
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import PageTitle from '../../components/PageTitle.vue';
import AppInput from '../../components/forms/AppInput.vue';
import AppButton from '../../components/forms/AppButton.vue';
import ErrorAggregator from '../../components/forms/ErrorAggregator.vue';
import { useI18n } from 'vue-i18n';
import { useInformation } from './use-information';
import { onMounted } from '@vue/runtime-core';

const {
  v$,
  errorGenerator,
  information,
  submitFormHandler,
  touchAddressFields,
  setInformation,
  isFormInvalid,
} = useInformation();

onMounted(setInformation);

const { t } = useI18n();
</script>
