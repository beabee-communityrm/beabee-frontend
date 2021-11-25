<template>
  <AppAlert v-if="isPasswordReset" class="mb-8">
    <template #icon>
      <font-awesome-icon class="transform -rotate-90" :icon="['fas', 'key']" />
    </template>

    {{ t('homePage.passwordReset') }}
  </AppAlert>
  <!-- TODO: check page title implementation, after implementing other pages
    you might want to improve it
  -->
  <h1 class="md:hidden text-lg font-semibold">
    {{ `${t('common.hello')} ${member.firstName}!` }}
  </h1>

  <PageTitle
    :title="`${t('common.hello')} ${member.firstName}!`"
    :sub-title="profileContent.welcomeMessage"
  />

  <section v-if="showWelcomeMessage" class="mb-10">
    <WelcomeMessage
      :member-first-name="member.firstName"
      :text="profileContent.introMessage"
      :author-name="profileContent.introMessageAuthorName"
      :author-title="profileContent.introMessageAuthorTitle"
      @close="removeWelcomeMessage"
    />
  </section>

  <NoticeContainer />

  <section class="mb-8 md:hidden">
    <QuickActions />
  </section>

  <div class="flex flex-col content-container">
    <CalloutContainer class="mb-8 pr-4" />

    <!-- your profile section -->
    <section>
      <SectionTitle class="mb-6 md:hidden">{{
        t('homePage.yourProfile')
      }}</SectionTitle>

      <div class="hidden mb-2 items-center md:flex">
        <h2 class="text-lg font-bold mr-10">{{ t('homePage.yourProfile') }}</h2>
      </div>

      <div class="flex justify-center">
        <ContributionInfo :contribution-info="contributionInfo" />
      </div>

      <AppButton class="mt-6" to="/profile/contribution" variant="subtle">{{
        t('homePage.manageContribution')
      }}</AppButton>
    </section>
  </div>

  <section class="pt-20 mt-auto max-w-xs md:max-w-sm mx-auto">
    <ThanksNotice>{{ profileContent.footerMessage }}</ThanksNotice>
  </section>
</template>

<script lang="ts" setup>
import NoticeContainer from '../notice/NoticeContainer.vue';
import CalloutContainer from '../callout/CalloutContainer.vue';
import ContributionInfo from '../contribution/ContributionInfo.vue';
import QuickActions from './QuickActions.vue';
import ThanksNotice from './ThanksNotice.vue';
import SectionTitle from './SectionTitle.vue';
import PageTitle from '../../components/PageTitle.vue';
import AppButton from '../../components/forms/AppButton.vue';
import AppAlert from '../../components/AppAlert.vue';
import WelcomeMessage from '../../components/welcome-message/WelcomeMessage.vue';
import { useHome } from './use-home';
import { onBeforeMount } from '@vue/runtime-core';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ref } from '@vue/reactivity';

const { t } = useI18n();

const isPasswordReset = useRoute().query.passwordReset === 'true';

const hasWelcomeMessageQuery = useRoute().query.welcomeMessage === 'true';

const showWelcomeMessage = ref(hasWelcomeMessageQuery);

const removeWelcomeMessage = () => {
  showWelcomeMessage.value = false;
};

const {
  member,
  setMember,
  contributionInfo,
  setProfileContent,
  profileContent,
} = useHome();

onBeforeMount(() => {
  setProfileContent();
  setMember();
});
</script>

<style scoped>
@media screen and (min-width: 656px) {
  .content-container {
    @apply sm:flex-row sm:flex-wrap sm:justify-between;
  }
}
</style>
