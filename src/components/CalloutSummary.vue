<template>
  <div>
    <div class="flex mb-4">
      <div class="flex-1">
        <h3 class="font-semibold text-lg">{{ callout.title }}</h3>
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

    <div class="flex flex-row flex-1 justify-between mt-3">
      <div class="flex-col">
        <p><b>36</b> {{ t('adminDashboard.responsesSoFar') }}</p>
        <router-link :to="calloutResponsesLink">
          <p class="text-link text-sm">{{ t('See all responses') }}</p>
        </router-link>
      </div>
      <div class="flex flex-row flex-nowrap">
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
        <AppButton class="ml-2">Edit</AppButton>
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

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const { t } = useI18n();

const props = defineProps<{
  callout: GetBasicCalloutData;
}>();

console.log(props.callout);

const calloutLink = computed(() => `/admin/callouts/${props.callout.slug}`);
const calloutResponsesLink = computed(() => `${calloutLink.value}/responses`);
</script>
