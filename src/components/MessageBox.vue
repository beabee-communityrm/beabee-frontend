<template>
  <div class="flex overflow-hidden rounded">
    <div
      class="flex w-12 flex-shrink-0 items-center justify-center text-white"
      :class="iconClasses[type]"
    >
      <font-awesome-icon :icon="['fas', icon]" />
    </div>

    <div
      class="flex flex-grow items-center p-3 text-xs font-semibold"
      :class="contentClasses[type]"
    >
      <slot>{{ t('form.errors.aggregator') }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    type?: 'success' | 'warning' | 'error';
  }>(),
  { type: 'error' }
);

const icon = computed(() =>
  props.type === 'success' ? 'check' : 'exclamation'
);

const iconClasses = {
  success: 'bg-success-30',
  warning: 'bg-warning-70',
  error: 'bg-danger-30',
};

const contentClasses = {
  success: 'bg-success-10 text-success',
  warning: 'bg-warning-10 text-primary-80',
  error: 'bg-danger-10 text-danger',
};
</script>
