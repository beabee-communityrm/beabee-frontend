<route lang="yaml">
name: adminSettingsApikeys
meta:
  pageTitle: menu.adminSettings
  role: admin
</route>

<template>
  <AppConfirmDialog
    :open="showDeleteModal"
    :title="t('adminSettings.apikey.confirmDelete.title')"
    :cancel="t('actions.noBack')"
    :confirm="t('actions.yesDelete')"
    variant="danger"
    @close="
      {
        showDeleteModal = false;
        apiKeyToDelete = '';
      }
    "
    @confirm="confirmDeleteApiKey"
  >
    <p>{{ t('adminSettings.apikey.confirmDelete.text') }}</p>
  </AppConfirmDialog>

  <AppConfirmDialog
    :open="showConfirmCreateModal"
    :title="t('adminSettings.apikey.confirmCreate.title')"
    :confirm="t('actions.continue')"
    variant="danger"
    @close="confirmCreateApiKey"
    @confirm="confirmCreateApiKey"
    ><p>{{ t('adminSettings.apikey.confirmCreate.text') }}</p>

    <div>
      <AppButton :icon="faCopy" size="sm" @click="copyToClipboard">
        {{ t('common.copy') }}
      </AppButton>
      <pre white-space="nowrap">{{ tokenToShow }} </pre>
    </div>
  </AppConfirmDialog>

  <AppPaginatedTable
    v-model:query="currentPaginatedQuery"
    keypath="adminSettings.apikey.showingOf"
    :headers="headers"
    :result="apiKeyTable"
  >
    <template #value-apiKey-description="{ item }">
      <span> {{ item.apiKey.description }} </span>
    </template>
    <template #value-joined="{ value }">
      <span> {{ formatLocale(value, 'PPPppp') }}</span>
    </template>
    <template #value-apiKey-id="{ item }">
      <span>{{ item.apiKey.id }}********** </span>
    </template>
    <template #value-id="{ value }"
      ><AppButton
        :title="t('actions.delete')"
        @click="
          ($event) => {
            showDeleteModal = true;
            apiKeyToDelete = value;
          }
        "
      >
        {{ t('actions.delete') }}</AppButton
      >
    </template>
  </AppPaginatedTable>

  <AppForm
    :button-text="t('adminSettings.apikey.generate')"
    @submit="generateApiKey"
  >
    <AppInput
      v-model="newApiKeyData.description"
      :label="t('adminSettings.apikey.description')"
      required
    />
  </AppForm>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';

import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { reactive, ref, watchEffect } from 'vue';
import { GetApiKeyData, GetTokenData } from '../../../utils/api/api.interface';
import {
  createApiKey,
  fetchApiKeys,
  deleteApiKey,
} from '../../../utils/api/api-key';
import AppButton from '../../../components/button/AppButton.vue';
import AppConfirmDialog from '../../../components/AppConfirmDialog.vue';
import AppPaginatedTable from '../../../components/table/AppPaginatedTable.vue';
import { definePaginatedQuery } from '../../../utils/pagination';
import { Paginated } from '@beabee/beabee-common';
import { Header } from '../../../components/table/table.interface';
import { formatLocale } from '../../../utils/dates';

const { t } = useI18n();

const validation = useVuelidate();

const showDeleteModal = ref(false);
const showConfirmCreateModal = ref(false);
const apiKeyToDelete = ref('');
const tokenToShow = ref('');

const newApiKeyData = reactive({
  description: '',
});

const headers: Header[] = [
  {
    value: 'apiKey-description',
    text: t('form.description'),
  },
  {
    value: 'joined',
    text: t('adminSettings.apikey.createdAt'),
    align: 'right',
    sortable: true,
  },
  {
    value: 'apiKey-id',
    text: t('adminSettings.apikey.token'),
    align: 'right',
  },
  { value: 'id', text: t('actions.delete'), align: 'right' },
];

const apiKeyTable = ref<Paginated<GetApiKeyData>>();

const currentPaginatedQuery = definePaginatedQuery('joined');
watchEffect(async () => {
  apiKeyTable.value = await fetchApiKeys(currentPaginatedQuery.query);
});

async function generateApiKey() {
  const tokenData: GetTokenData = await createApiKey(newApiKeyData);
  tokenToShow.value = tokenData.token;
  newApiKeyData.description = '';
  validation.value.$reset();
  showConfirmCreateModal.value = true;
  await refreshApiKeys();
}

async function refreshApiKeys() {
  apiKeyTable.value = await fetchApiKeys(currentPaginatedQuery.query);
}

async function confirmDeleteApiKey() {
  await deleteApiKey(apiKeyToDelete.value);
  showDeleteModal.value = false;
  apiKeyToDelete.value = '';
  await refreshApiKeys();
}

async function confirmCreateApiKey() {
  showConfirmCreateModal.value = false;
  tokenToShow.value = '';
}

function copyToClipboard() {
  navigator.clipboard.writeText(tokenToShow.value);
}
</script>
