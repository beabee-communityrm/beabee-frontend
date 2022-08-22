<template>
  <form @submit.prevent="submitFormHandler('me')">
    <AppHeading class="mt-5 mb-3">
      {{ t('informationPage.contactInformation') }}
    </AppHeading>

    <ContactInformation
      v-model:email="information.emailAddress"
      v-model:firstName="information.firstName"
      v-model:lastName="information.lastName"
    />

    <AppHeading class="mt-5 mb-3">
      {{ t('informationPage.deliveryAddress') }}
    </AppHeading>

    <ContactMailOptIn
      v-if="infoContent.showMailOptIn"
      v-model="information.deliveryOptIn"
      :content="infoContent"
    />

    <AppAddress
      v-model:line1="information.addressLine1"
      v-model:line2="information.addressLine2"
      v-model:postCode="information.postCode"
      v-model:cityOrTown="information.cityOrTown"
      :required="information.deliveryOptIn"
    />

    <MessageBox
      v-if="validation.$errors.length > 0"
      type="error"
      class="mt-2"
    />

    <MessageBox v-if="isSaved" type="success" class="mt-2">
      {{ t('form.saved') }}
    </MessageBox>

    <AppButton
      type="submit"
      :disabled="validation.$invalid"
      class="mt-2"
      :loading="loading"
      variant="link"
      >{{ t('form.saveChanges') }}</AppButton
    >
  </form>
</template>
<script lang="ts" setup>
import AppButton from '../../../forms/AppButton.vue';
import ContactInformation from '../../../ContactInformation.vue';
import MessageBox from '../../../MessageBox.vue';
import AppAddress from '../../../AppAddress.vue';
import ContactMailOptIn from '../../../ContactMailOptIn.vue';
import { useI18n } from 'vue-i18n';
import { useInformation } from './use-information';
import { onBeforeMount } from '@vue/runtime-core';
import AppHeading from '../../../AppHeading.vue';
import useVuelidate from '@vuelidate/core';

const { t } = useI18n();

const {
  information,
  submitFormHandler,
  initPage,
  isSaved,
  loading,
  infoContent,
} = useInformation();

const validation = useVuelidate();

onBeforeMount(() => initPage('me'));
</script>
