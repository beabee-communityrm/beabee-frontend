<template>
  <div
    class="flex flex-wrap flex-col-reverse lg:flex-row lg:justify-between gap-8"
  >
    <div>
      <AppHeading>{{ t('calloutAdminOverview.summary') }}</AppHeading>
      <div class="flex">
        <div class="flex-1">
          <h3 class="font-semibold text-lg">{{ callout.title }}</h3>
          <p>{{ callout.excerpt }}</p>
        </div>
        <div class="flex-0 ml-4"><img class="w-28" :src="callout.image" /></div>
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
          :name="t('calloutAdminOverview.settings.openTo')"
          value="Members only"
        />
        <AppInfoListItem
          :name="t('calloutAdminOverview.settings.contactInfo')"
          value="Members only"
        />
        <AppInfoListItem
          :name="t('calloutAdminOverview.settings.answers')"
          value="Members only"
        />
        <AppInfoListItem
          :name="t('calloutAdminOverview.settings.endsWith')"
          value="Members only"
        />
      </AppInfoList>
    </div>
    <div>
      <div class="flex lg:flex-col gap-2">
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
