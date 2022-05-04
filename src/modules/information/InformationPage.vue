<template>
  <PageTitle
    :title="t('informationPage.title')"
    :sub-title="t('informationPage.subTitle')"
  />

  <div class="grid lg:grid-cols-2 xl:grid-cols-3">
    <div>
      <ChangePassword />
      <UpdateContactInformation />
    </div>
  </div>
</template>

<script lang="ts" setup>
import PageTitle from '../../components/PageTitle.vue';
import { useI18n } from 'vue-i18n';
import ChangePassword from './components/ChangePassword.vue';
import UpdateContactInformation from './components/UpdateContactInformation.vue';

const { t } = useI18n();
</script>
