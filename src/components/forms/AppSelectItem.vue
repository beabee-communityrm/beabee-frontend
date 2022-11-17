<template>
  <option
    :key="item.id"
    :value="item.id"
    :selected="selected"
    :disabled="item.id === ''"
  >
    {{ item.label + (item.count ? ' (' + item.count + ')' : '') }}
  </option>
</template>
<script lang="ts" setup>
import { SelectItem } from './form.interface';

defineProps<{ item: SelectItem; selected: boolean }>();
</script>
