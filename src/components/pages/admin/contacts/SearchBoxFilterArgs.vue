<template>
  <AppInput
    v-for="(arg, i) in args"
    v-model="values[i]"
    :key="i"
    :type="arg.type"
  />
</template>
<script lang="ts" setup>
import { OperatorId, OperatorValue, operators } from './contacts.interface';
import AppInput from '../../../forms/AppInput.vue';
import { computed } from 'vue';

const props = defineProps<{
  operator: OperatorId;
  values: OperatorValue[];
}>();

const args = computed(() => operators[props.operator].args);
</script>
