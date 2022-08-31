<route lang="yaml">
name: profileContributionCancel
meta:
  pageTitle: menu.contribution
</route>

<template>
  <PageTitle :title="t('menu.contribution')" />

  <h3 class="text-2xl font-semibold text-body mb-4">
    {{ t('contribution.cancelMessage') }}
  </h3>

  <div class="flex">
    <AppButton to="/profile/contribution" variant="primaryOutlined">{{
      t('common.goBack')
    }}</AppButton>

    <AppButton
      class="ml-4"
      to="/profile/contribution"
      variant="danger"
      :loading="loading"
      @click="submit"
      >{{ t('contribution.cancelContribution') }}</AppButton
    >
  </div>
</template>

<script lang="ts" setup>
import PageTitle from '../../../components/PageTitle.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { cancelContribution } from '../../../utils/api/member';
import { useRouter } from 'vue-router';

const { t } = useI18n();

const loading = ref(false);
async function submit() {
  loading.value = true;
  try {
    await cancelContribution();
    useRouter().push('/profile/contribution');
  } finally {
    loading.value = false;
  }
}
</script>
