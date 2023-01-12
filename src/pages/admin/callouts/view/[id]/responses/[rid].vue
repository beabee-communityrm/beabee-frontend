<route lang="yaml">
name: adminCalloutViewResponsesItem
meta:
  pageTitle: menu.callouts
  role: admin
</route>
<template>
  <div v-if="response" class="md:max-w-2xl">
    <div class="mb-2 flex justify-between">
      <AppButton
        :disabled="!prevResponse"
        :to="
          prevResponse &&
          `/admin/callouts/view/${callout.slug}/responses/${prevResponse.id}`
        "
        icon="caret-left"
        size="xs"
      >
        Previous
      </AppButton>
      <AppButton
        :disabled="!nextResponse"
        :to="
          nextResponse &&
          `/admin/callouts/view/${callout.slug}/responses/${nextResponse.id}`
        "
        ricon="caret-right"
        size="xs"
      >
        Next
      </AppButton>
    </div>
    <AppHeading class="mb-4">
      {{ t('calloutResponsesPage.responseId', { id: response.id }) }}
    </AppHeading>
    <AppSubHeading>{{ t('calloutResponsesPage.overview') }}</AppSubHeading>
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
        :key="response.id /*Form doesn't respect reactivity */"
        :form="callout.formSchema"
        :submission="{ data: response.answers }"
        :options="{ readOnly: true }"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import {
  GetCalloutDataWith,
  GetCalloutResponseData,
  GetCalloutResponseDataWith,
} from '../../../../../../utils/api/api.interface';
import {
  fetchResponse,
  fetchResponses,
} from '../../../../../../utils/api/callout';
import { Form } from 'vue-formio';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../../../components/AppHeading.vue';
import AppInfoList from '../../../../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../../../../components/AppInfoListItem.vue';
import { formatLocale } from '../../../../../../utils/dates/locale-date-formats';
import AppSubHeading from '../../../../../../components/AppSubHeading.vue';
import AppButton from '../../../../../../components/forms/AppButton.vue';

const props = defineProps<{
  rid: string;
  callout: GetCalloutDataWith<'form'>;
}>();

const { t } = useI18n();

const response = ref<GetCalloutResponseDataWith<'answers' | 'contact'>>();
const prevResponse = ref<GetCalloutResponseData>();
const nextResponse = ref<GetCalloutResponseData>();

watchEffect(async () => {
  response.value = await fetchResponse(props.callout.slug, props.rid, [
    'answers',
    'contact',
  ]);

  const olderResponses = await fetchResponses(props.callout.slug, {
    limit: 1,
    sort: 'createdAt',
    order: 'DESC',
    rules: {
      condition: 'AND',
      rules: [
        {
          field: 'createdAt',
          operator: 'less',
          value: [response.value.createdAt.toISOString()],
        },
      ],
    },
  });

  prevResponse.value =
    olderResponses.count > 0 ? olderResponses.items[0] : undefined;

  const newerResponses = await fetchResponses(props.callout.slug, {
    limit: 1,
    sort: 'createdAt',
    order: 'ASC',
    rules: {
      condition: 'AND',
      rules: [
        {
          field: 'createdAt',
          operator: 'greater',
          value: [response.value.createdAt.toISOString()],
        },
      ],
    },
  });

  nextResponse.value =
    newerResponses.count > 0 ? newerResponses.items[0] : undefined;
});
</script>
