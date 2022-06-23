<template>
  <div>
    <div class="flex mb-4">
      <div class="flex-1">
        <AppSubHeading>{{ callout.title }}</AppSubHeading>
        <p>{{ callout.excerpt }}</p>
      </div>
      <div class="flex-0 ml-4">
        <img class="w-[150px]" :src="callout.image" />
      </div>
    </div>
    <p>
      <router-link :to="calloutLink">
        <font-awesome-icon icon="external-link-alt" />
        <span class="text-link ml-2">{{ baseUrl }}{{ calloutLink }}</span>
      </router-link>
    </p>

    <div
      v-if="footer"
      class="flex flex-col md:flex-row flex-1 justify-between items-end mt-3"
    >
      <div class="flex-col">
        <!--<p><b>36</b> {{ t('adminDashboard.responsesSoFar') }}</p>-->
        <router-link :to="`/admin/callouts/view/${callout.slug}/responses`">
          <p class="text-link text-sm">{{ t('See all responses') }}</p>
        </router-link>
      </div>
      <div class="flex flex-row flex-nowrap mt-3 md:mt-0">
        <div class="flex-col text-sm">
          <p class="text-body-40">
            <AppItemStatus :status="callout.status" /> -
            <span v-if="callout.expires">
              {{
                t('callout.status.endsIn', {
                  duration: formatDistanceLocale(new Date(), callout.expires),
                })
              }}
            </span>
          </p>
          <font-awesome-icon :icon="['far', 'calendar']" class="mr-2" />
          {{
            callout.starts
              ? formatLocale(callout.starts, 'PP') + ' - '
              : t('common.until')
          }}
          {{ callout.expires && formatLocale(callout.expires, 'PP') }}
        </div>
        <AppButton class="ml-2" :to="`/admin/callouts/edit/${callout.slug}`">{{
          t('calloutAdminOverview.actions.edit')
        }}</AppButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { GetBasicCalloutData } from '../utils/api/api.interface';
import AppButton from './forms/AppButton.vue';
import AppItemStatus from './AppItemStatus.vue';
import {
  formatLocale,
  formatDistanceLocale,
} from '../utils/dates/locale-date-formats';
import AppSubHeading from './AppSubHeading.vue';

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const { t } = useI18n();

const props = defineProps<{
  callout: GetBasicCalloutData;
  footer?: boolean;
}>();

const calloutLink = computed(() => `/callouts/${props.callout.slug}`);
</script>
