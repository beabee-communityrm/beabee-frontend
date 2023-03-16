<template>
  <div>Here we will display the comments</div>
  <div>
    <CalloutResponseCommentForm :comment="undefined" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" setup>
import CalloutResponseCommentForm from './CalloutResponseCommentForm.vue';
import { useI18n } from 'vue-i18n';
import {
  createCalloutResponseComment,
  fetchCalloutResponseComments,
} from '../../utils/api/callout-response-comments';
import { getCurrentInstance, onBeforeMount, ref } from 'vue';
import {
  CreateCalloutResponseCommentData,
  GetCalloutResponseCommentData,
} from '../../utils/api/api.interface';
import { Paginated } from '@beabee/beabee-common';
import { CommentFormData } from './calloutResponseComment.interface';
import router from '../../lib/router';

const props = defineProps<{
  responseId: string;
}>();

const comments = ref<Paginated<GetCalloutResponseCommentData>>({
  total: 0,
  count: 0,
  offset: 0,
  items: [],
});

// onBeforeMount(async () => {
//   const paginatedComments = await fetchCalloutResponseComments(
//     props.responseId
//   );
//   comments.value = paginatedComments;
// });

async function handleSubmit(commentData: CommentFormData) {
  const comment: GetCalloutResponseCommentData | undefined =
    await createCalloutResponseComment({
      text: commentData.text,
      responseId: props.responseId,
    });

  //if (comment) router.go(0);
  //ToDo: How not to reload the hole page? Probably do manually or check "key-changing technique"
}
</script>
