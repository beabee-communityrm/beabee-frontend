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
        <font-awesome-icon :icon="faExternalLinkAlt" />
        <span class="ml-2 text-link">{{ env.appUrl }}{{ calloutLink }}</span>
      </router-link>
    </p>

    <div class="mt-3 flex flex-1 items-end justify-between md:flex-row">
      <div class="flex-1">
        <router-link
          :to="`/admin/callouts/view/${callout.slug}/responses`"
          class="relative z-10"
        >
          <AppButton class="text-sm font-semibold">
            {{ t('adminDashboard.seeAllResponses') }} ({{
              callout.responseCount
            }})
          </AppButton>
        </router-link>
      </div>
      <div class="text-sm font-semibold">
        <p class="text-body-60">
          <ItemStatusText :item="callout" inline />
        </p>
        <ItemDateRange :item="callout"></ItemDateRange>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { GetCalloutDataWith } from '../../utils/api/api.interface';

import env from './../../env';
import ItemStatusText from '../item/ItemStatusText.vue';
import ItemDateRange from '../item/ItemDateRange.vue';
import AppSubHeading from '../AppSubHeading.vue';
import AppButton from '../button/AppButton.vue';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const { t } = useI18n();

const props = defineProps<{
  callout: GetCalloutDataWith<'responseCount'>;
}>();

const calloutLink = computed(() => `/callouts/${props.callout.slug}`);
</script>
