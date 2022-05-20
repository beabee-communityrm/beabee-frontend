<template>
  <div>
    <div class="grid grid-cols-2 gap-6" v-if="mode === 'new'">
      <div class="col-span-1">
        <AppRadioGroup
          v-model="dataProxy.useCustomSlug"
          name="useCustomSlug"
          :label="inputT('slug.label')"
          :options="[
            [false, inputT('slug.opts.auto')],
            [true, inputT('slug.opts.manual')],
          ]"
        />
        <AppInput
          v-if="dataProxy.useCustomSlug"
          v-model="dataProxy.slug"
          required
          :error-message="validation.slug.$errors[0]?.$message"
          @blur="validation.slug.$touch"
        />
        <p class="mt-2 text-sm">
          {{ t('createCallout.steps.url.URLWillBe') }} {{ baseUrl }}/callouts/{{
            slug || '???'
          }}
        </p>
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('slug.help')"
      />
    </div>
    <div class="grid grid-cols-2 gap-6 mt-6">
      <div class="col-span-1">
        <AppRadioGroup
          v-model="dataProxy.overrideShare"
          name="overrideShare"
          :label="inputT('overrideShare.label')"
          :options="[
            [false, inputT('overrideShare.opts.yes')],
            [true, inputT('overrideShare.opts.no')],
          ]"
        />
      </div>
      <div class="col-span-1 text-sm text-grey mt-6" />
    </div>
    <div v-if="dataProxy.overrideShare" class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1">
        <AppInput
          v-model="dataProxy.shareTitle"
          :label="inputT('title.label')"
          :placeholder="inputT('title.placeholder')"
          required
          :error-message="validation.shareTitle.$errors[0]?.$message"
          @blur="validation.shareTitle.$touch"
        />
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('title.help')"
      />
    </div>
    <div v-if="dataProxy.overrideShare" class="grid grid-cols-2 gap-6 mt-5">
      <div class="col-span-1">
        <AppTextArea
          v-model="dataProxy.shareDescription"
          :label="inputT('description.label')"
          :placeholder="inputT('description.placeholder')"
          required
          :error-message="validation.shareDescription.$errors[0]?.$message"
          @blur="validation.shareDescription.$touch"
        ></AppTextArea>
      </div>
      <div
        class="col-span-1 text-sm text-grey mt-6"
        v-html="inputT('description.help')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import useVuelidate from '@vuelidate/core';
import { requiredIf } from '@vuelidate/validators';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../../components/forms/AppInput.vue';
import AppRadioGroup from '../../../../components/forms/AppRadioGroup.vue';
import AppTextArea from '../../../../components/forms/AppTextArea.vue';
import { UrlAndSharingStepProps } from '../../create-callout.interface';

const emit = defineEmits(['update:data', 'update:validated']);
const props =
  defineProps<{ data: UrlAndSharingStepProps; mode: 'edit' | 'new' }>();

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.url.inputs.' + key);

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const dataProxy = ref(props.data);

const slug = computed(() =>
  dataProxy.value.useCustomSlug
    ? dataProxy.value.slug
    : dataProxy.value.autoSlug
);

const rules = computed(() => ({
  slug: { required: requiredIf(dataProxy.value.useCustomSlug) },
  shareTitle: { required: requiredIf(dataProxy.value.overrideShare) },
  shareDescription: { required: requiredIf(dataProxy.value.overrideShare) },
}));

const validation = useVuelidate(rules, dataProxy);

watch(validation, () => emit('update:validated', !validation.value.$invalid), {
  immediate: true,
});
</script>
