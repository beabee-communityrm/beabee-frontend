<route lang="yaml">
name: adminMembershipBuilderIntroMessages
meta:
  pageTitle: membershipBuilder.title
  role: admin
</route>

<template>
  <div>
    <div class="grid grid-cols-2 gap-8">
      <div>
        <p class="mb-8">{{ stepT('text') }}</p>
      </div>
    </div>

    <AppForm
      :button-text="t('form.saveChanges')"
      :success-text="t('form.saved')"
      @submit="handleUpdate"
    >
      <AppCheckbox
        v-model="showIntroMessage"
        :label="stepT('showWelcomeMessage')"
        class="mb-4 font-semibold"
      />

      <div v-if="showIntroMessage" class="grid grid-cols-2 gap-8">
        <div>
          <RichTextEditor
            v-model="introMessage"
            :label="stepT('message')"
            class="mb-4"
            required
          />
        </div>
        <div>
          <WelcomeMessage
            :first-name="currentUser?.firstname || ''"
            :last-name="currentUser?.lastname || ''"
            :text="introMessage"
            small
          />
        </div>
      </div>
    </AppForm>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppForm from '../../../components/forms/AppForm.vue';
import AppCheckbox from '../../../components/forms/AppCheckbox.vue';
import RichTextEditor from '../../../components/rte/RichTextEditor.vue';
import { fetchContent } from '../../../utils/api/content';
import WelcomeMessage from '../../../components/welcome-message/WelcomeMessage.vue';
import { currentUser } from '../../../store';
import { updateContent } from '../../../utils/api/content';

const { t } = useI18n();
const stepT = (key: string) => t('membershipBuilder.steps.intro.' + key);

const introMessage = ref('');
const showIntroMessage = ref(false);

async function handleUpdate() {
  await updateContent('profile', {
    introMessage: showIntroMessage.value ? introMessage.value : '',
  });
}

onBeforeMount(async () => {
  introMessage.value = (await fetchContent('profile')).introMessage;
  showIntroMessage.value = !!introMessage.value;
});
</script>
