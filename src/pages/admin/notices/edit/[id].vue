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
      <NoticeForm :data="data" @submit="handleSubmit"></NoticeForm>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { format } from 'date-fns';
import { ref, onBeforeMount, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import NoticeForm from '../../../../components/notice/NoticeForm.vue';
import { NoticeFormData } from '../../../../components/notice/notice.interface';
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

  if (!notice.value) {
    return;
  }

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
  data.buttonText = notice.value.buttonText || '';
  data.url = notice.value.url || '';
});

async function saveNotice(noticeFormData: NoticeFormData): Promise<GetNoticeData> {
  const noticeToSubmit: CreateNoticeData = {
    name: noticeFormData.name,
    starts: new Date(noticeFormData.startDate + 'T' + noticeFormData.startTime),
    expires: new Date(noticeFormData.expirationDate + 'T' + noticeFormData.expirationTime),
    text: noticeFormData.text,
    buttonText: noticeFormData.buttonText,
    url: noticeFormData.url,
  };
  if (notice.value) {
    return await updateNotice(notice.value.id, noticeToSubmit);
  } else {
    return await createNotice(noticeToSubmit);
  }
}

async function handleSubmit(noticeFormData: NoticeFormData) {
  const notice = await saveNotice(noticeFormData);
  router.push('/admin/notices/view/' + notice.id);
}
</script>
