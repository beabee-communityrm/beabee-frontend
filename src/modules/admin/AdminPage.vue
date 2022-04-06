<template>
  <div class="mb-5 flex justify-between border-primary-40 border-b pb-3">
    <PageTitle :title="t('menu.dashboard')" />
  </div>
  <p class="mb-8">
    {{ t('adminDashboard.welcomeBack', { firstName: currentUser?.firstname }) }}
  </p>
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="flex-1 basis-5/12">
      <AppHeading>{{ t('adminDashboard.numbers.title') }}</AppHeading>
      <div v-if="stats" class="flex gap-4 mt-4 mb-8">
        <KeyStat
          :label="t('adminDashboard.numbers.revenue')"
          :stat="n(stats.totalRevenue, 'currency')"
        />
        <KeyStat
          :label="t('adminDashboard.numbers.averageContribution')"
          :stat="n(stats.averageContribution, 'currency')"
        />
        <KeyStat
          :label="t('adminDashboard.numbers.newMembers')"
          :stat="'+' + n(stats.newMembers)"
        />
      </div>
      <AppHeading>{{ t('adminDashboard.mostRecentMembers.title') }}</AppHeading>
      <div class="mt-1 mb-5">
        <div
          v-for="member in recentMembers"
          :key="member.id"
          class="flex justify-between my-3 gap-4"
        >
          <router-link :to="'/contacts/' + member.id" class="text-link">
            {{
              `${member.firstname} ${member.lastname}`.trim() || member.email
            }}
          </router-link>
          <span class="text-sm text-body-40 font-semibold">
            {{
              t('common.timeAgo', {
                time: formatDistanceLocale(new Date(), member.joined),
              })
            }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex-1 basis-2/3">
      <template v-if="latestCallout">
        <AppHeading>{{ t('adminDashboard.latestCallout.title') }}</AppHeading>
        <a class="block bg-white p-4 mt-4 mb-8 rounded">
          <CalloutSummary :callout="latestCallout" />
        </a>
      </template>
      <div
        class="
          p-10
          bg-white
          text-link
          font-light
          text-2xl text-center
          rounded
          bg-[url('/src/modules/admin/assets/slack-bg.png')]
          bg-right-top
          bg-auto
          md:bg-cover
        "
      >
        <p class="w-72 max-w-72 m-auto">
          {{ t('adminDashboard.joinSlack') }}
        </p>
      </div>
    </div>
  </div>
  <div class="lg:flex gap-12 mt-8">
    <Hint>
      <p>
        Did you know callouts can be created without an end date, and just keep
        running? See our
        <a
          class="text-link"
          href="https://beabee.io/en/beabee-full-feature-list/"
          target="_blank"
          >feature showcase</a
        >
        for more
      </p>
    </Hint>
    <Hint>
      <p>
        Find out more about
        <a
          class="text-link"
          href="https://beabee.io/en/beabee-model/"
          target="_blank"
          >the beabee vision</a
        >
        around community engagement and meaningful relationships with your
        audience.
      </p>
    </Hint>
    <Hint>
      <p>
        Our
        <a
          class="text-link"
          href="https://beabee.io/en/beabee-faq/"
          target="_blank"
          >FAQ</a
        >
        addresses common questions about getting started and use cases. If the
        answer you're looking for isn't there, get in touch.
      </p>
    </Hint>
  </div>
  <p class="text-center text-sm mt-8">
    {{ t('adminDashboard.supportInbox') }}
    <a class="text-link" href="mailto:support@beabee.io">support@beabee.io</a>
  </p>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import { currentUser } from '../../store';
import AppHeading from '../../components/AppHeading.vue';
import KeyStat from './components/KeyStat.vue';
import { onBeforeMount, ref } from 'vue';
import {
  GetBasicCalloutData,
  GetMemberData,
  GetStatsData,
} from '../../utils/api/api.interface';
import { fetchMembers } from '../../utils/api/member';
import { formatDistanceLocale } from '../../utils/dates/locale-date-formats';
import Hint from './components/Hint.vue';
import { fetchCallouts } from '../../utils/api/callout';
import CalloutSummary from '../../components/CalloutSummary.vue';
import { fetchStats } from '../../utils/api/stats';
import { subDays } from 'date-fns';

const { n, t } = useI18n();

const stats = ref<GetStatsData>();
const recentMembers = ref<GetMemberData[]>([]);
const latestCallout = ref<GetBasicCalloutData>();

onBeforeMount(async () => {
  fetchStats({
    from: subDays(new Date(), 30),
    to: new Date(),
  }).then((results) => (stats.value = results));

  fetchMembers({
    limit: 5,
    sort: 'joined',
    order: 'DESC',
  }).then((results) => (recentMembers.value = results.items));

  fetchCallouts({
    limit: 1,
    sort: 'starts',
    order: 'DESC',
  }).then((results) => {
    if (results.count > 0) {
      latestCallout.value = results.items[0];
    }
  });
});
</script>
