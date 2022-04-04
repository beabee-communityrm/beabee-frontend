<template>
  <div class="mb-5 flex justify-between border-primary-40 border-b pb-3">
    <PageTitle :title="t('menu.dashboard')" />
  </div>
  <p class="mb-8">
    {{ t('adminDashboard.welcomeBack', { firstName: currentUser?.firstname }) }}
  </p>
  <div class="flex gap-8">
    <div class="flex-1 basis-5/12">
      <AppHeading>{{ t('adminDashboard.numbers.title') }}</AppHeading>
      <div class="flex gap-4 mt-4 mb-8">
        <KeyStat :label="t('adminDashboard.numbers.revenue')" stat="€721" />
        <KeyStat
          :label="t('adminDashboard.numbers.averageContribution')"
          stat="€721"
        />
        <KeyStat :label="t('adminDashboard.numbers.newMembers')" stat="€721" />
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
      <AppHeading>{{ t('adminDashboard.latestCallout.title') }}</AppHeading>
    </div>
  </div>
  <div class="lg:flex gap-12 mt-8">
    <Hint>
      <p>
        Did you know callouts can be created without and end date, and just kept
        running?
      </p>
    </Hint>
    <Hint>
      <p>
        Did you know callouts can be created without and end date, and just kept
        running?
      </p>
    </Hint>
    <Hint>
      <p>
        Did you know callouts can be created without and end date, and just kept
        running?
      </p>
    </Hint>
  </div>
  <p class="text-center text-sm">{{ t('adminDashboard.supportInbox') }}</p>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import PageTitle from '../../components/PageTitle.vue';
import { currentUser } from '../../store';
import AppHeading from '../../components/AppHeading.vue';
import KeyStat from './components/KeyStat.vue';
import { onBeforeMount, ref } from 'vue';
import { GetMemberData } from '../../utils/api/api.interface';
import { fetchMembers } from '../../utils/api/member';
import { formatDistanceLocale } from '../../utils/dates/locale-date-formats';
import Hint from './components/Hint.vue';

const { t } = useI18n();

const recentMembers = ref<GetMemberData[]>([]);

onBeforeMount(async () => {
  fetchMembers({
    limit: 5,
    sort: 'joined',
    order: 'DESC',
  }).then((results) => (recentMembers.value = results.items));
});
</script>
