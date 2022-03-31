<template>
  <div class="flex flex-col-reverse lg:flex-row lg:justify-between gap-8">
    <div class="flex-initial basis-1/2">
      <AppHeading>{{ t('calloutAdminOverview.summary') }}</AppHeading>
      <div class="flex mb-4">
        <div class="flex-1">
          <h3 class="font-semibold text-lg">{{ callout.title }}</h3>
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
        <AppInfoListItem
          :name="t('calloutAdminOverview.dates.startsOn')"
          :value="callout.starts && formatLocale(callout.starts, 'PPP')"
        />
        <AppInfoListItem
          :name="t('calloutAdminOverview.dates.endsOn')"
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
          value="To do"
        />
      </AppInfoList>
    </div>
    <div class="flex-0 flex flex-wrap lg:flex-col gap-2">
      <ActionButton icon="eye">{{
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
import { GetBasicCalloutData } from '../../../utils/api/api.interface';
import AppHeading from '../../../components/AppHeading.vue';
import AppInfoList from '../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../components/AppInfoListItem.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { formatLocale } from '../../../utils/dates/locale-date-formats';
import { computed } from 'vue';
import ActionButton from '../components/ActionButton.vue';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const props = defineProps<{
  callout: GetBasicCalloutData;
}>();
const { t } = useI18n();

const calloutLink = computed(() => `/callouts/${props.callout.slug}`);
</script>
