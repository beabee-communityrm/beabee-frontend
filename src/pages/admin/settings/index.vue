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
          :label="t('adminSettings.general.organisationName')"
          required
        />
      </div>
      <div class="mb-4">
        <AppSelect
          v-model="generalContent.locale"
          :label="t('adminSettings.general.language')"
          :items="locales"
          class="w-60"
          required
        />
      </div>
    </section>

    <section v-if="shareContent" class="mb-8">
      <AppHeading class="mb-4">
        {{ t('adminSettings.general.socialSharing.title') }}
      </AppHeading>
      <p class="mb-4">
        {{ t('adminSettings.general.socialSharing.text') }}
      </p>
      <div class="mb-4">
        <AppInput
          v-model="shareContent.title"
          :label="t('adminSettings.general.socialSharing.title')"
          required
        />
      </div>
      <div class="mb-4">
        <AppTextArea
          v-model="shareContent.description"
          :label="t('adminSettings.general.socialSharing.description')"
          required
        />
      </div>
      <div class="mb-4">
        <AppImageUpload
          v-model="shareContent.image"
          :label="t('adminSettings.general.socialSharing.image')"
          :width="1200"
          :height="627"
          required
        />
      </div>
      <div class="mb-4">
        <AppInput
          v-model="shareContent.twitterHandle"
          :label="t('adminSettings.general.socialSharing.twitterHandle')"
        />
      </div>
    </section>

    <section class="mb-8">
      <AppHeading class="mb-4">
        {{ t('adminSettings.general.footer.title') }}
      </AppHeading>
      <p class="mb-4">
        {{ t('adminSettings.general.footer.text') }}
      </p>
      <div class="mb-4">
        <AppInput
          v-model="generalContent.siteUrl"
          :label="t('adminSettings.general.footer.siteUrl')"
          type="url"
          required
        />
      </div>
      <h4 class="font-semibold text-lg mb-4">
        {{ t('adminSettings.general.footer.dataPrivacy.title') }}
      </h4>
      <div class="mb-4">
        <AppInput
          v-model="generalContent.privacyLink"
          :label="t('adminSettings.general.footer.dataPrivacy.privacyUrl')"
          type="url"
          required
        />
      </div>
      <div class="mb-4">
        <AppInput
          v-model="generalContent.termsLink"
          :label="t('adminSettings.general.footer.dataPrivacy.termsUrl')"
          type="url"
        />
      </div>
      <div class="mb-4">
        <AppInput
          v-model="generalContent.impressumLink"
          :label="t('adminSettings.general.footer.dataPrivacy.impressumUrl')"
          type="url"
        />
      </div>
      <h4 class="font-semibold text-lg mb-4">
        {{ t('adminSettings.general.footer.otherLinks.title') }}
      </h4>
      <div
        v-for="(link, i) in generalContent.footerLinks"
        :key="i"
        class="flex gap-4 mb-4"
      >
        <div class="flex-1">
          <AppInput
            v-model="generalContent.footerLinks[i].text"
            :label="t('adminSettings.general.footer.otherLinks.linkText')"
            required
          />
        </div>
        <div class="flex-1">
          <AppInput
            v-model="generalContent.footerLinks[i].url"
            :label="t('adminSettings.general.footer.otherLinks.url')"
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
        {{ t('adminSettings.general.footer.otherLinks.add') }}
      </AppButton>
    </section>

    <MessageBox v-if="hasSaved" type="success" class="mb-4">
      {{ t('form.saved') }}
    </MessageBox>

    <AppButton type="submit" variant="link" :loading="saving">
      {{ t('actions.update') }}
    </AppButton>
  </form>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
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

const { t } = useI18n();

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
