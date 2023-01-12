<route lang="yaml">
name: adminCalloutViewResponsesItem
meta:
  pageTitle: menu.callouts
  role: admin
</route>
<template>
  <div v-if="response" class="md:max-w-2xl">
    <AppHeading class="mb-4">
      {{ t('calloutResponsesPage.responseId', { id: response.id }) }}
    </AppHeading>
    <AppSubHeading>Overview</AppSubHeading>
    <AppInfoList>
      <AppInfoListItem :name="t('calloutResponse.data.contact')">
        <router-link
          v-if="response.contact"
          :to="`/admin/contacts/${response.contact.id}`"
          class="text-link"
        >
          {{ response.contact.email }}
        </router-link>
      </AppInfoListItem>
      <AppInfoListItem
        :name="t('calloutResponse.data.createdAt')"
        :value="formatLocale(response.createdAt, 'Pp')"
      />
    </AppInfoList>
    <div class="callout-form mt-10 border-t border-primary-40 pt-10 text-lg">
      <Form
        :form="callout.formSchema"
        :submission="{ data: response.answers }"
        :options="{ readOnly: true }"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import {
  GetCalloutDataWith,
  GetCalloutResponseDataWith,
} from '../../../../../../utils/api/api.interface';
import { fetchResponse } from '../../../../../../utils/api/callout';
import { Form } from 'vue-formio';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../../../components/AppHeading.vue';
import AppInfoList from '../../../../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../../../../components/AppInfoListItem.vue';
import { formatLocale } from '../../../../../../utils/dates/locale-date-formats';
import AppSubHeading from '../../../../../../components/AppSubHeading.vue';

const props = defineProps<{
  rid: string;
  callout: GetCalloutDataWith<'form'>;
}>();

const { t } = useI18n();

const response = ref<GetCalloutResponseDataWith<'answers' | 'contact'>>();

onBeforeMount(async () => {
  response.value = await fetchResponse(props.callout.slug, props.rid, [
    'answers',
    'contact',
  ]);
});
</script>
