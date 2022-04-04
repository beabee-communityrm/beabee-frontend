<template>
  <div class="flex flex-col-reverse lg:flex-row lg:justify-between gap-8">
    <div class="flex-initial basis-1/2">
      <AppHeading>{{ t('calloutAdminOverview.summary') }}</AppHeading>
      <CalloutSummary :callout="callout" class="mb-8" />

      <AppHeading>{{ t('calloutAdminOverview.dates.label') }}</AppHeading>
      <AppInfoList class="mb-8">
        <AppInfoListItem :name="t('calloutAdminOverview.dates.starts')">
          <span v-if="callout.starts">
            {{ formatLocale(callout.starts, 'PPP') }}
            <span
              v-if="callout.status === ItemStatus.Scheduled"
              class="font-normal"
              >({{ t('common.in') }}
              {{ formatDistanceLocale(new Date(), callout.starts) }})</span
            >
          </span>
          <span v-else>–</span>
        </AppInfoListItem>
        <AppInfoListItem
          :name="t('calloutAdminOverview.dates.ends')"
          :value="callout.expires && formatLocale(callout.expires, 'PPP')"
        />
      </AppInfoList>

      <AppHeading>{{ t('calloutAdminOverview.settings.label') }}</AppHeading>
      <AppInfoList>
        <AppInfoListItem
          :name="t('calloutAdminOverview.settings.openTo.label')"
          :value="
            callout.access === 'member'
              ? t('calloutAdminOverview.settings.openTo.membersOnly')
              : t('calloutAdminOverview.settings.openTo.everyone')
          "
        />
        <AppInfoListItem
          v-if="callout.access !== 'member'"
          :name="t('calloutAdminOverview.settings.contactInfo.label')"
          :value="
            callout.access === 'guest'
              ? t('calloutAdminOverview.settings.contactInfo.required')
              : t('calloutAdminOverview.settings.contactInfo.optional')
          "
        />
        <AppInfoListItem
          :name="t('calloutAdminOverview.settings.answers.label')"
          :value="
            callout.allowUpdate
              ? t('calloutAdminOverview.settings.answers.editable')
              : t('calloutAdminOverview.settings.answers.final')
          "
        />
        <AppInfoListItem
          :name="t('calloutAdminOverview.settings.endsWith.label')"
          :value="
            callout.thanksRedirect
              ? t('calloutAdminOverview.settings.endsWith.redirect')
              : t('calloutAdminOverview.settings.endsWith.message')
          "
        />
      </AppInfoList>
    </div>
    <div class="flex-0 flex flex-wrap lg:flex-col gap-2">
      <ActionButton icon="eye" :to="calloutLink">{{
        t('calloutAdminOverview.actions.view')
      }}</ActionButton>
      <ActionButton icon="pencil-alt">{{
        t('calloutAdminOverview.actions.edit')
      }}</ActionButton>
      <ActionButton icon="clone">{{
        t('calloutAdminOverview.actions.replicate')
      }}</ActionButton>
      <ActionButton icon="trash">{{
        t('calloutAdminOverview.actions.delete')
      }}</ActionButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import {
  GetMoreCalloutData,
  ItemStatus,
} from '../../../utils/api/api.interface';
import AppHeading from '../../../components/AppHeading.vue';
import AppInfoList from '../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../components/AppInfoListItem.vue';
import {
  formatLocale,
  formatDistanceLocale,
} from '../../../utils/dates/locale-date-formats';
import { computed } from 'vue';
import ActionButton from '../components/ActionButton.vue';
import CalloutSummary from '../../../components/CalloutSummary.vue';

const props = defineProps<{
  callout: GetMoreCalloutData;
}>();
const { t } = useI18n();

const calloutLink = computed(() => `/callouts/${props.callout.slug}`);
</script>
