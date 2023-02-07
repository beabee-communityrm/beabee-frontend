<route lang="yaml">
name: profileAccount
meta:
  pageTitle: accountPage.title
</route>

<template>
  <PageTitle
    :title="t('accountPage.title')"
    :sub-title="t('accountPage.subTitle')"
  />

  <div class="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
    <div>
      <ChangePassword />
      <Suspense>
        <ContactUpdateAccount id="me" />
      </Suspense>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PageTitle from '../../components/PageTitle.vue';
import { useI18n } from 'vue-i18n';
import ChangePassword from '../../components/pages/profile/account/ChangePassword.vue';
import ContactUpdateAccount from '../../components/contact/ContactUpdateAccount.vue';

const { t } = useI18n();
</script>
