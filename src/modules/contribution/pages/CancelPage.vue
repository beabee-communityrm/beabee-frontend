<template>
  <div class="mb-5">
    <PageTitle :title="t('menu.contribution')" />
  </div>

  <h3 class="text-2xl font-semibold text-body mb-4">
    {{ t('contribution.cancelMessage') }}
  </h3>

  <MessageBox v-if="isContactPage" type="warning" class="mb-4">
    {{ t('form.warning') }}
  </MessageBox>

  <AppButton :to="goBackRoute" variant="subtle">{{
    t('common.goBack')
  }}</AppButton>

  <AppButton
    class="ml-4"
    variant="danger"
    :loading="cancelContributionLoading"
    @click="submitCancelContribution(router, id)"
    >{{ t('contribution.cancelContribution') }}</AppButton
  >
</template>

<script lang="ts" setup>
import PageTitle from '../../../components/PageTitle.vue';
import MessageBox from '../../../components/MessageBox.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { useI18n } from 'vue-i18n';
import { useContribution } from '../use-contribution';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();

const id = useRoute().params.id as string;
const goBackRoute = id
  ? `/contacts/${id}/contribution`
  : '/profile/contribution';

const { submitCancelContribution, cancelContributionLoading, isContactPage } =
  useContribution();
const { t } = useI18n();
</script>
