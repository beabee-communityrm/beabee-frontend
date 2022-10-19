<!-- eslint-disable vue/no-mutating-props -->
<template>
  <ArgInput v-model="values[0]" :item="item" :readonly="readonly" />
</template>
<script lang="ts" setup>
import { FilterValue } from '@beabee/beabee-common';
import { FilterItem } from '../search.interface';
import ArgInput from './ArgInput.vue';
defineProps<{ values: FilterValue[]; item: FilterItem; readonly: boolean }>();
</script>
