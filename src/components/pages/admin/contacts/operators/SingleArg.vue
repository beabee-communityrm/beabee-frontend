<!-- eslint-disable vue/no-mutating-props -->
<template>
  <ArgInput v-model="values[0]" :type="type" :readonly="readonly" />
</template>
<script lang="ts" setup>
import { FilterType, FilterValue } from '../contacts.interface';
import ArgInput from './ArgInput.vue';
defineProps<{ values: FilterValue[]; type: FilterType; readonly: boolean }>();
</script>
