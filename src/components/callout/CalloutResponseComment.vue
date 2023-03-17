<template>
  <div class="border-primary-30 mt-10 border-b text-lg">
    {{ props.comment.contact.displayName }}
    -
    {{ formatLocale(props.comment.createdAt, 'Pp') }}
  </div>

  <div class="mt-3" v-html="props.comment.text" />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { GetCalloutResponseCommentData } from '../../utils/api/api.interface';
import { formatLocale } from '../../utils/dates/locale-date-formats';

const { t } = useI18n();

const props = defineProps<{
  comment: GetCalloutResponseCommentData;
}>();
</script>
