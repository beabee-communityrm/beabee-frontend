<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <RichTextEditor
      v-model="modelValue.default"
      :label="label"
      v-bind="$attrs"
    />
    <RichTextEditor
      v-for="locale in locales"
      :key="locale"
      v-model="modelValue[locale]"
      :label="`${label} (${locale})`"
      v-bind="$attrs"
      class="mt-1.5"
    />
  </div>
</template>
<script lang="ts" setup>
import RichTextEditor from '@components/rte/RichTextEditor.vue';
import { useLocaleInput, type LocaleInputProps } from './use-locale-input';

// Must be defined so the event handler isn't in $attrs
defineEmits(['update:modelValue']);
defineOptions({ inheritAttrs: false });
const props = defineProps<LocaleInputProps>();

useLocaleInput(props);
</script>
