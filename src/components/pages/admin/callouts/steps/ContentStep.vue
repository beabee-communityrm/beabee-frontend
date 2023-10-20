<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <AppNotification
      v-if="warnAboutEditing"
      variant="warning"
      class="mb-4"
      :title="t('editCallout.warning')"
    />

    <AppNotification
      v-if="wasJustReplicated"
      variant="success"
      class="mb-4"
      :title="t('editCallout.replicated')"
    />

    <div class="flex gap-8 mt-8">
      <div class="flex-0 basis-menu">
        <Draggable v-model="slides" item-key="id">
          <template #item="{ element, index }">
            <div
              class="mb-4 flex gap-2 rounded p-4"
              :class="
                currentSlideNo === index
                  ? 'bg-white'
                  : 'cursor-pointer bg-primary-10'
              "
              @click="currentSlideNo = index"
            >
              <div>
                <font-awesome-icon
                  :icon="faGripVertical"
                  class="cursor-grab text-body-60 hover:text-body"
                />
              </div>
              <div class="flex-1">
                <p class="font-semibold">
                  {{ index + 1 }}: {{ element.title }}
                </p>
                <p v-if="element.navigation.nextSlideId" class="mt-1 text-xs">
                  ↳
                  {{ getNextSlideLabel(element.navigation.nextSlideId) }}
                </p>
              </div>
            </div>
          </template>
        </Draggable>

        <AppButton
          variant="primary"
          :icon="faPlus"
          class="w-full"
          @click="handleAddSlide"
        >
          {{ t('calloutBuilder.actions.addSlide') }}
        </AppButton>
      </div>

      <div class="flex-1 callout-slide-builder">
        <!-- These styles replicate the FormBuilder layout -->
        <div class="flex gap-8 items-end mb-4">
          <div class="flex-1 max-w-2xl flex gap-4 justify-between items-end">
            <div>
              <AppInput
                v-model="slides[currentSlideNo].title"
                :label="t('calloutBuilder.internalTitle')"
                required
              />
            </div>
            <AppButtonGroup>
              <AppButton
                variant="primaryOutlined"
                :icon="faChevronLeft"
                :disabled="isFirstSlide"
                @click="currentSlideNo--"
              />
              <AppButton
                variant="primaryOutlined"
                :icon="faChevronRight"
                :disabled="isLastSlide"
                @click="currentSlideNo++"
              />
            </AppButtonGroup>
          </div>
          <div class="flex-0 basis-[15rem]">
            <AppCheckbox
              v-if="env.experimentalFeatures"
              v-model="showAdvancedOptions"
              :label="t('calloutBuilder.showAdvancedOptions')"
            />
          </div>
        </div>

        <FormBuilder
          :key="currentSlideNo /* FormBuilder isn't reactive */"
          v-model="slides[currentSlideNo].components"
          :advanced="showAdvancedOptions"
          :slides="slides"
        />

        <!-- These styles replicate the FormBuilder layout -->
        <div class="flex gap-8">
          <div class="flex-1 max-w-2xl">
            <div class="bg-white p-6 pt-0 shadow-md relative -mt-6 mb-4">
              <FormBuilderNavigation
                v-model="slides[currentSlideNo].navigation"
                :slides="slides"
                :current-slide-no="currentSlideNo"
                :is-first="isFirstSlide"
                :is-last="isLastSlide"
              />
            </div>
            <div class="text-right">
              <AppButton
                variant="dangerOutlined"
                :icon="faTrash"
                :disabled="totalSlides === 1"
                @click="handleRemoveSlide"
              >
                {{ t('calloutBuilder.actions.removeSlide') }}
              </AppButton>
            </div>
          </div>
          <div class="flex-0 basis-[15rem]" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ItemStatus } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { ref, watch } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ContentStepProps } from '../callouts.interface';
import AppNotification from '../../../../AppNotification.vue';
import FormBuilder from '../../../../form-builder/FormBuilder.vue';
import {
  faChevronLeft,
  faChevronRight,
  faGripVertical,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { getSlideSchema } from '../../../../../utils/callouts';
import AppButton from '../../../../button/AppButton.vue';
import AppInput from '../../../../forms/AppInput.vue';
import AppButtonGroup from '../../../../button/AppButtonGroup.vue';
import FormBuilderNavigation from '../../../../form-builder/FormBuilderNavigation.vue';
import AppCheckbox from '../../../../forms/AppCheckbox.vue';
import env from '../../../../../env';
import Draggable from 'vuedraggable';
import { useRoute } from 'vue-router';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  data: ContentStepProps;
  status: ItemStatus | undefined;
}>();

const { t } = useI18n();

const wasJustReplicated = useRoute().query.replicated !== undefined;

const currentSlideNo = ref(0);
const showAdvancedOptions = ref(false);

const slides = computed(() => props.data.formSchema.slides);

const totalSlides = computed(() => slides.value.length);
const isFirstSlide = computed(() => currentSlideNo.value === 0);
const isLastSlide = computed(
  () => currentSlideNo.value === totalSlides.value - 1
);

const warnAboutEditing = computed(
  () => props.status === ItemStatus.Open || props.status === ItemStatus.Ended
);

const validation = useVuelidate();

function getNextSlideLabel(nextSlideId: string) {
  const nextSlideNo = slides.value.findIndex((s) => s.id === nextSlideId);
  const nextSlide = slides.value[nextSlideNo];

  return nextSlide ? `${nextSlideNo + 1}: ${nextSlide.title}` : '???';
}

function handleAddSlide() {
  slides.value.push(getSlideSchema(totalSlides.value + 1));
  currentSlideNo.value = slides.value.length - 1;
}

function handleRemoveSlide() {
  slides.value.splice(currentSlideNo.value, 1);
  currentSlideNo.value = Math.max(0, currentSlideNo.value - 1);
}

watch(
  [validation, slides],
  () => {
    emit('update:error', validation.value.$errors.length > 0);
    emit(
      'update:validated',
      !validation.value.$invalid &&
        slides.value.every(
          (s, i) =>
            s.title &&
            s.components.length > 0 &&
            (i < totalSlides.value - 1
              ? s.navigation.nextText
              : s.navigation.submitText)
        )
    );
  },
  { immediate: true }
);
</script>
<style lang="postcss">
/* Allows the navigation to appear seamlessly part of the form area */
.callout-slide-builder {
  @apply min-h-[35rem];

  .callout-form-builder .formcomponents {
    @apply h-0;
  }
}
</style>
