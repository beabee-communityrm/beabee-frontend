<template>
  <JoinHeader :title="joinContent.title" />

  <AppForm :button-text="buttonText" full-button @submit.prevent="onSubmit">
    <div class="content-message mb-4" v-html="joinContent.subtitle" />

    <AppSubHeading v-if="joinContent.showNoContribution" class="mb-1">
      {{ t('join.contribution') }}
    </AppSubHeading>

    <AppCheckbox
      v-if="joinContent.showNoContribution"
      v-model="signUpData.noContribution"
      class="mb-4"
      :label="t('join.noContribution')"
    />

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
  </AppForm>

  <p class="mt-6 mb-2 text-center text-xs">
    {{ t('join.notice') }}
    <a
      class="text-link underline hover:text-primary"
      :href="generalContent.privacyLink"
      target="_blank"
      rel="noreferrer"
      >{{ t('join.privacy') }}</a
    >.
  </p>
  <p class="text-center text-xs">
    <a href="https://beabee.io" target="_blank">
      <img class="inline" :src="beabeeLogo" width="30" />
      {{ t('join.poweredBy') }}
    </a>
  </p>
  <JoinFooter class="mt-6" :privacy-link="generalContent.privacyLink" />
</template>
<script lang="ts" setup>
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';
import { generalContent } from '../../../store';
import { useJoin } from './use-join';
import AccountSection from './AccountSection.vue';
import Contribution from '../../contribution/Contribution.vue';
import AppSubHeading from '../../AppSubHeading.vue';
import { JoinContent } from '../../../utils/api/api.interface';
import JoinHeader from './JoinHeader.vue';
import AppCheckbox from '../../forms/AppCheckbox.vue';
import AppForm from '../../forms/AppForm.vue';
import beabeeLogo from '../../../assets/images/beabee-logo.png';

const props = defineProps<{
  joinContent: JoinContent;
  onSubmit?: () => Promise<void>;
}>();

const { t } = useI18n();

const { signUpData, signUpDescription } = useJoin(toRef(props, 'joinContent'));

const buttonText = computed(() => {
  return signUpData.noContribution
    ? t('join.now')
    : t('join.contribute', signUpDescription.value);
});

useVuelidate({ $stopPropagation: true });
</script>
