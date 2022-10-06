<!-- eslint-disable vue/no-mutating-props -->
<template>
  <ArgInput v-model="values[0]" :args="args" :readonly="readonly" />
</template>
<script lang="ts" setup>
import { FilterArgs, FilterValue } from '../contacts.interface';
import ArgInput from './ArgInput.vue';
defineProps<{ values: FilterValue[]; args: FilterArgs; readonly: boolean }>();
</script>
