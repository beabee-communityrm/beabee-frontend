<route lang="yaml">
name: adminNoticesAdd
meta:
  role: admin
  pageTitle: menu.notices
</route>

<template>
  <PageTitle :title="t('addNotice.title')" border></PageTitle>
  <div class="grid lg:grid-cols-2">
    <NoticeForm :notice="undefined" @submit="handleSubmit"></NoticeForm>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import PageTitle from '../../../components/PageTitle.vue';
import NoticeForm from '../../../components/notice/NoticeForm.vue';
import { createNotice } from '../../../utils/api/notice';
import {
  CreateNoticeData,
  GetNoticeData,
} from '../../../utils/api/api.interface';
import { addBreadcrumb } from '../../../store/breadcrumb';
import { faSignHanging } from '@fortawesome/free-solid-svg-icons';

const { t } = useI18n();
const router = useRouter();

addBreadcrumb(
  computed(() => [
    { title: t('menu.notices'), to: '/admin/notices', icon: faSignHanging },
    { title: t('addNotice.title') },
  ])
);

async function handleSubmit(noticeData: CreateNoticeData) {
  const notice: GetNoticeData = await createNotice(noticeData);
  router.push({
    path: '/admin/notices/view/' + notice.id,
    query: { ['created']: null },
  });
}
</script>
