<template>
  <p class="mb-2 text-center text-xs">
    {{ t('join.notice') }}
    <a
      class="text-link underline hover:text-primary"
      :href="privacyLink"
      target="_blank"
      rel="noreferrer"
      >{{ t('join.privacy') }}</a
    >.
  </p>
  <p class="text-center text-xs">
    <a href="https://beabee.io" target="_blank">
      <img class="inline" :src="beabeeLogo" width="30" />
      {{ t('join.poweredBy') }}
    </a>
  </p>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import beabeeLogo from '../../../assets/images/beabee-logo.png';

const { t } = useI18n();

defineProps({
  privacyLink: {
    type: String,
    default: '',
  },
});
</script>
