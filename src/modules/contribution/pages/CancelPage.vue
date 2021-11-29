<template>
  <div class="mb-5">
    <PageTitle :title="t('menu.contribution')" />
  </div>

  <h3 class="text-2xl font-semibold text-body mb-4">
    {{ t('contribution.cancelMessage') }}
  </h3>

  <div class="flex">
    <AppButton to="/profile/contribution" variant="subtle">{{
      t('common.goBack')
    }}</AppButton>

    <AppButton
      class="ml-4"
      to="/profile/contribution"
      variant="danger"
      :loading="cancelContributionLoading"
      @click="submitCancelContribution"
      >{{ t('contribution.cancelContribution') }}</AppButton
    >
  </div>
</template>

<script lang="ts" setup>
import PageTitle from '../../../components/PageTitle.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { useI18n } from 'vue-i18n';
import { useContribution } from '../use-contribution';

const { submitCancelContribution, cancelContributionLoading } =
  useContribution();
const { t } = useI18n();
</script>
