<route lang="yaml">
name: adminNoticesAdd
meta:
  role: admin
  pageTitle: menu.notices
</route>

<template>
  <PageTitle :title="t('addNotice.title')" border></PageTitle>
  <div class="grid lg:grid-cols-2">
    <NoticeForm
      :data="{
        name: '',
        startDate: '',
        startTime: '',
        expirationDate: '',
        expirationTime: '',
        text: '',
        buttonText: '',
        url: '',
      }"
      @submit="handleSubmit"
    ></NoticeForm>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import PageTitle from '../../../components/PageTitle.vue';
import NoticeForm from '../../../components/notice/NoticeForm.vue';
import { createNotice } from '../../../utils/api/notice';
import { NoticeFormData } from '../../../components/notice/notice.interface';
import { GetNoticeData } from '../../../utils/api/api.interface';

const { t } = useI18n();
const router = useRouter();

async function saveNotice(
  noticeFormData: NoticeFormData
): Promise<GetNoticeData> {
  return await createNotice({
    name: noticeFormData.name,
    starts: new Date(noticeFormData.startDate + 'T' + noticeFormData.startTime),
    expires: new Date(
      noticeFormData.expirationDate + 'T' + noticeFormData.expirationTime
    ),
    text: noticeFormData.text,
    buttonText: noticeFormData.buttonText,
    url: noticeFormData.buttonText,
  });
}

async function handleSubmit(noticeFormData: NoticeFormData) {
  const notice: GetNoticeData = await saveNotice(noticeFormData);
  router.push('/admin/notices/view/' + notice.id);
}
</script>
