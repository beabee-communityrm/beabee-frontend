<template>
  <RichTextEditor v-model="data" :label="label" v-bind="$attrs" />
  <RichTextEditor
    v-for="locale in locales"
    :key="locale"
    v-model="data"
    :label="`${label} (${locale})`"
    v-bind="$attrs"
    class="mt-2"
  />
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import RichTextEditor from '@components/rte/RichTextEditor.vue';

defineOptions({ inheritAttrs: false });
defineProps<{ label: string; locales: string[] }>();

const data = ref('');
</script>
