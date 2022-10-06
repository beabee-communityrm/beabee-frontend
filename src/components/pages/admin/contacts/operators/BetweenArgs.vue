<!-- eslint-disable vue/no-mutating-props -->
<template>
  <ArgInput v-model="values[0]" :args="args" :readonly="readonly" />
  {{ t('advancedSearch.matchWord.all') }}
  <ArgInput v-model="values[1]" :args="args" :readonly="readonly" />
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { FilterArgs, FilterValue } from '../contacts.interface';
import ArgInput from './ArgInput.vue';
const { t } = useI18n();
defineProps<{ values: FilterValue[]; args: FilterArgs; readonly: boolean }>();
</script>
