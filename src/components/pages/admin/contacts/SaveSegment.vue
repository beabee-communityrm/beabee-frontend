<template>
  <AppButton variant="link" size="sm" :icon="faFloppyDisk" @click="handleOpen">
    {{ t('advancedSearch.saveSegment.title') }}
  </AppButton>
  <AppModal
    :open="showModal"
    :title="t('advancedSearch.saveSegment.title')"
    @close="showModal = false"
  >
    <p class="mb-4">
      {{ t('advancedSearch.saveSegment.text') }}
    </p>
    <form @submit.prevent="handleSubmit">
      <AppRadioGroup
        v-if="segment"
        v-model="shouldUpdate"
        :label="t('advancedSearch.saveSegment.createOrUpdate.label')"
        :options="[
          [false, t('advancedSearch.saveSegment.createOrUpdate.create')],
          [
            true,
            t('advancedSearch.saveSegment.createOrUpdate.update', {
              segment: segment.name,
            }),
          ],
        ]"
        class="mb-4"
        required
      />
      <div class="mb-4">
        <AppInput
          v-if="!shouldUpdate"
          v-model="newSegmentName"
          :label="t('advancedSearch.saveSegment.segmentName')"
          required
        />
      </div>
      <AppButton
        class="w-full"
        :disabled="validation.$invalid"
        :loading="isSaving"
        @click="handleSubmit"
      >
        {{
          shouldUpdate
            ? t('advancedSearch.saveSegment.updateSegment')
            : t('advancedSearch.saveSegment.createSegment')
        }}
      </AppButton>
    </form>
  </AppModal>
</template>

<script lang="ts" setup>
import { RuleGroup } from '@beabee/beabee-common';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import useVuelidate from '@vuelidate/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  GetSegmentData,
  GetSegmentDataWith,
} from '../../../../utils/api/api.interface';
import { createSegment, updateSegment } from '../../../../utils/api/segments';
import AppModal from '../../../AppModal.vue';
import AppButton from '../../../button/AppButton.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';

const emit = defineEmits(['saved']);
const props = defineProps<{
  segment: GetSegmentData | undefined;
  rules: RuleGroup;
}>();

const { t } = useI18n();
const validation = useVuelidate();

const showModal = ref(false);
const shouldUpdate = ref(false);
const newSegmentName = ref('');
const isSaving = ref(false);

async function handleOpen() {
  showModal.value = true;
  shouldUpdate.value = false;
  newSegmentName.value = '';
  isSaving.value = false;
}

async function handleSubmit() {
  let segment: GetSegmentDataWith<'contactCount'>;

  isSaving.value = true;
  if (shouldUpdate.value) {
    if (!props.segment) return; // Not possible, can't choose to update without a segment

    segment = await updateSegment(props.segment.id, {
      ruleGroup: props.rules,
    });
  } else {
    segment = await createSegment({
      name: newSegmentName.value,
      ruleGroup: props.rules,
    });
  }

  emit('saved', segment);
  isSaving.value = false;
}
</script>
