<template>
  <time
    :datetime="datetime.toISOString()"
    :title="formatLocale(datetime, 'PPpp')"
    >{{ label }}</time
  >
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { formatDistanceLocale, formatLocale } from '../utils/dates';
import { useI18n } from 'vue-i18n';

const props = defineProps<{ datetime: Date }>();

const { t } = useI18n();

const label = computed(() => {
  const now = new Date();
  const time = formatDistanceLocale(props.datetime, now);
  return props.datetime > now
    ? t('common.timeIn', { time })
    : t('common.timeAgo', { time });
});
</script>
