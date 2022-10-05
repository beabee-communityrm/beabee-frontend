<route lang="yaml">
name: adminCalloutViewOverview
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <div class="flex flex-col-reverse gap-8 lg:flex-row lg:justify-between">
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

      <div class="mb-8 rounded bg-white p-4">
        <CalloutSummary :callout="callout" />
      </div>

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
    <div class="flex-0 flex flex-wrap gap-2 lg:flex-col">
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
import { GetCalloutDataWith } from '../../../../../utils/api/api.interface';
import { deleteCallout } from '../../../../../utils/api/callout';
import AppHeading from '../../../../../components/AppHeading.vue';
import AppInfoList from '../../../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../../../components/AppInfoListItem.vue';
import ActionButton from '../../../../../components/pages/callouts/ActionButton.vue';
import CalloutSummary from '../../../../../components/callout/CalloutSummary.vue';
import AppAlert from '../../../../../components/AppAlert.vue';
import { createCallout } from '../../../../../utils/api/callout';
import AppConfirmDialog from '../../../../../components/AppConfirmDialog.vue';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
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
