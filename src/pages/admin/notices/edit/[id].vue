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
      <NoticeForm :notice="notice" @submit="handleSubmit"></NoticeForm>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import NoticeForm from '../../../../components/notice/NoticeForm.vue';
import PageTitle from '../../../../components/PageTitle.vue';
import {
  CreateNoticeData,
  GetNoticeData,
} from '../../../../utils/api/api.interface';
import { updateNotice, fetchNotice } from '../../../../utils/api/notice';

const { t } = useI18n();
const router = useRouter();

const props = defineProps<{ id: string }>();
const notice = ref<GetNoticeData | undefined>();

onBeforeMount(async () => {
  notice.value = await fetchNotice(props.id as string);
});

async function handleSubmit(formData: CreateNoticeData) {
  if (!notice.value) return; // ToDo: Redirect to 404 if notice could not be fetched
  const updatedNotice: GetNoticeData | undefined = await updateNotice(
    notice.value.id,
    formData
  );
  if (updatedNotice) router.push('/admin/notices/view/' + updatedNotice.id);
}
</script>
