<!-- eslint-disable vue/no-mutating-props -->
<template>
  <AppTextArea
    v-model="props.modelValue.default"
    :label="label"
    v-bind="$attrs"
  />
  <div v-for="locale in props.locales" :key="locale" class="mt-2">
    <AppTextArea
      v-model="props.modelValue[locale]"
      :label="`${props.label} (${locale})`"
      v-bind="$attrs"
    />
  </div>
</template>
<script lang="ts" setup>
import { type LocaleInputProps, useLocaleInput } from './use-locale-input';

import AppTextArea from '@components/forms/AppTextArea.vue';

// Must be defined so the event handler isn't in $attrs
defineEmits(['update:modelValue']);
defineOptions({ inheritAttrs: false });
const props = defineProps<LocaleInputProps>();

useLocaleInput(props);
</script>
