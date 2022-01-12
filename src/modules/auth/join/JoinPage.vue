<template>
  <AuthBox>
    <form @submit.prevent>
      <JoinHeader
        class="mb-3"
        :title="joinContent.title"
        :description="joinContent.subtitle"
      />

      <h3
        v-if="joinContent.showNoContribution"
        class="font-semibold text-lg mb-1"
      >
        {{ t('join.contribution') }}
      </h3>

      <div v-if="joinContent.showNoContribution" class="mb-4">
        <label>
          <input v-model="signUpData.noContribution" type="checkbox" />
          {{ t('join.noContribution') }}
        </label>
      </div>

      <Contribution
        v-if="!signUpData.noContribution"
        v-model="signUpData"
        v-model:isValid="isContributionValid"
        :content="joinContent"
      >
        <AccountSection
          @update-email="signUpData.email = $event"
          @update-password="signUpData.password = $event"
        />
      </Contribution>

      <!-- TODO: clean this up by always having account section above contribution -->
      <AccountSection
        v-else
        @update-email="signUpData.email = $event"
        @update-password="signUpData.password = $event"
      />

      <MessageBox v-if="hasJoinError" class="mb-4" />

      <AppButton
        :disabled="isJoinFormInvalid"
        :loading="loading"
        variant="link"
        type="submit"
        class="mb-4 w-full"
        @click="submitSignUp($router)"
        >{{ buttonText }}</AppButton
      >

      <JoinFooter :privacy-link="joinContent.privacyLink" />
    </form>
  </AuthBox>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import JoinHeader from './components/JoinHeader.vue';
import AuthBox from '../AuthBox.vue';
import AccountSection from './components/AccountSection.vue';
import JoinFooter from './components/JoinFooter.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import Contribution from '../../../components/contribution/Contribution.vue';
import MessageBox from '../../../components/MessageBox.vue';
import { useJoin } from './use-join';

const { t, n } = useI18n();

const {
  signUpData,
  isContributionValid,
  isJoinFormInvalid,
  hasJoinError,
  loading,
  submitSignUp,
  joinContent,
  setJoinContent,
} = useJoin();

const route = useRoute();

const buttonText = computed(() =>
  signUpData.noContribution
    ? t('join.now')
    : t('join.contribute', {
        amount: n(signUpData.totalAmount, 'currency'),
        period:
          signUpData.period === 'monthly'
            ? t('common.month')
            : t('common.year'),
      })
);

onBeforeMount(() => {
  setJoinContent(route.query);
});
</script>
