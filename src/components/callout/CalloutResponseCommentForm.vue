<template>
  <AppForm
    :button-text="
      props.comment
        ? t('calloutResponseComments.updateComment')
        : t('calloutResponseComments.addComment')
    "
    @submit.prevent="
      ($event) => {
        $emit('submit', data);
        data.text = ''; //ToDo: How to not get 'field is required' here?
      }
    "
  >
    <div class="mb-3">
      <RichTextEditor v-model="data.text" required />
    </div>
  </AppForm>
</template>

<script lang="ts" setup>
import { GetCalloutResponseCommentData } from '../../utils/api/api.interface';
import AppForm from '../forms/AppForm.vue';
import RichTextEditor from '../rte/RichTextEditor.vue';
import { CommentFormData } from './calloutResponseComment.interface';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineEmits(['submit']);

const props = defineProps<{
  comment?: GetCalloutResponseCommentData;
}>();

const data = reactive<CommentFormData>({
  text: props.comment?.text || '',
});
</script>
