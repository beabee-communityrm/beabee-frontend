<template>
  <div class="flex rounded text-danger">
    <div class="flex items-center justify-center w-12 text-white bg-danger-30">
      <font-awesome-icon :icon="['fas', 'exclamation']" />
    </div>

    <div class="flex-grow p-2 text-xs bg-danger-10">
      {{ t('form.errors.aggregator') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
