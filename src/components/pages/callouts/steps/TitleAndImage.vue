<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <div class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppInput
          v-model="data.title"
          :label="inputT('title.label')"
          :placeholder="inputT('title.placeholder')"
          required
        />
      </div>
      <div
        class="col-span-1 mt-6 text-sm text-grey"
        v-html="inputT('title.help')"
      />
    </div>
    <div class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppTextArea
          v-model="data.description"
          :label="inputT('description.label')"
          :placeholder="inputT('description.placeholder')"
          required
        />
      </div>
      <div
        class="col-span-1 mt-6 text-sm text-grey"
        v-html="inputT('description.help')"
      />
    </div>
    <div class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppImageUpload
          v-model="data.coverImageURL"
          :label="inputT('image.label')"
          :width="1440"
          :height="900"
          required
        />
      </div>
      <div
        class="col-span-1 mt-6 text-sm text-grey"
        v-html="inputT('image.help')"
      />
    </div>
    <div v-if="mode === 'new'" class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppRadioGroup
          v-model="data.useCustomSlug"
          name="useCustomSlug"
          :label="inputT('slug.label')"
          :options="[
            [false, inputT('slug.opts.auto')],
            [true, inputT('slug.opts.manual')],
          ]"
          required
        />
        <AppInput v-if="data.useCustomSlug" v-model="customSlug" required />
        <p class="mt-2 text-sm">
          {{ t('createCallout.steps.titleAndImage.urlWillBe') }}
          {{ env.appUrl }}/callouts/{{ slug || '???' }}
        </p>
      </div>
      <div
        class="col-span-1 mt-6 text-sm text-grey"
        v-html="inputT('slug.help')"
      />
    </div>
    <div class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppRadioGroup
          v-model="data.overrideShare"
          name="overrideShare"
          :label="inputT('overrideShare.label')"
          :options="[
            [false, inputT('overrideShare.opts.yes')],
            [true, inputT('overrideShare.opts.no')],
          ]"
          required
        />
      </div>
      <div class="col-span-1 mt-6 text-sm text-grey" />
    </div>
    <div v-if="data.overrideShare" class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppInput
          v-model="data.shareTitle"
          :label="inputT('shareTitle.label')"
          :placeholder="inputT('shareTitle.placeholder')"
          required
        />
      </div>
      <div
        class="col-span-1 mt-6 text-sm text-grey"
        v-html="inputT('shareTitle.help')"
      />
    </div>
    <div v-if="data.overrideShare" class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppTextArea
          v-model="data.shareDescription"
          :label="inputT('shareDescription.label')"
          :placeholder="inputT('shareDescription.placeholder')"
          required
        />
      </div>
      <div
        class="col-span-1 mt-6 text-sm text-grey"
        v-html="inputT('shareDescription.help')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../forms/AppInput.vue';
import AppImageUpload from '../../../forms/AppImageUpload.vue';
import AppTextArea from '../../../forms/AppTextArea.vue';
import useVuelidate from '@vuelidate/core';
import { TitleAndImageStepProps } from '../callouts.interface';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import env from '../../../../env';
import slugify from 'slugify';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  data: TitleAndImageStepProps;
  mode: 'edit' | 'new';
}>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.titleAndImage.inputs.' + key);

const slug = computed(() =>
  props.data.useCustomSlug ? props.data.slug : props.data.autoSlug
);

const customSlug = computed({
  get: () => props.data.slug,
  // eslint-disable-next-line vue/no-mutating-props
  set: (newSlug) => (props.data.slug = slugify(newSlug)),
});

// TODO: FIXME should just be a computed
watch(
  () => props.data.title,
  (title) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.data.autoSlug = slugify(title, { lower: true });
  }
);

const validation = useVuelidate();

watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});
</script>
