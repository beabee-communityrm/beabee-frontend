<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <AppNotification
      v-if="wasJustReplicated"
      variant="success"
      class="mb-4"
      :title="t('editCallout.replicated')"
    />
    <AppNotification
      v-if="warnAboutEditing"
      variant="warning"
      class="mb-4"
      :title="t('editCallout.warning')"
    />

    <AppFormSection :help="inputT('intro.help')">
      <RichTextEditor
        v-model="data.introText"
        :label="inputT('intro.label')"
        required
      />
    </AppFormSection>

    <ContentForm v-model="data.formSchema" class="mt-8" />
  </div>
</template>
<script lang="ts" setup>
import { ItemStatus } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { watch } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ContentStepProps } from '../callouts.interface';
import RichTextEditor from '../../../rte/RichTextEditor.vue';
import AppFormSection from '../../../forms/AppFormSection.vue';

import AppNotification from '../../../AppNotification.vue';
import ContentForm from './ContentForm.vue';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  data: ContentStepProps;
  status: ItemStatus | undefined;
}>();

const { t } = useI18n();
const route = useRoute();
const inputT = (key: string) => t('createCallout.steps.content.inputs.' + key);

const wasJustReplicated = route.query.replicated !== undefined;

const warnAboutEditing = computed(
  () => props.status === ItemStatus.Open || props.status === ItemStatus.Ended
);

const validation = useVuelidate();

watch(
  [validation, props.data.formSchema],
  () => {
    emit('update:error', validation.value.$errors.length > 0);
    emit(
      'update:validated',
      !validation.value.$invalid && props.data.formSchema.components.length > 1
    );
  },
  { immediate: true }
);
</script>
