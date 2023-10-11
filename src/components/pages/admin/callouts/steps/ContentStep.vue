<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <AppNotification
      v-if="wasJustReplicated"
      variant="success"
      class="mb-4"
      :title="t('editCallout.replicated')"
    />
    <AppNotification
      v-if="warnAboutEditing"
      variant="warning"
      class="mb-4"
      :title="t('editCallout.warning')"
    />

    <AppFormSection :help="inputT('intro.help')">
      <RichTextEditor
        v-model="data.introText"
        :label="inputT('intro.label')"
        required
      />
    </AppFormSection>

    <div class="flex gap-8 mt-8">
      <ul class="flex-0 basis-menu">
        <li
          v-for="(slide, slideNo) in data.formSchema.slides"
          :key="slide.id"
          class="mb-4 flex gap-2 rounded p-4"
          :class="
            currentSlideNo === slideNo
              ? 'bg-white'
              : 'cursor-pointer bg-primary-10 hover:bg-white'
          "
          @click="currentSlideNo = slideNo"
        >
          <div>
            <font-awesome-icon
              :icon="faGripVertical"
              class="cursor-grab text-body-60 hover:text-body"
            />
          </div>
          <div class="flex-1">
            <p class="font-semibold">{{ slide.title }}</p>
            <p v-if="slide.navigation.nextSlideId" class="mt-1 text-xs">
              ↳
              {{
                data.formSchema.slides.find(
                  (s) => s.id === slide.navigation.nextSlideId
                )?.title ?? '???'
              }}
            </p>
          </div>
        </li>

        <AppButton
          variant="primary"
          :icon="faPlus"
          class="w-full"
          @click="handleAddSlide"
        >
          {{ t('calloutBuilder.actions.addSlide') }}
        </AppButton>
      </ul>
      <div class="flex-1 callout-slide-builder">
        <div class="max-w-2xl mb-4 flex gap-4 justify-between items-end">
          <div>
            <AppInput
              v-model="data.formSchema.slides[currentSlideNo].title"
              :label="t('calloutBuilder.internalTitle')"
              required
            />
          </div>
          <AppButtonGroup>
            <AppButton
              variant="primaryOutlined"
              :icon="faChevronLeft"
              :disabled="currentSlideNo === 0"
              @click="currentSlideNo--"
            />
            <AppButton
              variant="primaryOutlined"
              :icon="faChevronRight"
              :disabled="currentSlideNo === data.formSchema.slides.length - 1"
              @click="currentSlideNo++"
            />
          </AppButtonGroup>
        </div>
        <FormBuilder
          :key="currentSlideNo /* FormBuilder isn't reactive */"
          :components="data.formSchema.slides[currentSlideNo].components"
          @change="handleFormChange"
        />
        <div class="max-w-2xl">
          <div class="bg-white p-6 pt-0 shadow-md relative -mt-6 mb-4">
            here
          </div>
          <div class="text-right">
            <AppButton
              variant="dangerOutlined"
              :icon="faTrash"
              :disabled="data.formSchema.slides.length === 1"
              @click="handleRemoveSlide"
            >
              {{ t('calloutBuilder.actions.removeSlide') }}
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { CalloutComponentSchema, ItemStatus } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { ref, watch } from 'vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { ContentStepProps } from '../callouts.interface';
import RichTextEditor from '../../../../rte/RichTextEditor.vue';
import AppFormSection from '../../../../forms/AppFormSection.vue';
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

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  data: ContentStepProps;
  status: ItemStatus | undefined;
}>();

const { t } = useI18n();
const route = useRoute();
const inputT = (key: string) => t('createCallout.steps.content.inputs.' + key);

const currentSlideNo = ref(0);

const warnAboutEditing = computed(
  () => props.status === ItemStatus.Open || props.status === ItemStatus.Ended
);

const wasJustReplicated = route.query.replicated !== undefined;

const validation = useVuelidate();

function handleAddSlide() {
  // eslint-disable-next-line vue/no-mutating-props
  props.data.formSchema.slides.push(getSlideSchema());
}

function handleRemoveSlide() {
  // eslint-disable-next-line vue/no-mutating-props
  props.data.formSchema.slides.splice(currentSlideNo.value, 1);
  currentSlideNo.value = Math.max(0, currentSlideNo.value - 1);
}

function handleFormChange(components: CalloutComponentSchema[]) {
  // eslint-disable-next-line vue/no-mutating-props
  props.data.formSchema.slides[0].components = components;
}

watch(
  [validation, props.data.formSchema],
  () => {
    emit('update:error', validation.value.$errors.length > 0);
    emit(
      'update:validated',
      !validation.value.$invalid &&
        props.data.formSchema.slides.every(
          (s) => s.title && s.components.length > 1
        )
    );
  },
  { immediate: true }
);
</script>
<style>
/* Allows the navigation to appear seamlessly part of the form area */
.callout-slide-builder {
  @apply min-h-[35rem];

  .callout-form-builder .formcomponents {
    @apply h-0;
  }
}
</style>
