<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div v-if="readonlyDefault">
    <AppLabel :label="label" />
    {{ modelValue.default }}
  </div>
  <AppInput v-else :label="label" v-bind="$attrs" />
  <div v-for="locale in locales" :key="locale" class="mt-1.5">
    <AppInput
      v-model="modelValue[locale]"
      :label="`${label} (${locale})`"
      v-bind="$attrs"
    />
  </div>
</template>
<script lang="ts" setup>
import AppInput from '@components/forms/AppInput.vue';
import AppLabel from '@components/forms/AppLabel.vue';
import { useLocaleInput, type LocaleInputProps } from './use-locale-input';

// Must be defined so the event handler isn't in $attrs
defineEmits(['update:modelValue']);
defineOptions({ inheritAttrs: false });
const props = defineProps<LocaleInputProps>();

useLocaleInput(props);
</script>
