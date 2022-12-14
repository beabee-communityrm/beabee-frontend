<route lang="yaml">
name: adminNoticesAdd
meta:
  role: admin
  pageTitle: menu.notices
</route>

<template>
  <PageTitle :title="t('addNotice.title')" border></PageTitle>
  <div class="grid lg:grid-cols-2">
    <AppForm :button-text="t('actions.save')">
      <div class="mb-3">
        <AppInput v-model="data.name" :label="t('form.name')" />
      </div>

      <div class="flex gap-2">
        <div>
          <AppInput v-model="data.startDate" type="date" required />
        </div>
        <div>
          <AppInput v-model="data.startTime" type="time" required />
        </div>
      </div>
    </AppForm>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

import { useI18n } from 'vue-i18n';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import PageTitle from '../../../components/PageTitle.vue';

// const name = ref('');

const { t } = useI18n();

const data = reactive({
  name: '',
  startDate: '',
  startTime: '',
});
</script>
