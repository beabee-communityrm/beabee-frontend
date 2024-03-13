<template>
  <div
    v-for="component in components"
    :key="component.id"
    class="mb-8 border-t border-t-primary-20 pt-6"
  >
    <h3 class="mb-2 font-title text-xl font-semibold">
      {{ component.label }}
    </h3>
    <div v-for="[field, fcomp] in fields" :key="field" class="mb-4">
      <component
        :is="fcomp"
        v-if="component[field]"
        :model-value="getValue(component[field])"
        :label="field"
        :locales="locales"
        readonly-default
        required
        @update:model-value="setValue(component[field], $event)"
      />
    </div>
    <div
      v-for="(value, i) in getOptions(component)"
      :key="value.value"
      class="mb-4"
    >
      <LocaleInput
        :model-value="getValue(value.value)"
        :label="'Option ' + (i + 1)"
        :locales="locales"
        readonly-default
        required
        @update:model-value="setValue(value.value, $event)"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { CalloutComponentSchema } from '@beabee/beabee-common';

import LocaleTextArea from '@components/forms/LocaleTextArea.vue';
import LocaleInput from '@components/forms/LocaleInput.vue';
import type { LocaleProp } from '@type';

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, LocaleProp | undefined>): void;
}>();
const props = defineProps<{
  modelValue: Record<string, LocaleProp | undefined>;
  components: CalloutComponentSchema[];
  locales: string[];
}>();

const fields = [
  ['label', LocaleInput],
  ['description', LocaleTextArea],
  ['placeholder', LocaleInput],
] as const;

function getValue(ref: string | undefined = ''): LocaleProp {
  return props.modelValue[ref] || { default: ref };
}

function setValue(ref: string | undefined = '', val: LocaleProp) {
  emit('update:modelValue', { ...props.modelValue, [ref]: val });
}

function getOptions(
  component: CalloutComponentSchema
): { label: string; value: string }[] {
  if (component.type === 'radio' || component.type === 'selectboxes') {
    return component.values;
  } else if (component.type === 'select') {
    return component.data.values;
  } else {
    return [];
  }
}
</script>
