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
    @close="confirmCreateApiKey"
    @confirm="confirmCreateApiKey"
  >
    <p class="mb-4">{{ t('adminSettings.apikey.confirmCreate.text') }}</p>
    <div class="flex gap-2">
      <pre class="overflow-scroll text-sm">{{ tokenToShow }} </pre>
      <AppButton
        :icon="faCopy"
        size="sm"
        variant="primaryOutlined"
        @click="copyToClipboard"
      />
    </div>
  </AppConfirmDialog>

  <AppPaginatedTable
    v-model:query="currentPaginatedQuery"
    keypath="adminSettings.apikey.showingOf"
    :headers="headers"
    :result="apiKeyTable"
    class="mb-8"
  >
    <template #value-createdAt="{ value }">
      <span class="whitespace-nowrap">{{ formatLocale(value, 'PP') }}</span>
    </template>
    <template #value-id="{ item }"> {{ item.id }}_••••••••••••••••••</template>
    <template #value-actions="{ item }"
      ><AppButton
        :title="t('actions.delete')"
        :icon="faTrash"
        variant="dangerOutlined"
        size="sm"
        @click="
          ($event) => {
            showDeleteModal = true;
            apiKeyToDelete = item.id;
          }
        "
      />
    </template>
  </AppPaginatedTable>

  <div class="grid md:grid-cols-2 md:gap-12 lg:grid-cols-3">
    <div>
      <AppHeading class="mb-2">
        {{ t('adminSettings.apikey.create') }}
      </AppHeading>
      <AppForm :button-text="t('actions.create')" @submit="generateApiKey">
        <div class="mb-4">
          <AppInput
            v-model="newApiKeyData.description"
            :label="t('apiKey.data.description')"
            required
          />
        </div>
      </AppForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';

import { faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';

import { reactive, ref, watchEffect } from 'vue';
import { GetApiKeyData } from '../../../utils/api/api.interface';
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
import { addNotification } from '../../../store/notifications';
import AppHeading from '../../../components/AppHeading.vue';

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
    value: 'description',
    text: t('apiKey.data.description'),
    width: '50%',
  },
  {
    value: 'id',
    text: t('apiKey.data.token'),
    width: '50%',
  },
  {
    value: 'createdAt',
    text: t('apiKey.data.createdAt'),
    align: 'right',
    sortable: true,
  },
  { value: 'actions', text: '', align: 'right' },
];

const apiKeyTable = ref<Paginated<GetApiKeyData>>();

const currentPaginatedQuery = definePaginatedQuery('createdAt');

watchEffect(async () => {
  apiKeyTable.value = await fetchApiKeys(currentPaginatedQuery.query);
});

async function generateApiKey() {
  tokenToShow.value = (await createApiKey(newApiKeyData)).token;
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
  addNotification({
    title: t('adminSettings.apikey.copied'),
    variant: 'success',
  });
}
</script>
