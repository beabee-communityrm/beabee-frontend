<route lang="yaml">
name: adminCalloutViewResponsesTags
meta:
  pageTitle: menu.callouts
  role: admin
</route>

<template>
  <AppHeading>{{ t('calloutResponsePage.manageTags') }}</AppHeading>
  <AppTable class="mt-4 w-full" :headers="headers" :items="tags || null">
    <template #name="{ value }">
      <span class="text-base font-bold">{{ value }}</span>
    </template>
    <template #description="{ value }"> {{ value }}</template>
    <template #actions>
      <AppButtonGroup>
        <AppButton icon="pencil" variant="primaryOutlined" size="sm" />
        <AppButton icon="trash" variant="dangerOutlined" size="sm" />
      </AppButtonGroup>
    </template>
  </AppTable>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../../../components/AppHeading.vue';
import AppButton from '../../../../../../components/button/AppButton.vue';
import AppButtonGroup from '../../../../../../components/button/AppButtonGroup.vue';
import AppTable from '../../../../../../components/table/AppTable.vue';
import { Header } from '../../../../../../components/table/table.interface';
import { addBreadcrumb } from '../../../../../../store/breadcrumb';
import {
  GetCalloutDataWith,
  GetCalloutTagData,
} from '../../../../../../utils/api/api.interface';
import { fetchTags } from '../../../../../../utils/api/callout';

const props = defineProps<{
  callout: GetCalloutDataWith<'form'>;
}>();

const { t } = useI18n();

const headers = computed<Header[]>(() => [
  { value: 'name', text: 'Name' },
  { value: 'description', text: 'Description' },
  { value: 'actions', text: '', width: '0' },
]);

const tags = ref<GetCalloutTagData[]>();

addBreadcrumb(computed(() => [{ title: t('calloutResponsePage.manageTags') }]));
onBeforeMount(async () => {
  tags.value = await fetchTags(props.callout.slug);
});
</script>
