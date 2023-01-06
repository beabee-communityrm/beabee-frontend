<route lang="yaml">
name: adminNoticeEdit
meta:
  pageTitle: menu.notices
  role: admin
</route>

<template>
  <template v-if="notice">
    <PageTitle
      :title="`${t('editNotice.title')}: ${notice.name}`"
      border
    ></PageTitle>

    <div class="grid lg:grid-cols-2">
      <AppForm
        :button-text="t('actions.save')"
        :success-text="t('addNotice.noticeSaved')"
        @submit.prevent="handleSubmit"
      >
        <div class="mb-3">
          <AppInput
            v-model="data.name"
            :label="t('addNotice.form.name')"
            required
          />
        </div>

        <AppLabel :label="t('addNotice.form.startDateAndTime')" />
        <div class="mb-3 flex">
          <div>
            <AppInput v-model="data.startDate" type="date" />
          </div>
          <div>
            <AppInput v-model="data.startTime" type="time" />
          </div>
        </div>

        <AppLabel :label="t('addNotice.form.expirationDateAndTime')" />
        <div class="mb-3 flex">
          <div>
            <AppInput v-model="data.expirationDate" type="date" />
          </div>
          <div>
            <AppInput v-model="data.expirationTime" type="time" />
          </div>
        </div>

        <div class="mb-3">
          <AppInput
            v-model="data.text"
            :label="t('addNotice.form.text')"
            required
          />
        </div>

        <div class="mb-3">
          <AppInput
            v-model="data.buttonText"
            :label="t('addNotice.form.buttonText')"
          />
        </div>

        <div class="mb-3">
          <AppInput v-model="data.url" :label="t('addNotice.form.url')" />
        </div>
      </AppForm>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import { ref, onBeforeMount, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import AppForm from '../../../../components/forms/AppForm.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import AppLabel from '../../../../components/forms/AppLabel.vue';
import PageTitle from '../../../../components/PageTitle.vue';
import {
  CreateNoticeData,
  GetNoticeData,
} from '../../../../utils/api/api.interface';
import {
  updateNotice,
  fetchNotice,
  createNotice,
} from '../../../../utils/api/notice';

const { t } = useI18n();
const router = useRouter();

const props = defineProps<{ id: string }>();
const notice = ref<GetNoticeData | undefined>();

const data = reactive({
  name: '',
  startDate: '',
  startTime: '',
  expirationDate: '',
  expirationTime: '',
  text: '',
  buttonText: '',
  url: '',
});

onBeforeMount(async () => {
  notice.value = await fetchNotice(props.id as string);

  data.name = notice.value.name;
  data.startDate = notice.value.starts
    ? format(notice.value.starts, 'yyyy-MM-dd')
    : '';
  data.startTime = notice.value.starts
    ? format(notice.value.starts, 'HH:mm')
    : '';
  data.expirationDate = notice.value.expires
    ? format(notice.value.expires, 'yyyy-MM-dd')
    : '';
  data.expirationTime = notice.value.expires
    ? format(notice.value.expires, 'HH:mm')
    : '';
  data.text = notice.value.text;
  data.buttonText = notice.value.buttonText ? notice.value.buttonText : '';
  data.url = notice.value.url ? notice.value.url : '';
});

async function saveNotice() {
  const noticeToSubmit: CreateNoticeData = {
    name: data.name,
    starts: new Date(data.startDate + 'T' + data.startTime),
    expires: new Date(data.expirationDate + 'T' + data.expirationTime),
    text: data.text,
    buttonText: data.buttonText,
    url: data.url,
  };
  if (notice.value) {
    return await updateNotice(notice.value.id, noticeToSubmit);
  } else {
    return await createNotice(noticeToSubmit);
  }
}

async function handleSubmit() {
  const notice = await saveNotice();
  router.push('/admin/notices/view/' + notice.id);
}
</script>
