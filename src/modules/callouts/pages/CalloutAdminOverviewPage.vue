<template>
  <div class="flex flex-col-reverse lg:flex-row lg:justify-between gap-8">
    <div class="flex-initial basis-1/2">
      <AppAlert v-if="wasJustCreated" class="mb-8">
        <template #icon>
          <font-awesome-icon :icon="['fa', 'magic']" />
        </template>

        {{ t('calloutAdminOverview.created') }}
      </AppAlert>

      <AppHeading>{{ t('calloutAdminOverview.summary') }}</AppHeading>
      <div class="flex mb-4">
        <div class="flex-1">
          <h3 class="font-title font-semibold text-lg">{{ callout.title }}</h3>
          <p>{{ callout.excerpt }}</p>
        </div>
        <div class="flex-0 ml-4">
          <img class="w-[150px]" :src="callout.image" />
        </div>
      </div>
      <p class="mb-8">
        <router-link :to="calloutLink">
          <font-awesome-icon icon="external-link-alt" />
          <span class="text-link ml-2">{{ baseUrl }}{{ calloutLink }}</span>
        </router-link>
      </p>

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
      <ActionButton icon="eye" :to="calloutLink">
        {{ t('calloutAdminOverview.actions.view') }}
      </ActionButton>
      <ActionButton icon="pencil-alt" :href="'/tools/polls/' + callout.slug">
        {{ t('calloutAdminOverview.actions.edit') }}
      </ActionButton>
      <ActionButton icon="clone" :href="'/tools/polls/' + callout.slug">
        {{ t('calloutAdminOverview.actions.replicate') }}
      </ActionButton>
      <ActionButton icon="trash" :href="'/tools/polls/' + callout.slug">
        {{ t('calloutAdminOverview.actions.delete') }}
      </ActionButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
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
import ActionButton from '../components/ActionButton.vue';
import AppAlert from '../../../components/AppAlert.vue';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const props = defineProps<{
  callout: GetMoreCalloutData;
}>();
const { t } = useI18n();

const route = useRoute();
const wasJustCreated = route.query.created !== undefined;

const calloutLink = computed(() => `/callouts/${props.callout.slug}`);
</script>
