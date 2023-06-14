<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="mb-4 flex gap-8">
    <div class="flex-1">
      <div v-if="!isFirst">
        <AppCheckbox
          v-model="modelValue.showPrev"
          :label="t('calloutBuilder.prevButton.showLabel')"
          class="mb-0.5"
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
          :label="t('calloutBuilder.submitButton.label')"
          required
        />
      </div>
      <div v-else>
        <AppCheckbox
          v-model="modelValue.showNext"
          :label="t('calloutBuilder.nextButton.showLabel')"
          class="mb-0.5"
        />
        <template v-if="modelValue.showNext">
          <div class="mb-4">
            <AppInput v-model="modelValue.nextText" required />
          </div>
          <AppSelect
            v-model="modelValue.nextSlideId"
            :label="t('calloutBuilder.nextButton.nextSlide')"
            :items="[
              {
                id: '',
                label: t('calloutBuilder.nextButton.nextSlideDefault'),
              },
              ...pageItems,
            ]"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CalloutNavigationSchema } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../../forms/AppInput.vue';
import AppCheckbox from '../../../../forms/AppCheckbox.vue';
import AppSelect from '../../../../forms/AppSelect.vue';

defineProps<{
  modelValue: CalloutNavigationSchema;
  isFirst: boolean;
  isLast: boolean;
  pageItems: { id: string; label: string }[];
}>();

const { t } = useI18n();
</script>
