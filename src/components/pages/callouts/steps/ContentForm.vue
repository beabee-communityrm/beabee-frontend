<template>
  <div>
    <div class="flex gap-8">
      <div class="max-w-2xl flex-1">
        <ul class="mb-4 flex flex-wrap gap-4">
          <li
            v-for="(page, pageNo) in modelValue.components"
            :key="page.key"
            class="rounded p-4"
            :class="
              currentPageNo === pageNo
                ? 'bg-white'
                : 'cursor-pointer bg-primary-10 hover:bg-white'
            "
            @click="currentPageNo = pageNo"
          >
            {{ page.title }}
          </li>
          <li>
            <AppButton variant="primary" @click="handleAddPage">
              {{ t('calloutBuilder.actions.addSlide') }}
            </AppButton>
          </li>
        </ul>

        <div class="flex items-center justify-between bg-white p-4 shadow-md">
          <AppHeading>{{ currentPageComponent.title }}</AppHeading>
          <div><AppButton variant="dangerOutlined" :icon="faTrash" /></div>
        </div>
      </div>
      <div class="flex-initial basis-48" />
    </div>

    <div class="min-h-[32rem]">
      <ContentFormBuilder
        ref="formBuilderRef"
        :form="modelValue"
        @change="handleChange"
      />
      <div class="flex gap-8">
        <section class="z-10 mb-6 max-w-2xl flex-1 bg-white p-4 pb-0 shadow-md">
          <div class="mb-4 flex gap-4">
            <div class="flex-1">
              <div v-if="!isFirstPage">
                <AppCheckbox
                  v-model="currentPageNavigation.showPrev"
                  label="Show prev button"
                  class="mb-2"
                />
                <AppInput
                  v-if="currentPageNavigation.showPrev"
                  v-model="currentPageNavigation.prevText"
                  required
                />
              </div>
            </div>
            <div class="flex-1">
              <div v-if="isLastPage">
                <AppInput
                  v-model="currentPageNavigation.submitText"
                  label="Submit button text"
                  required
                />
              </div>
              <div v-else>
                <AppCheckbox
                  v-model="currentPageNavigation.showNext"
                  label="Show next button"
                  class="mb-2"
                />
                <AppInput
                  v-if="currentPageNavigation.showNext"
                  v-model="currentPageNavigation.nextText"
                  required
                />
              </div>
            </div>
          </div>
        </section>
        <div class="flex-initial basis-48"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  CalloutComponentSchema,
  CalloutFormSchema,
} from '@beabee/beabee-common';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import AppButton from '../../../button/AppButton.vue';
import AppCheckbox from '../../../forms/AppCheckbox.vue';
import AppInput from '../../../forms/AppInput.vue';
import AppHeading from '../../../AppHeading.vue';
import ContentFormBuilder from './ContentFormBuilder.vue';
import { getPageNavigationSchema } from '../../../../utils/callouts';

const props = defineProps<{ modelValue: CalloutFormSchema }>();

const { t } = useI18n();

const currentPageNo = ref(0);
const formBuilderRef = ref<InstanceType<typeof ContentFormBuilder> | null>(
  null
);

const currentPageComponent = computed(
  () => props.modelValue.components[currentPageNo.value]
);
const currentPageNavigation = computed(
  () => props.modelValue.navigation[currentPageNo.value]
);

const isFirstPage = computed(() => currentPageNo.value === 0);
const isLastPage = computed(
  () => currentPageNo.value === props.modelValue.components.length - 1
);

function handleChange(components: CalloutComponentSchema[]) {
  // eslint-disable-next-line vue/no-mutating-props
  props.modelValue.components = components;

  const maxPageNo = components.length - 1;
  if (currentPageNo.value > maxPageNo) {
    currentPageNo.value = maxPageNo;
  }
}

watch(currentPageNo, (newPageNo) => {
  formBuilderRef.value?.setPage(newPageNo);
});

function handleAddPage() {
  formBuilderRef.value?.addPage();

  // eslint-disable-next-line vue/no-mutating-props
  props.modelValue.navigation.push(getPageNavigationSchema());
  currentPageNo.value = props.modelValue.navigation.length - 1;
}
</script>
