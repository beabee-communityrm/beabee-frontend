<route lang="yaml">
name: adminContactsViewInformation
meta:
  pageTitle: menu.community
  role: admin
</route>

<template>
  <form @submit.prevent="submitFormHandler(contact.id)">
    <div class="grid lg:grid-cols-2 xl:grid-cols-3">
      <div>
        <AppHeading class="mb-3">
          {{ t('informationPage.contactInformation') }}
        </AppHeading>

        <ContactInformation
          v-model:email="information.emailAddress"
          v-model:firstName="information.firstName"
          v-model:lastName="information.lastName"
          optional-names
        />

        <AppHeading class="mt-5 mb-3">
          {{ t('informationPage.deliveryAddress') }}
        </AppHeading>

        <AppRadioGroup
          v-if="infoContent.showMailOptIn"
          v-model="information.deliveryOptIn"
          name="deliveryOptIn"
          :label="t('contactInformation.deliveryOptIn')"
          :options="[
            [true, t('common.yes')],
            [false, t('common.no')],
          ]"
          class="mb-4"
          inline
        />

        <AppAddress
          v-model:line1="information.addressLine1"
          v-model:line2="information.addressLine2"
          v-model:postCode="information.postCode"
          v-model:cityOrTown="information.cityOrTown"
          :is-address-required="information.deliveryOptIn"
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
      </div>
    </div>
  </form>
</template>
<script lang="ts" setup>
import { onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useInformation } from '../../../../components/pages/profile/information/use-information';
import AppButton from '../../../../components/forms/AppButton.vue';
import MessageBox from '../../../../components/MessageBox.vue';
import AppAddress from '../../../../components/AppAddress.vue';
import AppHeading from '../../../../components/AppHeading.vue';
import { GetMemberData } from '../../../../utils/api/api.interface';
import useVuelidate from '@vuelidate/core';
import ContactInformation from '../../../../components/ContactInformation.vue';
import AppRadioGroup from '../../../../components/forms/AppRadioGroup.vue';

const props = defineProps<{
  contact: GetMemberData;
}>();

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

onBeforeMount(() => initPage(props.contact.id));
</script>
