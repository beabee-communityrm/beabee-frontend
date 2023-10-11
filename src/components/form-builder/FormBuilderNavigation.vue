<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="mb-4 flex gap-8">
    <div class="flex-1">
      <div v-if="!isFirst">
        <!-- <AppCheckbox
          v-model="modelValue.showPrev"
          :label="t('calloutBuilder.prevButton.showLabel')"
          class="mb-0.5"
        /> -->
        <AppInput v-model="modelValue.prevText" required />
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
        <!-- <AppCheckbox
          v-model="currentPage.navigation.showNext"
          :label="t('calloutBuilder.nextButton.showLabel')"
          class="mb-0.5"
        /> -->
        <!-- <template v-if="currentPage.navigation.showNext"> -->
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
            ...slideItems,
          ]"
        />
        <!-- </template> -->
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import AppInput from '../forms/AppInput.vue';
// import AppCheckbox from '../forms/AppCheckbox.vue';
import AppSelect from '../forms/AppSelect.vue';
import { computed } from 'vue';

import {
  CalloutNavigationSchema,
  CalloutSlideSchema,
} from '@beabee/beabee-common';

defineEmits<{
  (e: 'update:modelValue', value: CalloutNavigationSchema): void;
}>();
const props = defineProps<{
  slides: CalloutSlideSchema[];
  isFirst: boolean;
  isLast: boolean;
  modelValue: CalloutNavigationSchema;
}>();

const { t } = useI18n();

// const isFirst = computed(() => props.currentPageNo === 0);
// const isLast = computed(() => props.currentPageNo === props.pages.length - 1);

const slideItems = computed(() =>
  props.slides
    // .filter((s) => s.id !== currentPage.value.key)
    .map((s) => ({ id: s.id, label: s.title }))
);
</script>
