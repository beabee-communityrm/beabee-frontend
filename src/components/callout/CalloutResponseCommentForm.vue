<template>
  <AppForm
    :button-text="
      props.comment
        ? t('calloutResponseComments.actions.updateComment')
        : t('calloutResponseComments.actions.addComment')
    "
    @submit.prevent="handleSubmit"
  >
    <div class="mb-4">
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
import useVuelidate from '@vuelidate/core';

const { t } = useI18n();

const validation = useVuelidate();

const emit = defineEmits(['submit']);

const props = defineProps<{
  comment?: GetCalloutResponseCommentData;
}>();

const data = reactive<CommentFormData>({
  text: props.comment?.text || '',
});

function handleSubmit() {
  emit('submit', data);
  validation.value.$reset();
  data.text = '';
}
</script>
