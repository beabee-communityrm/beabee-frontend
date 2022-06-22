<template>
  <SetupForm
    :setup-content="setupContent"
    :loading="saving"
    @submit="completeSetup"
  />
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NewsletterStatus } from '../../../../utils/enums/newsletter-status.enum';
import { updateMember } from '../../../../utils/api/member';
import {
  JoinSetupContent,
  UpdateMemberData,
} from '../../../../utils/api/api.interface';
import { fetchJoinSetupContent } from '../../../../utils/api/content';
import SetupForm from '../components/SetupForm.vue';
import { SetupMemberData } from '../join.interface';

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

async function completeSetup(setupMemberData: SetupMemberData) {
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
  saving.value = false;
  setupContent.value = await fetchJoinSetupContent();
});
</script>
