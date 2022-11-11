<!-- eslint-disable vue/no-mutating-props -->
<template>
  <ArgInput v-model="value[0]" :item="item" :readonly="readonly" />
  {{ t('advancedSearch.matchWord.all') }}
  <ArgInput v-model="value[1]" :item="item" :readonly="readonly" />
</template>
<script lang="ts" setup>
import { RuleValue } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import { FilterItem } from '../search.interface';
import ArgInput from './ArgInput.vue';
const { t } = useI18n();
defineProps<{ value: RuleValue[]; item: FilterItem; readonly: boolean }>();
</script>
