<route lang="yaml">
name: adminSettingsGeneral
meta:
  title: menu.adminSettings
  role: admin
</route>

<template>
  <form v-if="generalContent" @submit.prevent="handleSubmit">
    <section class="mb-8">
      <div class="mb-4">
        <AppInput
          v-model="generalContent.organisationName"
          label="Organisation name"
          required
        />
      </div>
      <div class="mb-4">
        <AppSelect
          v-model="generalContent.locale"
          label="Language"
          :items="locales"
          class="w-60"
          required
        />
      </div>
    </section>

    <section v-if="shareContent" class="mb-8">
      <AppHeading class="mb-4">Social sharing</AppHeading>
      <p class="mb-4">
        Configure what appears on social media when a link to your beabee
        community is shared
      </p>
      <div class="mb-4">
        <AppInput v-model="shareContent.title" label="Share title" required />
      </div>
      <div class="mb-4">
        <AppTextArea
          v-model="shareContent.description"
          label="Share description"
          required
        />
      </div>
      <div class="mb-4">
        <AppImageUpload
          v-model="shareContent.image"
          label="Share image"
          :width="1200"
          :height="627"
          required
        />
      </div>
      <div class="mb-4">
        <AppInput v-model="shareContent.twitterHandle" label="Twitter handle" />
      </div>
    </section>

    <section class="mb-8">
      <AppHeading class="mb-4">Footer</AppHeading>
      <p class="mb-4">These links appear in beabee's footer and in emails</p>
      <div class="mb-4">
        <AppInput
          v-model="generalContent.siteUrl"
          label="Main website URL"
          type="url"
          required
        />
      </div>
      <h4 class="font-semibold text-lg mb-4">Data privacy</h4>
      <div class="mb-4">
        <AppInput
          v-model="generalContent.privacyLink"
          label="Privacy policy URL"
          type="url"
          required
        />
      </div>
      <div class="mb-4">
        <AppInput
          v-model="generalContent.termsLink"
          label="Terms of service URL"
          type="url"
        />
      </div>
      <div class="mb-4">
        <AppInput
          v-model="generalContent.impressumLink"
          label="Impressum URL"
          type="url"
        />
      </div>
      <h4 class="font-semibold text-lg mb-4">Other links</h4>
      <div
        v-for="(link, i) in generalContent.footerLinks"
        :key="i"
        class="flex gap-4 mb-4"
      >
        <div class="flex-1">
          <AppInput
            v-model="generalContent.footerLinks[i].text"
            label="Link text"
            required
          />
        </div>
        <div class="flex-1">
          <AppInput
            v-model="generalContent.footerLinks[i].url"
            label="URL"
            required
          />
        </div>
        <div class="flex-0 self-end">
          <AppButton variant="danger" @click="removeLink(i)">
            <font-awesome-icon :icon="['fa', 'trash']" />
          </AppButton>
        </div>
      </div>
      <AppButton variant="primaryOutlined" @click="addLink">
        Add another link
      </AppButton>
    </section>

    <MessageBox v-if="hasSaved" type="success" class="mb-4"> Saved </MessageBox>

    <AppButton type="submit" variant="link" :loading="saving">Update</AppButton>
  </form>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import AppImageUpload from '../../../components/forms/AppImageUpload.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppSelect from '../../../components/forms/AppSelect.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { GeneralContent, ShareContent } from '../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../utils/api/content';
import { generalContent as storeGeneralContent } from '../../../store';
import MessageBox from '../../../components/MessageBox.vue';
import AppHeading from '../../../components/AppHeading.vue';

const locales = [
  {
    id: 'en',
    label: 'English',
  },
  {
    id: 'de',
    label: 'German (formal)',
  },
  {
    id: 'de@informal',
    label: 'German (informal)',
  },
];

const saving = ref(false);
const hasSaved = ref(false);
const generalContent = ref<GeneralContent>();
const shareContent = ref<ShareContent>();

function addLink() {
  if (generalContent.value) {
    generalContent.value.footerLinks.push({ text: '', url: '' });
  }
}

function removeLink(i: number) {
  if (generalContent.value) {
    generalContent.value.footerLinks.splice(i, 1);
  }
}

async function handleSubmit() {
  saving.value = true;
  hasSaved.value = false;
  try {
    if (generalContent.value && shareContent.value) {
      // Update the general content across the site
      storeGeneralContent.value = await updateContent(
        'general',
        generalContent.value
      );
      await updateContent('share', shareContent.value);
      hasSaved.value = true;
    }
  } catch (err) {}
  saving.value = false;
}

onBeforeMount(async () => {
  generalContent.value = await fetchContent('general');
  shareContent.value = await fetchContent('share');
});
</script>
