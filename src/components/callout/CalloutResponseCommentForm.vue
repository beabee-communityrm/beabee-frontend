<template>
  <AppForm
    :button-text="
      props.comment ? 'edit existing comment DEBUG' : 'save new comment DEBUG'
    "
    @submit.prevent="($event) => $emit('submit', data)"
  >
    <div class="mb-3">
      <RichTextEditor v-model="data.text" required />
    </div>
  </AppForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { GetCalloutResponseCommentData } from '../../utils/api/api.interface';
import RichTextEditor from '../rte/RichTextEditor.vue';
import AppForm from '../forms/AppForm.vue';
import { CommentFormData } from './calloutResponseComment.interface';

const { t } = useI18n();

defineEmits(['submit']);

const props = defineProps<{
  comment: GetCalloutResponseCommentData | undefined;
}>();

const data = props.comment
  ? reactive<CommentFormData>({
      text: props.comment.text,
    })
  : reactive<CommentFormData>({
      text: '',
    });
</script>
