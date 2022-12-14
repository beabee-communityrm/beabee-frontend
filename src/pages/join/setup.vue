<route lang="yaml">
name: joinSetup
meta:
  layout: Auth
  pageTitle: pageTitle.setup
</route>

<template>
  <Suspense>
    <AuthBox>
      <SetupForm
        :setup-content="setupContent"
        :loading="saving"
        @submit="completeSetup"
      />
    </AuthBox>
  </Suspense>
</template>

<script lang="ts" setup>
import { NewsletterStatus } from '@beabee/beabee-common';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthBox from '../../components/AuthBox.vue';
import { updateContact } from '../../utils/api/contact';
import {
  JoinSetupContent,
  UpdateContactData,
} from '../../utils/api/api.interface';
import { fetchContent } from '../../utils/api/content';
import SetupForm from '../../components/pages/join/SetupForm.vue';
import { SetupContactData } from '../../components/pages/join/join.interface';

const router = useRouter();

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

async function completeSetup(data: SetupContactData) {
  saving.value = true;

  const updateContactData: UpdateContactData = {
    email: data.email,
    firstname: data.firstName,
    lastname: data.lastName,
  };

  if (data.profile.newsletterOptIn || setupContent.value.showMailOptIn) {
    updateContactData.profile = {
      ...(data.profile.newsletterOptIn && {
        newsletterStatus: NewsletterStatus.Subscribed,
      }),
      ...(setupContent.value.showMailOptIn && {
        deliveryOptIn: data.profile.deliveryOptIn,
        deliveryAddress: {
          line1: data.addressLine1,
          line2: data.addressLine2,
          city: data.cityOrTown,
          postcode: data.postCode,
        },
      }),
    };
  }

  try {
    await updateContact('me', updateContactData);
    router.push({ path: '/profile', query: { welcomeMessage: 'true' } });
  } catch (err) {
    saving.value = false;
  }
}

onBeforeMount(async () => {
  setupContent.value = await fetchContent('join/setup');
});
</script>
