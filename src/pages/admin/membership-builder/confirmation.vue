<route lang="yaml">
name: adminMembershipBuilderAccountConfirmation
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <div class="mb-8 grid grid-cols-2 gap-8">
    <div>
      <p>{{ stepT('text') }}</p>
    </div>
  </div>
  <div v-if="setupContent" class="grid grid-cols-2 gap-8">
    <div>
      <div class="mb-4">
        <AppInput
          v-model="setupContent.welcome"
          :label="stepT('welcomeMessage')"
        />
      </div>

      <AppCheckbox
        v-model="setupContent.showMailOptIn"
        :label="stepT('showMailOptIn')"
        class="mb-4 font-semibold"
      />

      <template v-if="setupContent.showMailOptIn">
        <div class="mb-4">
          <AppInput
            v-model="setupContent.mailTitle"
            :label="stepT('optInTitle')"
            required
          />
        </div>
        <div class="mb-4">
          <RichTextEditor
            v-model="setupContent.mailText"
            :label="stepT('optInText')"
            required
          />
        </div>
        <div class="mb-4">
          <AppInput
            v-model="setupContent.mailOptIn"
            :label="stepT('optInLabel')"
            required
          />
        </div>
      </template>

      <AppCheckbox
        v-model="setupContent.showNewsletterOptIn"
        :label="stepT('showNewsletterOptIn')"
        class="mb-4 font-semibold"
      />

      <template v-if="setupContent.showNewsletterOptIn">
        <div class="mb-4">
          <AppInput
            v-model="setupContent.newsletterTitle"
            :label="stepT('optInTitle')"
            required
          />
        </div>
        <div class="mb-4">
          <RichTextEditor
            v-model="setupContent.newsletterText"
            :label="stepT('optInText')"
            required
          />
        </div>
        <div class="mb-4">
          <AppInput
            v-model="setupContent.newsletterOptIn"
            :label="stepT('optInLabel')"
            required
          />
        </div>
      </template>
    </div>
    <div class="bg-cover bg-center p-4 pt-8">
      <Suspense>
        <AuthBox>
          <SetupForm :setup-content="setupContent" />
        </AuthBox>
      </Suspense>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { JoinSetupContent } from '../../../utils/api/api.interface';
import { fetchContent } from '../../../utils/api/content';
import AppInput from '../../../components/forms/AppInput.vue';
import { useI18n } from 'vue-i18n';
import AppCheckbox from '../../../components/forms/AppCheckbox.vue';
import SetupForm from '../../../components/pages/join/SetupForm.vue';
import AuthBox from '../../../components/AuthBox.vue';
import RichTextEditor from '../../../components/rte/RichTextEditor.vue';

const setupContent = ref<JoinSetupContent>();

const { t } = useI18n();

const stepT = (key: string) =>
  t('membershipBuilder.steps.accountConfirmation.' + key);

async function handleUpdate() {
  console.log('confirmation');
}

onBeforeMount(async () => {
  setupContent.value = await fetchContent('join/setup');
});
</script>
