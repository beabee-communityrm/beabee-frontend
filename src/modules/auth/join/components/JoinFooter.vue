<template>
  <p class="text-center text-xs">
    {{ t('join.notice') }}
    <a
      class="text-link hover:text-primary underline"
      :href="privacyLink"
      target="_blank"
      rel="noreferrer"
      >{{ t('join.privacy') }}</a
    >.
  </p>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps({
  privacyLink: {
    type: String,
    default: '',
  },
});
</script>
