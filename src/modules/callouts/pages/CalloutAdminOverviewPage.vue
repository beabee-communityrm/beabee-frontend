<template>
  <div class="flex flex-col-reverse lg:flex-row lg:justify-between gap-8">
    <div class="flex-initial basis-1/2">
      <AppAlert v-if="wasJustCreated || wasJustUpdated" class="mb-8">
        <template #icon>
          <font-awesome-icon :icon="['fa', 'magic']" />
        </template>
        {{
          wasJustCreated
            ? t('calloutAdminOverview.created')
            : t('calloutAdminOverview.updated')
        }}
      </AppAlert>

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
      <ActionButton icon="eye" :to="calloutLink">
        {{ t('actions.view') }}
      </ActionButton>
      <ActionButton
        icon="pencil-alt"
        :to="'/admin/callouts/edit/' + callout.slug"
      >
        {{ t('actions.edit') }}
      </ActionButton>
      <ActionButton icon="clone" @click="replicateThisCallout()">
        {{ t('actions.replicate') }}
      </ActionButton>
      <ActionButton icon="trash" @click="showDeleteModal = true">
        {{ t('actions.delete') }}
      </ActionButton>
      <AppConfirmDialog
        v-if="showDeleteModal"
        open
        @close="showDeleteModal = false"
        @confirm="confirmDeleteCallout"
      >
        <template #title>
          {{ t('calloutAdminOverview.actions.confirmDelete.title') }}
        </template>
        <template #text>
          {{ t('calloutAdminOverview.actions.confirmDelete.text') }}
        </template>
        <template #button-cancel-text>
          {{ t('calloutAdminOverview.actions.confirmDelete.actionNo') }}
        </template>
        <template #button-confirm-text>
          {{ t('calloutAdminOverview.actions.confirmDelete.actionYes') }}
        </template>
      </AppConfirmDialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import {
  GetMoreCalloutData,
  ItemStatus,
} from '../../../utils/api/api.interface';
import { deleteCallout } from '../../../utils/api/callout';
import AppHeading from '../../../components/AppHeading.vue';
import AppInfoList from '../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../components/AppInfoListItem.vue';
import {
  formatLocale,
  formatDistanceLocale,
} from '../../../utils/dates/locale-date-formats';
import ActionButton from '../components/ActionButton.vue';
import CalloutSummary from '../../../components/CalloutSummary.vue';
import AppAlert from '../../../components/AppAlert.vue';
import { createCallout } from '../../../utils/api/callout';
import AppConfirmDialog from '../../../components/AppConfirmDialog.vue';

const props = defineProps<{
  callout: GetMoreCalloutData;
}>();
const { t } = useI18n();

const route = useRoute();
const router = useRouter();
const wasJustCreated = route.query.created !== undefined;
const wasJustUpdated = route.query.updated !== undefined;

const showDeleteModal = ref(false);

const calloutLink = computed(() => `/callouts/${props.callout.slug}`);

const confirmDeleteCallout = () => {
  deleteCallout(props.callout.slug);
  router.push({
    path: '/admin/callouts',
    query: { deleted: null },
  });
};

async function replicateThisCallout() {
  const newCalloutData = {
    ...props.callout,
    slug: props.callout.slug + '-copy',
    title: props.callout.title + ' copy',
    status: undefined,
    starts: null,
    expires: null,
  };
  const newCallout = await createCallout(newCalloutData);
  router.push({
    path: '/admin/callouts/edit/' + newCallout.slug,
    query: { replicated: null },
  });
}
</script>
