<template>
  <JoinHeader :title="joinContent.title" />

  <form>
    <div class="mb-3 content-message" v-html="joinContent.subtitle" />

    <AppSubHeading v-if="joinContent.showNoContribution" class="mb-1">
      {{ t('join.contribution') }}
    </AppSubHeading>

    <div v-if="joinContent.showNoContribution" class="mb-4">
      <label>
        <input v-model="signUpData.noContribution" type="checkbox" />
        {{ t('join.noContribution') }}
      </label>
    </div>

    <Contribution
      v-if="!generalContent.hideContribution && !signUpData.noContribution"
      v-model:amount="signUpData.amount"
      v-model:period="signUpData.period"
      v-model:payFee="signUpData.payFee"
      v-model:paymentMethod="signUpData.paymentMethod"
      :content="joinContent"
    >
      <AccountSection
        v-model:email="signUpData.email"
        v-model:password="signUpData.password"
      />
    </Contribution>

    <!-- TODO: clean this up by always having account section above contribution -->
    <AccountSection
      v-else
      v-model:email="signUpData.email"
      v-model:password="signUpData.password"
    />

    <MessageBox v-if="validation.$errors.length > 0" class="mb-4" />

    <AppButton
      :disabled="validation.$invalid"
      :loading="loading"
      variant="link"
      type="submit"
      class="mb-4 w-full"
      >{{ buttonText }}</AppButton
    >

    <JoinFooter :privacy-link="generalContent.privacyLink" />
  </form>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { generalContent } from '../../../../store';
import { useJoin } from '../use-join';
import AccountSection from './AccountSection.vue';
import JoinFooter from './JoinFooter.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import Contribution from '../../../../components/contribution/Contribution.vue';
import MessageBox from '../../../../components/MessageBox.vue';
import AppSubHeading from '../../../../components/AppSubHeading.vue';
import { JoinContent } from '../../../../utils/api/api.interface';
import JoinHeader from './JoinHeader.vue';

const { t } = useI18n();
const { signUpData, signUpDescription } = useJoin();

defineProps<{ joinContent: JoinContent; loading?: boolean }>();

const buttonText = computed(() => {
  return signUpData.noContribution
    ? t('join.now')
    : t('join.contribute', signUpDescription.value);
});

const validation = useVuelidate();
</script>
