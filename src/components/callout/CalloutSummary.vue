<template>
  <div>
    <div class="mb-4 flex">
      <div class="flex-1">
        <AppSubHeading>{{ callout.title }}</AppSubHeading>
        <p>{{ callout.excerpt }}</p>
      </div>
      <div class="flex-0 ml-4">
        <img class="w-[150px]" :src="callout.image" />
      </div>
    </div>
    <p>
      <router-link :to="calloutLink" class="relative z-10">
        <font-awesome-icon icon="external-link-alt" />
        <span class="ml-2 text-link">{{ env.appUrl }}{{ calloutLink }}</span>
      </router-link>
    </p>

    <div class="mt-3 flex flex-1 items-end justify-between md:flex-row">
      <div v-if="'responseCount' in callout" class="flex-1">
        <i18n-t
          keypath="adminDashboard.responsesSoFar"
          tag="p"
          :plural="callout.responseCount"
        >
          <template #n>
            <b>{{ callout.responseCount }}</b>
          </template>
        </i18n-t>
        <router-link
          :to="`/admin/callouts/view/${callout.slug}/responses`"
          class="relative z-10"
        >
          <p class="text-sm font-semibold text-link">
            {{ t('adminDashboard.seeAllResponses') }}
          </p>
        </router-link>
      </div>
      <div class="text-sm font-semibold">
        <p class="text-body-60">
          <CalloutStatus :callout="callout" inline />
        </p>
        <p v-if="callout.starts">
          <font-awesome-icon :icon="['far', 'calendar']" class="mr-2" />
          {{ formatLocale(callout.starts, 'PP') + ' - ' }}
          {{ callout.expires && formatLocale(callout.expires, 'PP') }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import {
  GetCalloutData,
  GetCalloutDataWith,
} from '../../utils/api/api.interface';
import { formatLocale } from '../../utils/dates/locale-date-formats';
import AppSubHeading from '../AppSubHeading.vue';
import env from './../../env';
import CalloutStatus from './CalloutStatus.vue';

const { t } = useI18n();

const props = defineProps<{
  callout: GetCalloutData | GetCalloutDataWith<'responseCount'>;
}>();

const calloutLink = computed(() => `/callouts/${props.callout.slug}`);
</script>
