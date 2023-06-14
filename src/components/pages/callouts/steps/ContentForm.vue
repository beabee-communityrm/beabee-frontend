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

        <div class="flex items-start justify-between bg-white p-4 shadow-md">
          <div>
            <AppInput
              v-model="currentPageComponent.title"
              :label="t('calloutBuilder.internalTitle')"
              required
            />
          </div>
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
        <div class="z-10 max-w-2xl flex-1 bg-white p-4 pb-0 shadow-md">
          <ContentFormNavigation
            v-model="currentPageNavigation"
            :is-first="isFirstPage"
            :is-last="isLastPage"
            :page-items="otherPageItems"
          />
        </div>
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
import ContentFormBuilder from './ContentFormBuilder.vue';
import { getPageNavigationSchema } from '../../../../utils/callouts';
import ContentFormNavigation from './ContentFormNavigation.vue';
import AppInput from '../../../forms/AppInput.vue';

const props = defineProps<{ modelValue: CalloutFormSchema }>();

const { t } = useI18n();

const currentPageNo = ref(0);
const formBuilderRef = ref<InstanceType<typeof ContentFormBuilder> | null>(
  null
);

const otherPageItems = computed(() =>
  props.modelValue.components
    .filter((c) => c.id !== currentPageComponent.value.id)
    .map((c) => ({ id: c.id, label: c.title }))
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
