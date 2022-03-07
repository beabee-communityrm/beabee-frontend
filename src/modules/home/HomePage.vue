<template>
  <AppAlert v-if="isPasswordReset" class="mb-8">
    <template #icon>
      <font-awesome-icon class="transform -rotate-90" :icon="['fas', 'key']" />
    </template>

    {{ t('homePage.passwordReset') }}
  </AppAlert>
  <h1 class="md:hidden text-lg font-semibold">
    {{ `${t('common.hello')} ${user.firstname}!` }}
  </h1>

  <PageTitle
    :title="`${t('common.hello')} ${user.firstname}!`"
    :sub-title="profileContent.welcomeMessage"
  />

  <section v-if="showWelcomeMessage" class="mb-10">
    <WelcomeMessage
      :member-first-name="user.firstname"
      :text="profileContent.introMessage"
      @close="removeWelcomeMessage"
    />
  </section>

  <NoticeContainer class="mb-10 md:mb-12" />

  <section class="mb-8 md:hidden">
    <QuickActions />
  </section>

  <div class="lg:flex justify-between">
    <section v-if="callouts.length" class="mb-6 lg:mr-6">
      <SectionTitle class="mb-6 md:hidden">{{
        t('homePage.openCallouts')
      }}</SectionTitle>
      <AppHeading class="mb-2 hidden md:block">{{
        t('homePage.openCallouts')
      }}</AppHeading>

      <div class="flex mb-4">
        <!-- just show the first callout for now (design decision) -->
        <CalloutCard :callout="callouts[0]" />
      </div>

      <!--<AppButton to="/callouts" variant="primaryOutlined">{{
        t('homePage.viewAllCallouts')
      }}</AppButton>-->
    </section>

    <section>
      <SectionTitle class="mb-6 md:hidden">{{
        t('homePage.yourProfile')
      }}</SectionTitle>
      <AppHeading class="mb-2 hidden md:block">{{
        t('homePage.yourProfile')
      }}</AppHeading>

      <div class="flex mb-4">
        <ContributionInfo :member="user" />
      </div>

      <AppButton to="/profile/contribution" variant="primaryOutlined">{{
        t('homePage.manageContribution')
      }}</AppButton>
    </section>
  </div>

  <section class="hidden pt-20 mt-auto max-w-xs md:max-w-sm mx-auto">
    <ThanksNotice>{{ profileContent.footerMessage }}</ThanksNotice>
  </section>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import NoticeContainer from '../notice/NoticeContainer.vue';
import ContributionInfo from './components/ContributionInfo.vue';
import QuickActions from './components/QuickActions.vue';
import ThanksNotice from './components/ThanksNotice.vue';
import SectionTitle from './components/SectionTitle.vue';
import PageTitle from '../../components/PageTitle.vue';
import AppButton from '../../components/forms/AppButton.vue';
import AppAlert from '../../components/AppAlert.vue';
import CalloutCard from '../../components/CalloutCard.vue';
import WelcomeMessage from '../../components/welcome-message/WelcomeMessage.vue';
import AppHeading from '../../components/AppHeading.vue';
import {
  GetBasicCalloutData,
  GetMemberData,
  ItemStatus,
  ProfileContent,
} from '../../utils/api/api.interface';
import { fetchProfileContent } from '../../utils/api/content';
import { fetchCallouts } from '../../utils/api/callout';
import { currentUser } from '../../store';

const { t } = useI18n();

const isPasswordReset = useRoute().query.passwordReset === 'true';

const hasWelcomeMessageQuery = useRoute().query.welcomeMessage === 'true';

const showWelcomeMessage = ref(hasWelcomeMessageQuery);

const removeWelcomeMessage = () => {
  showWelcomeMessage.value = false;
};

const profileContent = ref<ProfileContent>({
  welcomeMessage: '',
  footerMessage: '',
  introMessage: '',
});

const callouts = ref<GetBasicCalloutData[]>([]);

// This page is behind auth so currentUser can't be null
// TODO: is there a nicer way to handle this?
const user = currentUser as Ref<GetMemberData>;

onBeforeMount(async () => {
  profileContent.value = await fetchProfileContent();
  callouts.value = (
    await fetchCallouts({
      rules: {
        condition: 'AND',
        rules: [
          {
            field: 'status',
            operator: 'equal',
            value: ItemStatus.Open,
          },
          {
            field: 'hidden',
            operator: 'equal',
            value: false,
          },
        ],
      },
    })
  ).items;
});
</script>
