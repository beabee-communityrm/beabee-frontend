<template>
  <form v-if="profileContent" @submit.prevent="handleSubmit">
    <AppHeading class="mb-5">Intro message</AppHeading>
    <p class="mb-4">Once your users are done with re</p>

    <AppCheckbox
      v-model="showWelcomeMessage"
      label="Show welcome message"
      class="font-semibold mb-4"
    />

    <div v-if="showWelcomeMessage" class="flex gap-8">
      <div class="flex-1">
        <RichTextEditor
          v-model="profileContent.welcomeMessage"
          label="Message"
          class="mb-4"
          required
        />

        <AppButton type="submit" variant="link" class="w-32">Save</AppButton>
      </div>
      <div class="flex-1">
        <WelcomeMessage
          :first-name="currentUser?.firstname || ''"
          :text="profileContent.welcomeMessage"
        />
      </div>
    </div>
  </form>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import AppHeading from '../../../../components/AppHeading.vue';
import AppButton from '../../../../components/forms/AppButton.vue';
import AppCheckbox from '../../../../components/forms/AppCheckbox.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import { ProfileContent } from '../../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../../utils/api/content';
import WelcomeMessage from '../../../../components/welcome-message/WelcomeMessage.vue';
import { currentUser } from '../../../../store';

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
