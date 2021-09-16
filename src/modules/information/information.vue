<template>
  <page-title
    :title="t('informationPage.title')"
    :sub-title="t('informationPage.subTitle')"
  />

  <h2 class="mb-3 text-lg font-bold">{{ t('informationPage.loginDetail') }}</h2>

  <form @submit.prevent>
    <div class="grid md:grid-cols-2">
      <div>
        <div class="mb-5">
          <app-input
            v-model="information.emailAddress"
            input-type="email"
            :label="t('informationPage.form.email')"
            :error-message="errorGenerator('emailAddress')"
            @blur="v$.emailAddress.$touch"
            @update:modelValue="v$.emailAddress.$touch"
          />
        </div>

        <div class="mb-5">
          <app-input
            v-model="information.password"
            input-type="password"
            :label="t('informationPage.form.password')"
            :info-message="t('informationPage.form.passwordInfo')"
            :error-message="errorGenerator('password')"
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
            :label="t('informationPage.form.firstName')"
            :error-message="errorGenerator('firstName')"
            @blur="v$.firstName.$touch"
          />
        </div>

        <div class="mb-5">
          <app-input
            v-model="information.lastName"
            input-type="text"
            :label="t('informationPage.form.lastName')"
            :error-message="errorGenerator('lastName')"
            @blur="v$.lastName.$touch"
          />
        </div>

        <div class="mb-5">
          <app-input
            v-model="information.addressLine1"
            input-type="text"
            :label="t('informationPage.form.addressLine1')"
            :error-message="errorGenerator('addressLine1')"
            @update:modelValue="touchAddressFields"
          />
        </div>

        <div class="mb-5">
          <app-input
            v-model="information.addressLine2"
            input-type="text"
            :label="t('informationPage.form.addressLine2')"
            @update:modelValue="touchAddressFields"
          />
        </div>

        <div class="grid grid-cols-6 gap-4">
          <div class="mb-5 col-span-4">
            <app-input
              v-model="information.cityOrTown"
              input-type="text"
              :label="t('informationPage.form.cityOrTown')"
              :error-message="errorGenerator('cityOrTown')"
              @update:modelValue="touchAddressFields"
            />
          </div>

          <div class="mb-5 col-span-2">
            <app-input
              v-model="information.postCode"
              input-type="text"
              :label="t('informationPage.form.postCode')"
              :error-message="errorGenerator('postCode')"
              @update:modelValue="touchAddressFields"
            />
          </div>
        </div>

        <error-aggregator v-if="hasError" />
      </div>
    </div>

    <app-button
      :disabled="isButtonDisabled"
      class="mt-11"
      @click="submitFormHandler"
      >{{ t('informationPage.form.saveChanges') }}</app-button
    >
  </form>
</template>

<script lang="ts" setup>
import PageTitle from '../../components/PageTitle.vue';
import AppInput from '../../components/forms/AppInput.vue';
import AppButton from '../../components/forms/AppButton.vue';
import ErrorAggregator from '../../components/forms/ErrorAggregator.vue';
import { useI18n } from 'vue-i18n';
import { computed } from '@vue/reactivity';
import { useInformation } from './use-information';
import { onMounted } from '@vue/runtime-core';

const {
  v$,
  errorGenerator,
  information,
  submitFormHandler,
  touchAddressFields,
  setInformation,
} = useInformation();

onMounted(setInformation);

const { t } = useI18n();

const isButtonDisabled = computed(() => v$.value.$invalid);
const hasError = computed(() => v$.value.$errors.length);
</script>
