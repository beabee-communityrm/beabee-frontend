<template>
  <div class="grid grid-cols-2 gap-8">
    <div>
      <AppHeading class="mb-5">{{ stepT('title') }}</AppHeading>
      <p class="mb-8">{{ stepT('text') }}</p>
    </div>
  </div>

  <form v-if="profileContent" @submit.prevent="handleSubmit">
    <AppCheckbox
      v-model="showWelcomeMessage"
      :label="stepT('showWelcomeMessage')"
      class="font-semibold mb-4"
    />

    <div v-if="showWelcomeMessage" class="grid grid-cols-2 gap-8">
      <div>
        <RichTextEditor
          v-model="profileContent.introMessage"
          :label="stepT('message')"
          class="mb-4"
          required
        />
      </div>
      <div>
        <WelcomeMessage
          :first-name="currentUser?.firstname || ''"
          :last-name="currentUser?.lastname || ''"
          :text="profileContent.introMessage"
          small
        />
      </div>
    </div>
    <AppButton type="submit" variant="link">{{
      t('form.saveChanges')
    }}</AppButton>
  </form>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../components/AppHeading.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import AppCheckbox from '../../../../components/forms/AppCheckbox.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import { ProfileContent } from '../../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../../utils/api/content';
import WelcomeMessage from '../../../../components/welcome-message/WelcomeMessage.vue';
import { currentUser } from '../../../../store';

const { t } = useI18n();
const stepT = (key: string) => t('membershipBuilder.steps.intro.' + key);

async function handleSubmit() {
  if (profileContent.value) {
    await updateContent('profile', {
      ...profileContent.value,
      welcomeMessage: showWelcomeMessage.value
        ? profileContent.value.welcomeMessage
        : '',
    });
  }
}

const profileContent = ref<ProfileContent>();

const showWelcomeMessage = ref(false);

onBeforeMount(async () => {
  profileContent.value = await fetchContent('profile');
  showWelcomeMessage.value = !!profileContent.value.introMessage;
});
</script>
