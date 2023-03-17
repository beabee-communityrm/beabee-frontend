<template>
  <div class="mt-10 border-t border-primary-40 pt-10 text-lg">
    <AppSubHeading class="mb-4">DEBUG comments</AppSubHeading>
  </div>
  <div>
    <CalloutResponseComment
      v-for="comment in comments.items"
      :key="comment.id"
      :comment="comment"
    ></CalloutResponseComment>
  </div>
  <div class="mt-20">
    <CalloutResponseCommentForm :comment="undefined" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" setup>
import CalloutResponseCommentForm from './CalloutResponseCommentForm.vue';
import CalloutResponseComment from './CalloutResponseComment.vue';
import { useI18n } from 'vue-i18n';
import {
  createCalloutResponseComment,
  fetchCalloutResponseComments,
} from '../../utils/api/callout-response-comments';
import { getCurrentInstance, onBeforeMount, ref } from 'vue';
import {
  CreateCalloutResponseCommentData,
  GetCalloutResponseCommentData,
  GetCalloutResponseCommentsQuery,
} from '../../utils/api/api.interface';
import { Paginated } from '@beabee/beabee-common';
import { CommentFormData } from './calloutResponseComment.interface';
import router from '../../lib/router';
import AppSubHeading from '../AppSubHeading.vue';

const props = defineProps<{
  responseId: string;
}>();

const comments = ref<Paginated<GetCalloutResponseCommentData>>({
  total: 0,
  count: 0,
  offset: 0,
  items: [],
});

async function refreshComments() {
  const query: GetCalloutResponseCommentsQuery = {
    limit: 100,
    rules: {
      rules: [
        { field: 'responseId', operator: 'equal', value: [props.responseId] },
      ],
      condition: 'AND',
    },
  };
  const paginatedComments = await fetchCalloutResponseComments(query);
  comments.value = paginatedComments;
}

onBeforeMount(refreshComments);

async function handleSubmit(commentData: CommentFormData) {
  await createCalloutResponseComment({
    text: commentData.text,
    responseId: props.responseId,
  });

  refreshComments();
}
</script>
