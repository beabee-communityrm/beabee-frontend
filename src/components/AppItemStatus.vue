<template>
  <span class="text-sm font-bold uppercase" :class="color[status]">{{
    t('common.status.' + status)
  }}</span>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ItemStatus } from '../utils/api/api.interface';
const { t } = useI18n();
const color = {
  draft: 'text-body-40',
  scheduled: 'text-warning',
  open: 'text-success',
  ended: 'text-body-80',
};
defineProps<{
  status: ItemStatus;
}>();
</script>
