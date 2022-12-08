<route lang="yaml">
name: profileInformation
meta:
  pageTitle: informationPage.title
</route>

<template>
  <PageTitle
    :title="t('informationPage.title')"
    :sub-title="t('informationPage.subTitle')"
  />

  <div class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <div>
      <ChangePassword />
      <Suspense>
        <ContactUpdateInformation id="me" />
      </Suspense>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PageTitle from '../../components/PageTitle.vue';
import { useI18n } from 'vue-i18n';
import ChangePassword from '../../components/pages/profile/information/ChangePassword.vue';
import ContactUpdateInformation from '../../components/contact/ContactUpdateInformation.vue';

const { t } = useI18n();
</script>
