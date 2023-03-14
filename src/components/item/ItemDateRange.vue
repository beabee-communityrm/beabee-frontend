<template>
  <p v-if="item.starts">
    <font-awesome-icon :icon="['far', 'calendar']" class="mr-2" />
    {{ formatLocale(item.starts, 'PP') + ' - ' }}
    {{ item.expires && formatLocale(item.expires, 'PP') }}
  </p>
</template>

<script lang="ts" setup>
import { ItemWithStatus } from '../../utils/api/api.interface';
import { formatLocale } from '../../utils/dates/locale-date-formats';

defineProps<{ item: ItemWithStatus; inline?: boolean }>();
</script>
