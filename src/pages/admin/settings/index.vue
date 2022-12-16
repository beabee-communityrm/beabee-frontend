<route lang="yaml">
name: adminSettingsGeneral
meta:
  pageTitle: menu.adminSettings
  role: admin
</route>

<template>
  <div class="grid gap-8 lg:grid-cols-2">
    <div>
      <AppForm
        :button-text="t('actions.update')"
        :success-text="t('form.saved')"
        @submit="handleSaveGeneral"
      >
        <div class="mb-4">
          <AppInput
            v-model="generalData.organisationName"
            :label="t('adminSettings.general.organisationName')"
            required
          />
        </div>
        <div class="mb-4">
          <AppImageUpload
            v-model="generalData.logoUrl"
            :label="t('adminSettings.general.logo')"
            :width="400"
            :height="400"
            required
          />
        </div>
        <div class="mb-4">
          <AppSelect
            v-model="generalData.locale"
            :label="t('adminSettings.general.language')"
            :items="locales"
            class="w-60"
            required
          />
        </div>
      </AppForm>

      <div class="my-6 border-b border-b-primary-40" />

      <AppForm
        v-if="shareContent"
        :button-text="t('actions.update')"
        :success-text="t('form.saved')"
        @submit="handleSaveShare"
      >
        <AppHeading class="mb-4">
          {{ t('adminSettings.general.socialSharing.title') }}
        </AppHeading>
        <p class="mb-4">
          {{ t('adminSettings.general.socialSharing.text') }}
        </p>
        <div class="mb-4">
          <AppInput
            v-model="shareContent.title"
            :label="t('adminSettings.general.socialSharing.shareTitle')"
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
      </AppForm>

      <div class="my-6 border-b border-b-primary-40" />

      <AppForm
        :button-text="t('actions.update')"
        :success-text="t('form.saved')"
        @submit="handleSaveFooter"
      >
        <AppHeading class="mb-4">
          {{ t('adminSettings.general.footer.title') }}
        </AppHeading>
        <p class="mb-4">
          {{ t('adminSettings.general.footer.text') }}
        </p>
        <div class="mb-4">
          <AppInput
            v-model="footerData.siteUrl"
            :label="t('adminSettings.general.footer.siteUrl')"
            type="url"
            required
          />
        </div>
        <h4 class="mb-4 text-lg font-semibold">
          {{ t('adminSettings.general.footer.dataPrivacy.title') }}
        </h4>
        <div class="mb-4">
          <AppInput
            v-model="footerData.privacyLink"
            :label="t('adminSettings.general.footer.dataPrivacy.privacyUrl')"
            type="url"
            required
          />
        </div>
        <div class="mb-4">
          <AppInput
            v-model="footerData.termsLink"
            :label="t('adminSettings.general.footer.dataPrivacy.termsUrl')"
            type="url"
          />
        </div>
        <div class="mb-4">
          <AppInput
            v-model="footerData.impressumLink"
            :label="t('adminSettings.general.footer.dataPrivacy.impressumUrl')"
            type="url"
          />
        </div>
        <h4 class="mb-4 text-lg font-semibold">
          {{ t('adminSettings.general.footer.otherLinks.title') }}
        </h4>
        <div
          v-for="(link, i) in footerData.footerLinks"
          :key="i"
          class="mb-4 flex gap-4"
        >
          <div class="flex-1">
            <AppInput
              v-model="footerData.footerLinks[i].text"
              :label="t('adminSettings.general.footer.otherLinks.linkText')"
              required
            />
          </div>
          <div class="flex-1">
            <AppInput
              v-model="footerData.footerLinks[i].url"
              :label="t('adminSettings.general.footer.otherLinks.url')"
              type="url"
              required
            />
          </div>
          <div class="flex-0 self-end">
            <AppButton variant="danger" @click="removeLink(i)">
              <font-awesome-icon :icon="['fa', 'trash']" />
            </AppButton>
          </div>
        </div>
        <AppButton variant="primaryOutlined" class="mb-4" @click="addLink">
          {{ t('adminSettings.general.footer.otherLinks.add') }}
        </AppButton>
      </AppForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppImageUpload from '../../../components/forms/AppImageUpload.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppSelect from '../../../components/forms/AppSelect.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import { ShareContent } from '../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../utils/api/content';
import { generalContent as storeGeneralContent } from '../../../store';
import AppHeading from '../../../components/AppHeading.vue';
import axios from '../../../lib/axios';
import AppForm from '../../../components/forms/AppForm.vue';

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

const generalData = reactive({
  organisationName: '',
  logoUrl: '',
  locale: '',
});
const footerData = reactive({
  siteUrl: '',
  privacyLink: '',
  termsLink: '',
  impressumLink: '',
  footerLinks: [] as { text: string; url: string }[],
});

const shareContent = ref<ShareContent>();

function addLink() {
  footerData.footerLinks.push({ text: '', url: 'https://' });
}

function removeLink(i: number) {
  footerData.footerLinks.splice(i, 1);
}

async function handleSaveGeneral() {
  storeGeneralContent.value = await updateContent('general', generalData);

  // Refresh the favicon
  await axios.get('/favicon.png', { baseURL: '' });
  const faviconEl = document.getElementById('favicon') as HTMLLinkElement;
  // This just forces the browser to reload the image
  // eslint-disable-next-line no-self-assign
  faviconEl.href = faviconEl.href;
}

async function handleSaveShare() {
  if (!shareContent.value) return; // Can't submit without shareContent being loaded
  await updateContent('share', shareContent.value);
}

async function handleSaveFooter() {
  storeGeneralContent.value = await updateContent('general', footerData);
}

onBeforeMount(async () => {
  generalData.organisationName = storeGeneralContent.value.organisationName;
  generalData.logoUrl = storeGeneralContent.value.logoUrl;
  generalData.locale = storeGeneralContent.value.locale;

  footerData.siteUrl = storeGeneralContent.value.siteUrl;
  footerData.privacyLink = storeGeneralContent.value.privacyLink;
  footerData.termsLink = storeGeneralContent.value.termsLink || '';
  footerData.impressumLink = storeGeneralContent.value.impressumLink || '';
  footerData.footerLinks =
    storeGeneralContent.value.footerLinks?.map((l) => ({ ...l })) || [];

  shareContent.value = await fetchContent('share');
});
</script>
