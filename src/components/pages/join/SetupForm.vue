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
    <div class="content-message mb-6" v-html="t('joinSetup.confirmDetails')" />
    <p class="mt-2 mb-4">
      {{ setupContent.welcome }}
    </p>

    <ContactInformation
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

    <template v-if="setupContent.showNewsletterOptIn">
      <p class="mb-1 text-lg">
        {{ setupContent.newsletterTitle }}
      </p>

      <p class="mb-4 text-sm">
        {{ setupContent.newsletterText }}
      </p>

      <AppCheckbox
        v-model="setupMemberData.profile.newsletterOptIn"
        :label="setupContent.newsletterOptIn"
        class="mb-4 font-bold"
      />
    </template>

    <MessageBox v-if="validation.$errors.length > 0" class="mb-4" />

    <AppButton
      variant="link"
      type="submit"
      :loading="loading"
      :disabled="validation.$invalid"
      class="w-full"
    >
      {{ t('joinSetup.continue') }}
    </AppButton>
  </form>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { onBeforeMount, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { JoinSetupContent } from '../../../utils/api/api.interface';
import JoinHeader from './JoinHeader.vue';
import AppAddress from '../../AppAddress.vue';
import AppButton from '../../forms/AppButton.vue';
import MessageBox from '../../MessageBox.vue';
import ContactInformation from '../../ContactInformation.vue';
import ContactMailOptIn from '../../ContactMailOptIn.vue';
import AppCheckbox from '../../forms/AppCheckbox.vue';
import { fetchMember } from '../../../utils/api/member';
import { NewsletterStatus } from '../../../utils/enums/newsletter-status.enum';
import { SetupMemberData } from './join.interface';

const emit = defineEmits(['submit']);
defineProps<{
  setupContent: JoinSetupContent;
  loading?: boolean;
}>();

const { t } = useI18n();
const validation = useVuelidate({ $stopPropagation: true });

const setupMemberData = reactive<SetupMemberData>({
  email: '',
  firstName: '',
  lastName: '',
  profile: {
    newsletterOptIn: false,
    deliveryOptIn: false,
  },
  addressLine1: '',
  addressLine2: '',
  cityOrTown: '',
  postCode: '',
});

onBeforeMount(async () => {
  const member = await fetchMember('me', ['profile']);

  setupMemberData.firstName = member.firstname;
  setupMemberData.lastName = member.lastname;
  setupMemberData.email = member.email;
  setupMemberData.profile.newsletterOptIn =
    member.profile.newsletterStatus === NewsletterStatus.Subscribed
      ? true
      : false;
  setupMemberData.profile.deliveryOptIn = member.profile.deliveryOptIn;
  if (member.profile.deliveryAddress) {
    setupMemberData.addressLine1 = member.profile.deliveryAddress.line1;
    setupMemberData.addressLine2 = member.profile.deliveryAddress.line2 || '';
    setupMemberData.cityOrTown = member.profile.deliveryAddress.city;
    setupMemberData.postCode = member.profile.deliveryAddress.postcode;
  }
});
</script>
