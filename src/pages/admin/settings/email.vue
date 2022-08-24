<route lang="yaml">
name: adminSettingsEmail
meta:
  pageTitle: menu.adminSettings
  role: admin
</route>

<template>
  <div class="grid lg:grid-cols-2 gap-8">
    <form v-if="emailContent.footer" @submit.prevent="handleSubmit">
      <AppHeading class="mb-4">{{ t('adminSettings.email.title') }}</AppHeading>
      <p class="mb-4">{{ t('adminSettings.email.text') }}</p>
      <div class="mb-4 max-w-[25rem]">
        <AppInput
          v-model="fromEmailName"
          :label="t('adminSettings.email.fromEmail')"
          required
        >
          <template #suffix>
            <span class="font-semibold">{{ fromEmailDomain }}</span>
          </template>
        </AppInput>
      </div>
      <div class="mb-4" required>
        <AppInput
          v-model="emailContent.supportEmailName"
          :label="t('adminSettings.email.fromName')"
          required
        />
      </div>

      <MessageBox v-if="hasSaved" type="success" class="mb-4">
        {{ t('form.saved') }}
      </MessageBox>

      <MessageBox v-if="validation.$errors.length > 0" class="mb-4">
        {{ t('form.errors.aggregator') }}
      </MessageBox>

      <AppButton
        type="submit"
        variant="link"
        :loading="saving"
        :disabled="validation.$invalid"
      >
        {{ t('actions.update') }}
      </AppButton>
    </form>
  </div>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import AppButton from '../../../components/forms/AppButton.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import MessageBox from '../../../components/MessageBox.vue';
import { EmailContent } from '../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../utils/api/content';

const { t } = useI18n();
const validation = useVuelidate();

const emailContent = ref<EmailContent>({
  footer: '',
  supportEmail: '@',
  supportEmailName: '',
});

const fromEmailName = computed({
  get: () => {
    const i = emailContent.value.supportEmail.lastIndexOf('@');
    return emailContent.value.supportEmail.slice(0, i);
  },
  set: (newName) => {
    emailContent.value.supportEmail = newName + fromEmailDomain.value;
  },
});

const fromEmailDomain = computed(() => {
  const i = emailContent.value.supportEmail.lastIndexOf('@');
  return emailContent.value.supportEmail.slice(i);
});

const hasSaved = ref(false);
const saving = ref(false);

async function handleSubmit() {
  saving.value = true;
  hasSaved.value = false;
  try {
    await updateContent('email', emailContent.value);
    hasSaved.value = true;
  } catch (err) {}
  saving.value = false;
}

onBeforeMount(async () => {
  emailContent.value = await fetchContent('email');
});
</script>
