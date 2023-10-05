<route lang="yaml">
name: joinSetup
meta:
  layout: Auth
  pageTitle: pageTitle.setup
</route>

<template>
  <Suspense>
    <AuthBox
      v-if="joinSurvey"
      :title="
        t('joinSetup.welcome', {
          firstName: updatedContact?.firstname,
          lastName: updatedContact?.lastname,
        })
      "
    >
      <template #header>
        <div class="content-message" v-html="t('joinSetup.confirmDetails')" />
      </template>

      <CalloutForm
        :callout="joinSurvey"
        :style="'sm'"
        @submitted="goToProfile"
      />
    </AuthBox>
    <SetupForm
      v-else
      :setup-content="setupContent"
      :loading="isSaving"
      @submit="handleSubmitSetup"
    />
  </Suspense>
</template>

<script lang="ts" setup>
import { NewsletterStatus } from '@beabee/beabee-common';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { updateContact } from '../../utils/api/contact';
import {
  GetCalloutDataWith,
  GetContactData,
  JoinSetupContent,
  UpdateContactData,
} from '../../utils/api/api.interface';
import { fetchContent } from '../../utils/api/content';
import SetupForm from '../../components/pages/join/SetupForm.vue';
import { SetupContactData } from '../../components/pages/join/join.interface';
import AuthBox from '../../components/AuthBox.vue';
import CalloutForm from '../../components/pages/callouts/CalloutForm.vue';
import { useI18n } from 'vue-i18n';
import { fetchCallout } from '../../utils/api/callout';

const { t } = useI18n();
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
  surveySlug: '',
});

const isSaving = ref(false);
const joinSurvey = ref<GetCalloutDataWith<'form'>>();

const updatedContact = ref<GetContactData>();

async function fetchJoinSurvey() {
  if (setupContent.value.surveySlug) {
    try {
      return await fetchCallout(setupContent.value.surveySlug, ['form']);
    } catch (e) {
      // Fail silently as a failing join survey shouldn't stop the user completing the join flow
    }
  }
}

async function handleSubmitSetup(data: SetupContactData) {
  isSaving.value = true;

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

  updatedContact.value = await updateContact('me', updateContactData);

  joinSurvey.value = await fetchJoinSurvey();
  if (!joinSurvey.value) {
    goToProfile();
  }
}

function goToProfile() {
  router.push({ path: '/profile', query: { welcomeMessage: 'true' } });
}

onBeforeMount(async () => {
  setupContent.value = await fetchContent('join/setup');
});
</script>
