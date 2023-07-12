<template>
  <div class="mb-4 flex gap-8">
    <div class="flex-1">
      <div v-if="!isFirst">
        <AppCheckbox
          v-model="currentPage.navigation.showPrev"
          :label="t('calloutBuilder.prevButton.showLabel')"
          class="mb-0.5"
        />
        <AppInput
          v-if="currentPage.navigation.showPrev"
          v-model="currentPage.navigation.prevText"
          required
        />
      </div>
    </div>
    <div class="flex-1">
      <div v-if="isLast">
        <AppInput
          v-model="currentPage.navigation.submitText"
          :label="t('calloutBuilder.submitButton.label')"
          required
        />
      </div>
      <div v-else>
        <AppCheckbox
          v-model="currentPage.navigation.showNext"
          :label="t('calloutBuilder.nextButton.showLabel')"
          class="mb-0.5"
        />
        <template v-if="currentPage.navigation.showNext">
          <div class="mb-4">
            <AppInput v-model="currentPage.navigation.nextText" required />
          </div>
          <AppSelect
            v-model="currentPage.navigation.nextSlideId"
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
import { CalloutPageSchema } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import AppInput from '../forms/AppInput.vue';
import AppCheckbox from '../forms/AppCheckbox.vue';
import AppSelect from '../forms/AppSelect.vue';
import { computed } from 'vue';

const props = defineProps<{
  pages: CalloutPageSchema[];
  currentPageNo: number;
}>();

const { t } = useI18n();

const isFirst = computed(() => props.currentPageNo === 0);
const isLast = computed(() => props.currentPageNo === props.pages.length - 1);

const currentPage = computed(() => props.pages[props.currentPageNo]);

const pageItems = computed(() =>
  props.pages
    .filter((p) => p.key !== currentPage.value.key)
    .map((p) => ({ id: p.key, label: p.title }))
);
</script>
