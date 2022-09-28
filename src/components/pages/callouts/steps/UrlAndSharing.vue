<template>
  <div>
    <div v-if="mode === 'new'" class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppRadioGroup
          v-model="dataProxy.useCustomSlug"
          name="useCustomSlug"
          :label="inputT('slug.label')"
          :options="[
            [false, inputT('slug.opts.auto')],
            [true, inputT('slug.opts.manual')],
          ]"
          required
        />
        <AppInput
          v-if="dataProxy.useCustomSlug"
          v-model="customSlug"
          required
        />
        <p class="mt-2 text-sm">
          {{ t('createCallout.steps.url.URLWillBe') }} {{ baseUrl }}/callouts/{{
            slug || '???'
          }}
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
          v-model="dataProxy.overrideShare"
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
    <div v-if="dataProxy.overrideShare" class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppInput
          v-model="dataProxy.shareTitle"
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
    <div v-if="dataProxy.overrideShare" class="mt-5 grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppTextArea
          v-model="dataProxy.shareDescription"
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
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';
import slugify from 'slugify';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../forms/AppInput.vue';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import AppTextArea from '../../../forms/AppTextArea.vue';
import { UrlAndSharingStepProps } from '../callouts.interface';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  data: UrlAndSharingStepProps;
  mode: 'edit' | 'new';
}>();

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.url.inputs.' + key);

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const dataProxy = ref(props.data);

const slug = computed(() =>
  dataProxy.value.useCustomSlug
    ? dataProxy.value.slug
    : dataProxy.value.autoSlug
);

const customSlug = computed({
  get: () => dataProxy.value.slug,
  set: (newSlug) => (dataProxy.value.slug = slugify(newSlug)),
});

const validation = useVuelidate();

watch(
  validation,
  () => {
    emit('update:error', validation.value.$errors.length > 0);
    emit('update:validated', !validation.value.$invalid);
  },
  {
    immediate: true,
  }
);
</script>
