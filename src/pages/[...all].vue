<route lang="yaml">
meta:
  layout: Auth
  pageTitle: pageTitle.notFound
</route>

<template>
  <AuthBox>
    <h1 class="mb-6 font-title text-3xl font-extrabold md:text-5xl">
      {{ t('pageTitle.notFound') }}
    </h1>

    <i18n-t keypath="notFound.text" class="mb-4" tag="p">
      <template #support>
        <a
          class="text-link underline"
          :href="'mailto:' + generalContent.supportEmail"
        >
          {{ generalContent.supportEmail }}
        </a>
      </template>
    </i18n-t>

    <AppButton class="w-full" to="/profile">
      {{ t('notFound.goBack') }}
    </AppButton>
  </AuthBox>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import AuthBox from '../components/AuthBox.vue';
import AppButton from '../components/forms/AppButton.vue';
import { generalContent } from '../store';
generalContent;

const { t } = useI18n();
</script>
