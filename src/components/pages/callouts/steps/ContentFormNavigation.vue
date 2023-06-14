<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="mb-4 flex gap-4">
    <div class="flex-1">
      <div v-if="!isFirst">
        <AppCheckbox
          v-model="modelValue.showPrev"
          label="Show prev button"
          class="mb-2"
        />
        <AppInput
          v-if="modelValue.showPrev"
          v-model="modelValue.prevText"
          required
        />
      </div>
    </div>
    <div class="flex-1">
      <div v-if="isLast">
        <AppInput
          v-model="modelValue.submitText"
          label="Submit button text"
          required
        />
      </div>
      <div v-else>
        <AppCheckbox
          v-model="modelValue.showNext"
          label="Show next button"
          class="mb-2"
        />
        <AppInput
          v-if="modelValue.showNext"
          v-model="modelValue.nextText"
          required
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CalloutNavigationSchema } from '@beabee/beabee-common';
import AppInput from '../../../forms/AppInput.vue';
import AppCheckbox from '../../../forms/AppCheckbox.vue';

defineProps<{
  modelValue: CalloutNavigationSchema;
  isFirst: boolean;
  isLast: boolean;
}>();
</script>
