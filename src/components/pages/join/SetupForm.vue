<template>
  <form @submit.prevent="emit('submit', setupMemberData)">
    <JoinHeader
      :title="
        t('joinSetup.welcome', {
          firstName: setupMemberData.firstName,
          lastName: setupMemberData.lastName,
        })
      "
    />
    <div class="content-message mb-2" v-html="t('joinSetup.confirmDetails')" />
    <p class="mt-2 mb-6">
      {{ setupContent.welcome }}
    </p>

    <ContactUpdateBasicInformation
      v-model:email="setupMemberData.email"
      v-model:firstName="setupMemberData.firstName"
      v-model:lastName="setupMemberData.lastName"
    />

    <template v-if="setupContent.showMailOptIn">
      <ContactMailOptIn
        v-model="setupMemberData.profile.deliveryOptIn"
        :content="setupContent"
      />

      <AppAddress
        v-model:line1="setupMemberData.addressLine1"
        v-model:line2="setupMemberData.addressLine2"
        v-model:postCode="setupMemberData.postCode"
        v-model:cityOrTown="setupMemberData.cityOrTown"
        :required="setupMemberData.profile.deliveryOptIn"
      />
    </template>

    <AppOptIn
      v-if="showNewsletterOptIn"
      v-model="setupMemberData.profile.newsletterOptIn"
      :title="setupContent.newsletterTitle"
      :text="setupContent.newsletterText"
      :label="setupContent.newsletterOptIn"
      class="mb-6"
    />

    <MessageBox v-if="validation.$errors.length > 0" class="mb-2" />

    <AppButton
      variant="link"
      type="submit"
      :loading="loading"
      :disabled="validation.$invalid"
      class="mb-3 w-full"
    >
      {{ t('joinSetup.continue') }}
    </AppButton>
  </form>
</template>
<script lang="ts" setup>
import { NewsletterStatus } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { JoinSetupContent } from '../../../utils/api/api.interface';
import JoinHeader from './JoinHeader.vue';
import AppAddress from '../../AppAddress.vue';
import AppButton from '../../forms/AppButton.vue';
import MessageBox from '../../MessageBox.vue';
import ContactUpdateBasicInformation from '../../contact/ContactUpdateBasicInformation.vue';
import ContactMailOptIn from '../../contact/ContactMailOptIn.vue';
import { fetchMember } from '../../../utils/api/member';
import { SetupMemberData } from './join.interface';
import AppOptIn from '../../AppOptIn.vue';

const emit = defineEmits(['submit']);
const props = defineProps<{
  setupContent: JoinSetupContent;
  loading?: boolean;
}>();

const { t } = useI18n();
const validation = useVuelidate({ $stopPropagation: true });

const member = await fetchMember('me', ['profile']);

const setupMemberData = reactive<SetupMemberData>({
  email: member.email,
  firstName: member.firstname,
  lastName: member.lastname,
  profile: {
    newsletterOptIn: false,
    deliveryOptIn: member.profile.deliveryOptIn,
  },
  addressLine1: member.profile.deliveryAddress?.line1 || '',
  addressLine2: member.profile.deliveryAddress?.line2 || '',
  cityOrTown: member.profile.deliveryAddress?.city || '',
  postCode: member.profile.deliveryAddress?.postcode || '',
});

const showNewsletterOptIn = computed(
  () =>
    props.setupContent.showNewsletterOptIn &&
    member.profile.newsletterStatus !== NewsletterStatus.Subscribed
);
</script>
