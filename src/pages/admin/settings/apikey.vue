<route lang="yaml">
name: adminSettingsApikeys
meta:
  pageTitle: menu.adminSettings
  role: admin
</route>

<template>
  <AppConfirmDialog
    :open="showDeleteModal"
    :title="'Delete?'"
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
    <p>{{ t('calloutAdminOverview.actions.confirmDelete.text') }}</p>
  </AppConfirmDialog>

  <AppPaginatedTable
    v-model:query="currentPaginatedQuery"
    keypath="adminSettings.apikey.showingOf"
    :headers="headers"
    :result="apiKeyTable"
  >
    <template #value-description="{ item }">
      <span> {{ item.description }} </span>
    </template>
    <template #value-joined="{ value }">
      <span> {{ formatLocale(value, 'PPPppp') }}</span>
    </template>
    <template #value-apiKey="{ value }">
      <span>{{ value.id }} </span>
    </template>
    <template #value-id="{ value }"
      ><AppButton
        :title="'Delete'"
        @click="
          ($event) => {
            showDeleteModal = true;
            apiKeyToDelete = value;
          }
        "
      >
        {{ 'Delete' }}</AppButton
      >
    </template>
  </AppPaginatedTable>

  <AppForm
    :button-text="t('adminSettings.apikey.generate')"
    @submit="generateApiKey"
  >
    <AppInput
      v-model="newApiKeyData.description"
      :label="t('adminSettings.apikey.name')"
      required
    />
  </AppForm>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';
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

const showDeleteModal = ref(false);
const apiKeyToDelete = ref('');

const headers: Header[] = [
  {
    value: 'apiKey',
    text: 'Description',
  },
  {
    value: 'joined',
    text: t('notices.data.createdAt'),
    align: 'right',
    sortable: true,
  },
  {
    value: 'apiKey',
    text: 'test',
    align: 'right',
  },
  { value: 'id', text: 'Actions' },
];

const currentPaginatedQuery = definePaginatedQuery('joined');

const apiKeyTable = ref<Paginated<GetApiKeyData>>();

watchEffect(async () => {
  apiKeyTable.value = await fetchApiKeys(currentPaginatedQuery.query);
});

const newApiKeyData = reactive({
  description: '',
});

async function generateApiKey() {
  const token: GetTokenData = await createApiKey(newApiKeyData);
}

async function confirmDeleteApiKey() {
  await deleteApiKey(apiKeyToDelete.value);
  showDeleteModal.value = false;
}
</script>
