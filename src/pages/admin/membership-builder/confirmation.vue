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
    <AppForm
      :button-text="t('form.saveChanges')"
      :success-text="t('form.saved')"
      @submit="handleUpdate"
    >
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

      <div class="mb-4">
        <AppSelect
          v-model="setupContent.surveySlug"
          :label="stepT('surveySlug')"
          :items="[
            { id: '', label: t('common.selectNone') },
            ...openCallouts.map((callout) => ({
              id: callout.slug,
              label: callout.title,
            })),
          ]"
        />
        <AppInputHelp :message="stepT('surveySlugHelp')" />
      </div>
    </AppForm>
    <div class="bg-cover bg-center p-4 pt-8">
      <Suspense>
        <SetupForm :setup-content="setupContent" />
      </Suspense>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import {
  GetCalloutData,
  JoinSetupContent,
} from '../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../utils/api/content';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import { useI18n } from 'vue-i18n';
import AppCheckbox from '../../../components/forms/AppCheckbox.vue';
import SetupForm from '../../../components/pages/join/SetupForm.vue';
import RichTextEditor from '../../../components/rte/RichTextEditor.vue';
import AppSelect from '../../../components/forms/AppSelect.vue';
import AppInputHelp from '../../../components/forms/AppInputHelp.vue';
import { fetchCallouts } from '../../../utils/api/callout';
import { ItemStatus } from '@beabee/beabee-common';

const setupContent = ref<JoinSetupContent>();
const openCallouts = ref<GetCalloutData[]>([]);

const { t } = useI18n();

const stepT = (key: string) =>
  t('membershipBuilder.steps.accountConfirmation.' + key);

async function handleUpdate() {
  if (setupContent.value) {
    await updateContent('join/setup', setupContent.value);
  }
}

onBeforeMount(async () => {
  setupContent.value = await fetchContent('join/setup');

  openCallouts.value = (
    await fetchCallouts({
      limit: 100,
      rules: {
        condition: 'AND',
        rules: [
          { field: 'status', operator: 'equal', value: [ItemStatus.Open] },
        ],
      },
      sort: 'title',
    })
  ).items;
});
</script>
