<template>
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

  <section class="mb-10 md:mb-12">
    <NoticeContainer />
  </section>

  <section v-if="browserWidth.isSm" class="mb-8">
    <QuickActions />
  </section>

  <div class="flex flex-col content-container">
    <section class="mb-8 pr-4">
      <CalloutContainer />
    </section>

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

      <AppButton class="mt-6" to="/profile/contributions" variant="subtle"
        >Manage contribution</AppButton
      >
    </section>
  </div>

  <section class="mt-20 max-w-xs md:max-w-sm mx-auto">
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
import { useHome } from './use-home';
import { onBeforeMount } from '@vue/runtime-core';
import { browserWidth } from '../../utils/browser-width';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
