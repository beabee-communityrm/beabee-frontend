<template>
  <div>
    <div v-if="isWizard" class="flex gap-8">
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
            <p>{{ page.title }}</p>
            <p v-if="page.navigation.nextSlideId" class="mt-2 pl-2 text-xs">
              ↳
              {{
                modelValue.components.find(
                  (p) => p.key === page.navigation.nextSlideId
                )?.title ?? '???'
              }}
            </p>
            <p
              v-else-if="
                page.navigation.showNext &&
                pageNo !== modelValue.components.length - 1
              "
              class="mt-2 pl-2 text-xs"
            >
              ↳ {{ modelValue.components[pageNo + 1].title }}
            </p>
          </li>

          <AppButton variant="primary" :icon="faPlus" @click="handleAddPage">
            {{ t('calloutBuilder.actions.addSlide') }}
          </AppButton>
        </ul>

        <div class="flex items-end gap-4 bg-white p-4 shadow-md">
          <div class="flex-1">
            <AppInput
              v-model="currentPageComponent.title"
              :label="t('calloutBuilder.internalTitle')"
              required
            />
          </div>
          <div>
            <AppButton
              variant="dangerOutlined"
              :icon="faTrash"
              @click="handleDeletePage"
            />
          </div>
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

      <div v-if="isWizard" class="flex gap-8">
        <div class="z-10 max-w-2xl flex-1 bg-white p-4 pb-0 shadow-md">
          <ContentFormNavigation
            :pages="modelValue.components"
            :current-page-no="currentPageNo"
          />
        </div>
        <div class="flex-initial basis-48"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CalloutPageSchema, CalloutFormSchema } from '@beabee/beabee-common';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import AppButton from '../../../../button/AppButton.vue';
import ContentFormBuilder from './ContentFormBuilder.vue';
import ContentFormNavigation from './ContentFormNavigation.vue';
import AppInput from '../../../../forms/AppInput.vue';

const props = defineProps<{ modelValue: CalloutFormSchema }>();

const { t } = useI18n();

const currentPageNo = ref(0);
const formBuilderRef = ref<InstanceType<typeof ContentFormBuilder> | null>(
  null
);

const isWizard = computed(() => props.modelValue.display === 'wizard');

const currentPageComponent = computed(
  () => props.modelValue.components[currentPageNo.value]
);

function handleChange(components: CalloutPageSchema[]) {
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
  if (!formBuilderRef.value) return; // Can't add page without builder being loaded

  formBuilderRef.value.addPage();
  // eslint-disable-next-line vue/no-mutating-props
  currentPageNo.value = props.modelValue.components.length - 1;
}

function handleDeletePage() {
  // eslint-disable-next-line vue/no-mutating-props
  props.modelValue.components.splice(currentPageNo.value, 1);
  handleChange(props.modelValue.components); // Check current page number
}
</script>
