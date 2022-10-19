<!-- eslint-disable vue/no-mutating-props -->
<template>
  <ArgInput v-model="values[0]" v-bind="$props" />
</template>
<script lang="ts" setup>
import { FilterValue, FilterArgs } from '@beabee/beabee-common';
import { FilterItem } from '../search.interface';
import ArgInput from './ArgInput.vue';
defineProps<{
  values: FilterValue[];
  args: FilterArgs;
  item: FilterItem;
  readonly: boolean;
}>();
</script>
