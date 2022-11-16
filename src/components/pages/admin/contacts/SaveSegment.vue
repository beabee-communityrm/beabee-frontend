<template>
  <AppButton
    variant="link"
    size="sm"
    icon="floppy-disk"
    @click="showModal = true"
  >
    Save segment
  </AppButton>
  <AppModal :open="showModal" title="Save segment" @close="showModal = false">
    <p class="mb-4">
      This will be some text explaining why segments are useful.
    </p>
    <form @submit.prevent="handleSubmit">
      <AppRadioGroup
        v-if="segment"
        v-model="shouldUpdate"
        label="Do you want to create a new segment?"
        :options="[
          [false, 'Create new segment'],
          [true, updateText],
        ]"
        class="mb-4"
        required
      />
      <div class="mb-4">
        <AppInput
          v-if="!shouldUpdate"
          v-model="segmentName"
          label="Segment name"
          required
        />
      </div>
      <AppButton class="w-full" :disabled="validation.$invalid">
        {{ shouldUpdate ? 'Update segment' : 'Create segment' }}
      </AppButton>
    </form>
  </AppModal>
</template>

<script lang="ts" setup>
import { RuleGroup } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { computed, ref } from 'vue';
import { GetSegmentData } from '../../../../utils/api/api.interface';
import { createSegment, updateSegment } from '../../../../utils/api/segments';
import AppModal from '../../../AppModal.vue';
import AppButton from '../../../forms/AppButton.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';

const emit = defineEmits(['save']);
const props = defineProps<{
  segment: GetSegmentData | undefined;
  rules: RuleGroup;
}>();

const validation = useVuelidate();

const showModal = ref(false);
const shouldUpdate = ref(false);
const segmentName = ref('');
const isSaving = ref(false);

const updateText = computed(() => `Update segment "${props.segment?.name}"`);

async function handleSubmit() {
  isSaving.value = true;
  if (shouldUpdate.value) {
    if (!props.segment) return; // Can't choose to update without a segment

    await updateSegment(props.segment.id, {
      ruleGroup: props.rules,
    });
    emit('save', props.segment.id);
  } else {
    const segment = await createSegment({
      name: segmentName.value,
      ruleGroup: props.rules,
      order: 5,
    });
    emit('save', segment.id);
  }
}
</script>
