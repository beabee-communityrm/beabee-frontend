<template>
  <div>
    <div class="mb-4 flex">
      <div class="flex-1">
        <AppSubHeading v-if="edit">{{ callout.title }}</AppSubHeading>
        <p>{{ callout.excerpt }}</p>
      </div>
      <div class="flex-0 ml-4">
        <img class="w-[150px]" :src="callout.image" />
      </div>
    </div>
    <p>
      <router-link :to="calloutLink">
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
        <router-link :to="`/admin/callouts/view/${callout.slug}/responses`">
          <p class="text-sm font-semibold text-link">
            {{ t('adminDashboard.seeAllResponses') }}
          </p>
        </router-link>
      </div>
      <div class="text-sm font-semibold">
        <p class="text-body-60">
          <AppItemStatus :status="callout.status" />
          <span v-if="callout.expires" class="pl-2">
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
      <AppButton
        v-if="edit"
        class="ml-2"
        :to="`/admin/callouts/edit/${callout.slug}`"
      >
        {{ t('actions.edit') }}
      </AppButton>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { GetCalloutData, GetCalloutDataWith } from '../utils/api/api.interface';
import AppButton from './forms/AppButton.vue';
import AppItemStatus from './AppItemStatus.vue';
import {
  formatLocale,
  formatDistanceLocale,
} from '../utils/dates/locale-date-formats';
import AppSubHeading from './AppSubHeading.vue';
import env from './../env';

const { t } = useI18n();

const props = defineProps<{
  callout: GetCalloutData | GetCalloutDataWith<'responseCount'>;
  edit?: boolean;
}>();

const calloutLink = computed(() => `/callouts/${props.callout.slug}`);
</script>
