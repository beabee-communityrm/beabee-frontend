<template>
  <span class="text-sm font-bold uppercase" :class="color[status]">{{
    t('common.status.' + status)
  }}</span>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const color = {
  open: 'text-success',
  finished: 'text-body',
};
defineProps<{
  status: 'open' | 'finished';
}>();
</script>
