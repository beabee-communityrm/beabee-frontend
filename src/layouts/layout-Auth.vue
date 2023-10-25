<template>
  <main
    :class="
      !isEmbed && 'min-h-screen bg-cover bg-fixed bg-center py-4 px-2 xs:px-4'
    "
    :style="isEmbed ? undefined : backgroundStyle"
  >
    <div class="mb-4">
      <AppButton :href="generalContent.siteUrl" size="sm">
        ←
        {{
          t('login.backTo', { newsroomName: generalContent.organisationName })
        }}
      </AppButton>
    </div>

    <router-view />
  </main>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { generalContent, isEmbed } from '../store';
import { backgroundStyle } from '../store';
import AppButton from '../components/button/AppButton.vue';

const { t } = useI18n();
</script>
