<template>
  <div v-for="(arg, i) in filter.operator.args" :key="i">
    <AppInput v-model="filter.values[i]" :type="arg.type" required />
  </div>
</template>
<script lang="ts" setup>
import { Filter } from './contacts.interface';
import AppInput from '../../../forms/AppInput.vue';

defineProps<{ filter: Filter }>();
</script>
