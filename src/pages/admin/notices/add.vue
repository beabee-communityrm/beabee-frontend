<route lang="yaml">
name: adminNoticesAdd
meta:
  role: admin
  pageTitle: menu.notices
</route>

<template>
  <PageTitle :title="t('addNotice.title')" border></PageTitle>
  <div class="grid lg:grid-cols-2">
    <AppForm 
      :button-text="t('actions.save')"
      :success-text="t('addNotice.noticeSaved')"
      @submit.prevent="handleSubmit"
    >
      <div class="mb-3">
        <AppInput v-model="data.name" :label="t('addNotice.form.name')" required/>
      </div>
      
      <AppLabel :label="t('addNotice.form.startDateAndTime')" />
      <div class="flex mb-3">
        <div>
          <AppInput v-model="data.startDate" type="date" />
        </div>
        <div>
          <AppInput v-model="data.startTime" type="time" />
        </div>
      </div>

      <AppLabel :label="t('addNotice.form.expirationDateAndTime')" />
      <div class="flex mb-3">
        <div>
          <AppInput v-model="data.expirationDate" type="date" />
        </div>
        <div>
          <AppInput v-model="data.expirationTime" type="time" />
        </div>
      </div>

      <div class="mb-3">
        <AppInput v-model="data.text" :label="t('addNotice.form.text')" required/>
      </div>

      <div class="mb-3">
        <AppInput v-model="data.buttonText" :label="t('addNotice.form.buttonText')" />
      </div>

      <div class="mb-3">
        <AppInput v-model="data.url" :label="t('addNotice.form.url')" />
      </div>
    </AppForm>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AppForm from '../../../components/forms/AppForm.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppLabel from '../../../components/forms/AppLabel.vue';
import PageTitle from '../../../components/PageTitle.vue';
import { createNotice} from '../../../utils/api/notice';

const { t } = useI18n();
const router = useRouter();

const data = reactive({
  name: '',
  startDate: '',
  startTime: '',
  expirationDate: '',
  expirationTime: '', 
  text: '', 
  buttonText: '',
  url: ''
});

async function saveNotice() {
  return await createNotice({
    name: data.name, 
    starts: new Date(data.startDate + 'T' + data.startTime),
    expires: new Date(data.expirationDate + 'T' + data.expirationTime),
    text: data.text,
    buttonText: data.buttonText,
    url: data.buttonText
  })
}

async function handleSubmit() {
  const notice = await saveNotice();
  router.push('/admin/notices/view/' + notice.id)
}

</script>
