<route lang="yaml">
name: joinSurvey
meta:
  layout: Auth
  pageTitle: pageTitle.setup
</route>

<template>
  <AuthBox
    :title="
      t('joinSetup.welcome', {
        firstName: currentUser?.firstname,
        lastName: currentUser?.lastname,
      })
    "
  >
    <template #header>
      <p class="content-message" v-html="t('joinSurvey.confirmDetails')" />
    </template>
    <CalloutForm
      v-if="joinSurvey"
      :callout="joinSurvey"
      :style="'sm'"
      @submitted="goToProfile"
    />
  </AuthBox>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import AuthBox from '../../components/AuthBox.vue';
import CalloutForm from '../../components/pages/callouts/CalloutForm.vue';
import { onBeforeMount, ref } from 'vue';
import { fetchContent } from '../../utils/api/content';
import {
  GetCalloutDataWith,
  JoinSetupContent,
} from '../../utils/api/api.interface';
import { fetchCallout } from '../../utils/api/callout';
import { currentUser } from '../../store';
import { useRouter } from 'vue-router';

const { t } = useI18n();
const router = useRouter();

const joinSurvey = ref<GetCalloutDataWith<'form'>>();

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
  surveyRequired: false,
});

function goToProfile() {
  router.push({ path: '/profile', query: { welcomeMessage: 'true' } });
}

onBeforeMount(async () => {
  try {
    setupContent.value = await fetchContent('join/setup');
    joinSurvey.value = await fetchCallout(setupContent.value.surveySlug, [
      'form',
    ]);
  } catch (e) {
    // Fail silently as a failing join survey shouldn't stop the user completing the join flow
    goToProfile();
  }
});
</script>
