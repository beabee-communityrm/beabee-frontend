<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="mb-4 flex gap-8">
    <div class="flex-1">
      <div v-if="!isFirst">
        <AppInput
          v-model="modelValue.prevText"
          :label="t('calloutBuilder.prevButton')"
        />
      </div>
    </div>
    <div class="flex-1">
      <div v-if="isLast">
        <AppInput
          v-model="modelValue.submitText"
          :label="t('calloutBuilder.submitButton')"
          required
        />
      </div>
      <div v-else>
        <div class="mb-4">
          <AppInput
            v-model="modelValue.nextText"
            :label="t('calloutBuilder.nextButton')"
            required
          />
        </div>
        <AppSelect
          v-model="modelValue.nextSlideId"
          :label="t('calloutBuilder.nextSlide.label')"
          :items="[
            {
              id: '',
              label: t('calloutBuilder.nextSlide.default'),
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
import AppSelect from '../forms/AppSelect.vue';
import { computed } from 'vue';

import type {
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

const slideItems = computed(() =>
  props.slides.map((s) => ({ id: s.id, label: s.title }))
);
</script>
