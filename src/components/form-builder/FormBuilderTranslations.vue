<template>
  <AppSubHeading>Translations</AppSubHeading>
  <div v-for="translation in translations" :key="translation">
    {{ translation }}
  </div>
</template>
<script lang="ts" setup>
import type { CalloutComponentSchema } from '@beabee/beabee-common';
import type { LocaleProp } from './form-builder.interface';
import { computed } from 'vue';

import AppSubHeading from '@components/AppSubHeading.vue';

const props = defineProps<{
  modelValue: Record<string, LocaleProp>;
  components: CalloutComponentSchema[];
  locales: string[];
}>();

const translations = computed(() =>
  props.components
    .flatMap((component) => [
      component.label,
      component.description,
      component.placeholder,
      ...(component.type === 'radio' || component.type === 'selectboxes'
        ? component.values.map((v) => v.label)
        : []),
      ...(component.type === 'select'
        ? component.data.values.map((v) => v.label)
        : []),
    ])
    .filter((s): s is string => !!s)
);
</script>
