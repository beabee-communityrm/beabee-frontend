<template>
  <AppForm
    :button-text="t('joinSetup.continue')"
    full-button
    @submit.prevent="onSubmit?.(data)"
  >
    <JoinHeader
      :title="
        t('joinSetup.welcome', {
          firstName: data.firstName,
          lastName: data.lastName,
        })
      "
    />
    <div class="content-message mb-2" v-html="t('joinSetup.confirmDetails')" />
    <p class="mt-2 mb-6">
      {{ setupContent.welcome }}
    </p>

    <ContactBasicFields
      v-model:email="data.email"
      v-model:firstName="data.firstName"
      v-model:lastName="data.lastName"
    />

    <template v-if="setupContent.showMailOptIn">
      <ContactMailOptIn
        v-model="data.profile.deliveryOptIn"
        :content="setupContent"
      />

      <AppAddress
        v-model:line1="data.addressLine1"
        v-model:line2="data.addressLine2"
        v-model:postCode="data.postCode"
        v-model:cityOrTown="data.cityOrTown"
        :required="data.profile.deliveryOptIn"
      />
    </template>

    <AppOptIn
      v-if="showNewsletterOptIn"
      v-model="data.profile.newsletterOptIn"
      :title="setupContent.newsletterTitle"
      :text="setupContent.newsletterText"
      :label="setupContent.newsletterOptIn"
      class="mb-6"
    />
  </AppForm>
</template>
<script lang="ts" setup>
import { NewsletterStatus } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { JoinSetupContent } from '../../../utils/api/api.interface';
import JoinHeader from './JoinHeader.vue';
import AppAddress from '../../AppAddress.vue';
import ContactBasicFields from '../../contact/ContactBasicFields.vue';
import ContactMailOptIn from '../../contact/ContactMailOptIn.vue';
import { fetchContact } from '../../../utils/api/contact';
import { SetupContactData } from './join.interface';
import AppOptIn from '../../AppOptIn.vue';
import AppForm from '../../forms/AppForm.vue';

const props = defineProps<{
  setupContent: JoinSetupContent;
  onSubmit?: (data: SetupContactData) => Promise<unknown> | unknown;
}>();

const { t } = useI18n();

useVuelidate({ $stopPropagation: true });

const contact = await fetchContact('me', ['profile']);

const data = reactive<SetupContactData>({
  email: contact.email,
  firstName: contact.firstname,
  lastName: contact.lastname,
  profile: {
    newsletterOptIn: false,
    deliveryOptIn: contact.profile.deliveryOptIn,
  },
  addressLine1: contact.profile.deliveryAddress?.line1 || '',
  addressLine2: contact.profile.deliveryAddress?.line2 || '',
  cityOrTown: contact.profile.deliveryAddress?.city || '',
  postCode: contact.profile.deliveryAddress?.postcode || '',
});

const showNewsletterOptIn = computed(
  () =>
    props.setupContent.showNewsletterOptIn &&
    contact.profile.newsletterStatus !== NewsletterStatus.Subscribed
);
</script>
