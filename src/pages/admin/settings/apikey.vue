<route lang="yaml">
name: adminSettingsApikeys
meta:
  pageTitle: menu.adminSettings
  role: admin
</route>

<template>
  <AppForm :button-text="'Add API Key'" @submit="handleAddApiKey">
    <AppInput v-model="newApiKeyData.name" :label="'test'" required />
  </AppForm>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import { reactive } from 'vue';

const { t } = useI18n();

const newApiKeyData = reactive({
  name: '',
});

async function handleAddApiKey() {
  return;
}
</script>
