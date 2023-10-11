<template>
  <AppForm
    :button-text="reviewer ? t('actions.update') : t('actions.add')"
    :reset-button-text="t('actions.cancel')"
    @submit="handleSubmit"
    @reset="$emit('cancel')"
  >
    <div class="mb-4">
      <AppInput
        v-model="data.name"
        :label="t('reviewerEditor.name')"
        required
      />
    </div>
  </AppForm>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  CreateCalloutReviewerData,
  GetCalloutReviewerData,
} from '../../utils/api/api.interface';
import AppForm from '../forms/AppForm.vue';
import AppInput from '../forms/AppInput.vue';

const { t } = useI18n();

defineEmits<{ (e: 'cancel'): void }>();

const props = defineProps<{
  reviewer?: GetCalloutReviewerData;
  onSave?: (data: CreateCalloutReviewerData) => Promise<void>;
}>();

// This means no form this form is embedded into will ever validate
// while it's open, preventing unsaved changes from propogating
useVuelidate({ never: { required } }, { never: undefined });

const data = reactive({
  name: props.reviewer?.reviewer || '',
  callout: props.reviewer?.callout || '',
});

async function handleSubmit() {
  await props.onSave?.({
    reviewer: data.name,
    callout: data.callout,
  });
}
</script>
