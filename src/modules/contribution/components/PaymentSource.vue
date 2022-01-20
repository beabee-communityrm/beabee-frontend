<template>
  <div>
    <div class="mb-4">
      <FontAwesomeIcon
        class="text-2xl -mb-1 mr-3"
        :icon="['far', 'credit-card']"
      />

      <span
        >{{ paymentSource.accountHolderName }}, {{ paymentSource.bankName }},
        ••••••••••{{ paymentSource.accountNumberEnding }}</span
      >
    </div>

    <MessageBox v-if="hasError" class="mb-4" type="error">
      {{ t('contribution.paymentSourceUpdateError') }}
    </MessageBox>

    <AppButton
      :loading="loading"
      variant="primaryOutlined"
      class="mb-2 w-full"
      @click="$emit('update-payment-source')"
    >
      {{ t('contribution.changeBank') }}
    </AppButton>

    <InfoMessage :message="t('contribution.changeBankInfo')" />
  </div>
</template>

<script lang="ts" setup>
import InfoMessage from '../../../components/InfoMessage.vue';
import MessageBox from '../../../components/MessageBox.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { PaymentSource } from '../contribution.interface';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineProps<{
  paymentSource: PaymentSource;
  hasError: boolean;
  loading: boolean;
}>();

defineEmits(['update-payment-source']);
</script>
