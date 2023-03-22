<template>
  <div class="mt-10 border-t border-primary-40 pt-10 text-lg">
    <AppHeading class="mb-4">
      {{ t('calloutResponseComments.comments') }}
    </AppHeading>
  </div>

  <CalloutResponseComment
    v-for="comment in comments.items"
    :key="comment.id"
    :comment="comment"
    @delete="refreshComments"
  />
  <div class="bg-white p-4">
    <AppSubHeading class="mb-2">
      {{ t('calloutResponseComments.addComment') }}
    </AppSubHeading>
    <CalloutResponseCommentForm @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" setup>
import {
  GetCalloutResponseCommentData,
  GetCalloutResponseCommentsQuery,
} from '../../utils/api/api.interface';
import {
  createCalloutResponseComment,
  fetchCalloutResponseComments,
} from '../../utils/api/callout-response-comments';
import AppHeading from '../AppHeading.vue';
import AppSubHeading from '../AppSubHeading.vue';
import CalloutResponseComment from './CalloutResponseComment.vue';
import CalloutResponseCommentForm from './CalloutResponseCommentForm.vue';
import { CommentFormData } from './calloutResponseComment.interface';
import { Paginated } from '@beabee/beabee-common';
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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

  await refreshComments();
}
</script>
