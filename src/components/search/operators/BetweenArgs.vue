<!-- eslint-disable vue/no-mutating-props -->
<template>
  <ArgInput v-model="values[0]" v-bind="$props" />
  {{ t('advancedSearch.matchWord.all') }}
  <ArgInput v-model="values[1]" v-bind="$props" />
</template>
<script lang="ts" setup>
import { FilterArgs, FilterValue } from '@beabee/beabee-common';
import { useI18n } from 'vue-i18n';
import { FilterItem } from '../search.interface';
import ArgInput from './ArgInput.vue';
const { t } = useI18n();
defineProps<{
  values: FilterValue[];
  args: FilterArgs;
  item: FilterItem;
  readonly: boolean;
}>();
</script>
