<template>
  <section class="mb-6">
    <p class="leading-normal mb-4 text-sm">
      {{ t('join.absorbFeeText', { fee: fee }) }}
    </p>

    <label class="mb-4">
      <input v-model="signUpData.payFee" type="checkbox" />
      {{ t('join.absorbFeeOptIn', { fee: n(fee, 'currency') }) }}
    </label>
  </section>
</template>

<script lang="ts" setup>
import { useJoin } from '../use-join';
import { useI18n } from 'vue-i18n';

const { t, n } = useI18n();

const { fee, signUpData } = useJoin();
</script>
