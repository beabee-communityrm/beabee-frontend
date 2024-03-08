<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div v-if="readonlyDefault">
    <AppLabel :label="label" />
    {{ modelValue.default }}
  </div>
  <AppTextArea
    v-else
    v-model="modelValue.default"
    :label="label"
    v-bind="$attrs"
  />
  <div v-for="locale in locales" :key="locale" class="mt-1.5">
    <AppTextArea
      v-model="modelValue[locale]"
      :label="`${label} (${locale})`"
      v-bind="$attrs"
    />
  </div>
</template>
<script lang="ts" setup>
import { type LocaleInputProps, useLocaleInput } from './use-locale-input';

import AppLabel from '@components/forms/AppLabel.vue';
import AppTextArea from '@components/forms/AppTextArea.vue';

// Must be defined so the event handler isn't in $attrs
defineEmits(['update:modelValue']);
defineOptions({ inheritAttrs: false });
const props = defineProps<LocaleInputProps>();

useLocaleInput(props);
</script>
