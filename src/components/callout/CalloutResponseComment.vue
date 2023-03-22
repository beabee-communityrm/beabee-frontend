<template>
  <div class="mb-4 bg-white p-4">
    <div
      class="mb-4 flex items-center justify-between border-b border-primary-40 pb-2"
    >
      <span>
        <router-link
          :to="`/admin/contacts/${comment.contact.id}`"
          class="font-semibold text-link"
        >
          {{ comment.contact.displayName }}
        </router-link>
        -
        {{ formatLocale(comment.createdAt, 'Pp') }}
      </span>
      <AppButtonGroup>
        <AppButton
          size="sm"
          icon="pencil"
          variant="primaryOutlined"
          :title="t('actions.edit')"
          @click="formVisible = true"
        />
        <AppButton
          size="sm"
          icon="trash"
          variant="danger"
          :title="t('actions.delete')"
          @click="
            ($event) => {
              deleteComment();
              $emit('delete');
            }
          "
        />
      </AppButtonGroup>
    </div>

    <CalloutResponseCommentForm
      v-if="formVisible"
      :comment="currentComment"
      @submit="handleEditSubmit"
    />
    <div v-else class="content-message" v-html="currentComment.text" />
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
import AppButtonGroup from '../button/AppButtonGroup.vue';

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
