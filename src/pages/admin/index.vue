<route lang="yaml">
name: admin
meta:
  role: admin
  pageTitle: menu.dashboard
</route>

<template>
  <PageTitle :title="t('menu.dashboard')" border />
  <p class="mb-8">
    {{ t('adminDashboard.welcomeBack', { firstName: currentUser?.firstname }) }}
  </p>
  <div class="flex flex-col lg:flex-row gap-8">
    <div class="flex-1 basis-5/12">
      <AppHeading>{{ t('adminDashboard.numbers.title') }}</AppHeading>
      <div v-if="stats" class="flex gap-4 mt-4 mb-8">
        <KeyStat
          :label="t('adminDashboard.numbers.revenue')"
          :stat="
            stats.totalRevenue === null
              ? '-'
              : n(stats.totalRevenue, 'currency')
          "
        />
        <KeyStat
          :label="t('adminDashboard.numbers.averageContribution')"
          :stat="
            stats.averageContribution === null
              ? '-'
              : n(stats.averageContribution, 'currency')
          "
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
          <router-link :to="'/admin/contacts/' + member.id" class="text-link">
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
    <div class="flex-1 basis-7/12">
      <AppHeading>{{ t('adminDashboard.latestCallout.title') }}</AppHeading>
      <div class="block bg-white p-4 mt-4 mb-8 rounded">
        <CalloutSummary v-if="latestCallout" :callout="latestCallout" footer />
        <div v-else-if="latestCallout === null">
          {{ t('adminDashboard.latestCallout.empty') }}
          <router-link to="/admin/callouts/new" class="text-link">
            {{ t('adminDashboard.latestCallout.createNew') }}
          </router-link>
        </div>
      </div>
      <div
        class="
          p-10
          bg-white
          text-link
          font-light
          text-2xl text-center
          rounded
          bg-[url('/src/assets/images/slack-bg.png')] bg-right-top bg-auto
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
    <Hint class="content-i18n" v-html="t('adminDashboard.hint1')" />
    <Hint class="content-i18n" v-html="t('adminDashboard.hint2')" />
    <Hint class="content-i18n" v-html="t('adminDashboard.hint3')" />
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
import KeyStat from '../../components/pages/admin/KeyStat.vue';
import { onBeforeMount, ref } from 'vue';
import {
  GetBasicCalloutData,
  GetMemberData,
  GetStatsData,
} from '../../utils/api/api.interface';
import { fetchMembers } from '../../utils/api/member';
import { formatDistanceLocale } from '../../utils/dates/locale-date-formats';
import Hint from '../../components/pages/admin/Hint.vue';
import { fetchCallouts } from '../../utils/api/callout';
import CalloutSummary from '../../components/CalloutSummary.vue';
import { fetchStats } from '../../utils/api/stats';
import { subDays } from 'date-fns';

const { n, t } = useI18n();

const stats = ref<GetStatsData>();
const recentMembers = ref<GetMemberData[]>([]);
const latestCallout = ref<GetBasicCalloutData | null>();

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
    latestCallout.value = results.count > 0 ? results.items[0] : null;
  });
});
</script>
