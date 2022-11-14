<template>
  <div class="flex" :class="inline ? 'gap-2' : 'flex-col'">
    <AppItemStatus :status="callout.status" />
    <span v-if="callout.status === ItemStatus.Scheduled && callout.starts">
      {{
        t('callout.status.startsIn', {
          duration: formatDistanceLocale(callout.starts, new Date()),
        })
      }}
    </span>
    <span v-else-if="callout.status === ItemStatus.Open && callout.expires">
      {{
        t('callout.status.endsIn', {
          duration: formatDistanceLocale(callout.expires, new Date()),
        })
      }}
    </span>
    <span v-else-if="callout.status === ItemStatus.Ended && callout.expires">
      {{
        t('callout.status.endedOn', {
          date: formatLocale(callout.expires, 'P'),
        })
      }}
    </span>
  </div>
</template>
<script lang="ts" setup>
import { ItemStatus } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import { GetCalloutData } from '../../utils/api/api.interface';
import {
  formatDistanceLocale,
  formatLocale,
} from '../../utils/dates/locale-date-formats';
import AppItemStatus from '../AppItemStatus.vue';

const { t } = useI18n();

defineProps<{ callout: GetCalloutData; inline?: boolean }>();
</script>
