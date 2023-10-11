<template>
  <div class="mb-3 rounded border border-primary-20 bg-primary-10">
    <div class="flex items-center bg-primary-5 p-2 pl-4 text-sm">
      <strong class="font-bold text-body-80">
        <font-awesome-icon :icon="faUser" class="mr-2" />{{ reviewer.reviewer }}
      </strong>
      <AppButtonGroup class="ml-auto">
        <AppButton
          size="sm"
          variant="text"
          @click="formVisible = !formVisible"
          >{{ t('actions.edit') }}</AppButton
        >
        <AppButton
          size="sm"
          variant="dangerText"
          @click="showDeleteModal = true"
        >
          {{ t('actions.delete') }}
        </AppButton>
      </AppButtonGroup>
    </div>

    <ReviewerEditorForm
      v-if="formVisible"
      class="p-4"
      :reviewer="reviewer"
      @save="handleSave"
      @cancel="formVisible = false"
    />
    <AppConfirmDialog
      :open="showDeleteModal"
      :title="t('tagEditor.confirmDelete.title')"
      :cancel="t('actions.noBack')"
      :confirm="t('actions.yesRemove')"
      variant="danger"
      @close="showDeleteModal = false"
      @confirm="$emit('delete', reviewer.reviewer)"
    >
      <p>{{ t('tagEditor.confirmDelete.text') }}</p>
    </AppConfirmDialog>
  </div>
</template>
<script lang="ts" setup>
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  GetCalloutReviewerData,
  UpdateCalloutReviewerData,
} from '../../utils/api/api.interface';
import AppConfirmDialog from '../AppConfirmDialog.vue';
import AppButton from '../button/AppButton.vue';
import AppButtonGroup from '../button/AppButtonGroup.vue';
import ReviewerEditorForm from './ReviewerEditorForm.vue';

defineEmits<{
  (e: 'delete', id: string): void;
}>();
const props = defineProps<{
  reviewer: GetCalloutReviewerData;
  onUpdate?: (data: UpdateCalloutReviewerData) => Promise<void>;
}>();

const { t } = useI18n();

const formVisible = ref(false);
const showDeleteModal = ref(false);

async function handleSave(data: UpdateCalloutReviewerData) {
  await props.onUpdate?.(data);
  formVisible.value = false;
}
</script>
