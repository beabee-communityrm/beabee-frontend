<template>
  <div class="border-primary-30 mt-10 border-b text-lg">
    {{ props.comment.contact.displayName }}
    -
    {{ formatLocale(props.comment.createdAt, 'Pp') }}

    <AppButton @click="formVisible = true">DEBUG Edit</AppButton>
    <AppButton @click="deleteComment">DEBUG Delete</AppButton>
  </div>

  <div v-if="!formVisible" class="mt-3" v-html="props.comment.text" />
  <div v-if="formVisible">
    <CalloutResponseCommentForm
      :comment="props.comment"
      @submit="handleEditSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { GetCalloutResponseCommentData } from '../../utils/api/api.interface';
import CalloutResponseCommentForm from './CalloutResponseCommentForm.vue';
import { formatLocale } from '../../utils/dates/locale-date-formats';
import AppButton from '../button/AppButton.vue';
import { deleteCalloutResponseComment } from '../../utils/api/callout-response-comments';

const { t } = useI18n();

const formVisible = ref(false);

const props = defineProps<{
  comment: GetCalloutResponseCommentData;
}>();

async function deleteComment() {
  await deleteCalloutResponseComment(props.comment.id);
}

async function handleEditSubmit() {
  formVisible.value = false;
}
</script>
