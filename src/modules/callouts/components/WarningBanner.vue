<template>
  <AppAlert v-if="true" variant="warning" class="mb-8">
    <template #icon>
      <font-awesome-icon :icon="['fa', 'exclamation']" />
    </template>

    {{ t('editCallout.warning') }}
  </AppAlert>
</template>

<script lang="ts" setup>
import AppAlert from '../../../components/AppAlert.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>
