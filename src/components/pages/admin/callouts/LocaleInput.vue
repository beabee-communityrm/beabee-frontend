<template>
  <AppInput v-model="data" :label="label" v-bind="$attrs" />
  <div v-for="locale in locales" :key="locale" class="mt-2">
    <AppInput :label="`${label} (${locale})`" v-bind="$attrs" />
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import AppInput from '@components/forms/AppInput.vue';

defineOptions({ inheritAttrs: false });
defineProps<{ label: string; locales: string[] }>();

const data = ref('');
</script>
