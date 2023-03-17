<template>
  <div class="border-primary-30 mt-10 border-b text-lg">
    {{ props.comment.contact.displayName }}
    -
    {{ formatLocale(props.comment.createdAt, 'Pp') }}
    <AppButton @click="formVisible = true">{{ t('actions.edit') }}</AppButton>
    <AppButton
      @click="
        ($event) => {
          deleteComment();
          $emit('delete');
        }
      "
      >{{ t('actions.delete') }}</AppButton
    >
  </div>

  <div v-if="!formVisible" class="mt-3" v-html="currentComment.text" />

  <div v-if="formVisible">
    <CalloutResponseCommentForm
      :comment="currentComment"
      @submit="handleEditSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  GetCalloutResponseCommentData,
  UpdateCalloutResponseCommentData,
} from '../../utils/api/api.interface';
import {
  deleteCalloutResponseComment,
  updateCalloutResponseComment,
} from '../../utils/api/callout-response-comments';
import { formatLocale } from '../../utils/dates/locale-date-formats';
import AppButton from '../button/AppButton.vue';
import CalloutResponseCommentForm from './CalloutResponseCommentForm.vue';
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  comment: GetCalloutResponseCommentData;
}>();

defineEmits(['delete']);

const formVisible = ref<boolean>(false);
const currentComment = ref<GetCalloutResponseCommentData>(props.comment);

onBeforeMount(() => {
  currentComment.value = props.comment;
});

async function deleteComment() {
  await deleteCalloutResponseComment(props.comment.id);
}

async function handleEditSubmit(data: UpdateCalloutResponseCommentData) {
  const updatedComment = await updateCalloutResponseComment(props.comment.id, {
    text: data.text,
  });
  formVisible.value = false;
  currentComment.value.text = updatedComment.text;
}
</script>
