<template>
  <div>Here we will display the comments</div>
  <div>
    <CalloutResponseCommentForm :comment="undefined" />
  </div>
</template>

<script lang="ts" setup>
import CalloutResponseCommentForm from './CalloutResponseCommentForm.vue';
import { useI18n } from 'vue-i18n';
import { fetchCalloutResponseComments } from '../../utils/api/callout-response-comments';
import { onBeforeMount, ref } from 'vue';
import { GetCalloutResponseCommentData } from '../../utils/api/api.interface';
import { Paginated } from '@beabee/beabee-common';

const props = defineProps<{
  responseId: string;
}>();

const comments = ref<Paginated<GetCalloutResponseCommentData>>({
  total: 0,
  count: 0,
  offset: 0,
  items: [],
});

onBeforeMount(async () => {
  const paginatedComments = await fetchCalloutResponseComments(
    props.responseId
  );
  comments.value = paginatedComments;
});
</script>
