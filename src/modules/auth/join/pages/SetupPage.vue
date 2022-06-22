<template>
  <AuthBox>
    <form @submit.prevent="completeSetup">
      <JoinHeader
        class="mb-6"
        :title="
          t('joinSetup.welcome', {
            firstName: setupMemberData.firstName,
            lastName: setupMemberData.lastName,
          })
        "
        :sub-title="setupContent.welcome"
        :description="t('joinSetup.confirmDetails')"
      />

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
          :is-address-required="setupMemberData.profile.deliveryOptIn"
        />
      </template>

      <template v-if="setupContent.showNewsletterOptIn">
        <p class="text-lg mb-1">
          {{ setupContent.newsletterTitle }}
        </p>

        <p class="mb-4 text-sm">
          {{ setupContent.newsletterText }}
        </p>

        <div class="mb-4">
          <input
            id="newsletterOptIn"
            v-model="setupMemberData.profile.newsletterOptIn"
            type="checkbox"
            name="updates"
          />

          <label for="newsletterOptIn" class="font-bold ml-1">
            {{ setupContent.newsletterOptIn }}
          </label>
        </div>
      </template>

      <MessageBox v-if="validation.$errors.length > 0" class="mb-4" />

      <AppButton
        variant="link"
        type="submit"
        :loading="saving"
        :disabled="validation.$invalid"
        class="w-full"
      >
        {{ t('joinSetup.continue') }}
      </AppButton>
    </form>
  </AuthBox>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import AuthBox from '../../AuthBox.vue';
import JoinHeader from '../components/JoinHeader.vue';
import AppAddress from '../../../../components/AppAddress.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import MessageBox from '../../../../components/MessageBox.vue';
import { NewsletterStatus } from '../../../../utils/enums/newsletter-status.enum';
import { fetchMember, updateMember } from '../../../../utils/api/member';
import {
  JoinSetupContent,
  UpdateMemberData,
} from '../../../../utils/api/api.interface';
import { fetchContent } from '../../../../utils/api/content';
import ContactInformation from '../../../../components/ContactInformation.vue';
import ContactMailOptIn from '../../../../components/ContactMailOptIn.vue';

const { t } = useI18n();

const router = useRouter();

const setupMemberData = reactive({
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

const setupContent = ref<JoinSetupContent>({
  welcome: '',
  newsletterText: '',
  newsletterOptIn: '',
  newsletterTitle: '',
  showNewsletterOptIn: false,
  showMailOptIn: false,
  mailTitle: '',
  mailText: '',
  mailOptIn: '',
});

const saving = ref(false);

const validation = useVuelidate();

async function completeSetup() {
  saving.value = true;

  const updateMemberData: UpdateMemberData = {
    email: setupMemberData.email,
    firstname: setupMemberData.firstName,
    lastname: setupMemberData.lastName,
  };

  if (
    setupMemberData.profile.newsletterOptIn ||
    setupContent.value.showMailOptIn
  ) {
    updateMemberData.profile = {
      ...(setupMemberData.profile.newsletterOptIn && {
        newsletterStatus: NewsletterStatus.Subscribed,
      }),
      ...(setupContent.value.showMailOptIn && {
        deliveryOptIn: setupMemberData.profile.deliveryOptIn,
        deliveryAddress: {
          line1: setupMemberData.addressLine1,
          line2: setupMemberData.addressLine2,
          city: setupMemberData.cityOrTown,
          postcode: setupMemberData.postCode,
        },
      }),
    };
  }

  try {
    await updateMember('me', updateMemberData);
    router.push({ path: '/profile', query: { welcomeMessage: 'true' } });
  } catch (err) {
    saving.value = false;
  }
}

onBeforeMount(async () => {
  const member = await fetchMember('me', ['profile']);

  saving.value = false;

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

  setupContent.value = await fetchContent('join/setup');
});
</script>
