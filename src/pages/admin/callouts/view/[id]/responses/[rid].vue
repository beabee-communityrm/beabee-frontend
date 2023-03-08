<route lang="yaml">
name: adminCalloutViewResponsesItem
meta:
  pageTitle: menu.callouts
  role: admin
</route>
<template>
  <div v-if="response" class="md:max-w-2xl">
    <div class="mb-4 flex items-center justify-end gap-2 text-sm">
      <span>Response x of x</span>
      <AppButtonGroup>
        <AppButton
          type="button"
          variant="primaryOutlined"
          icon="caret-left"
          :disabled="!prevResponse"
          :to="
            prevResponse &&
            `/admin/callouts/view/${callout.slug}/responses/${prevResponse.id}`
          "
        />
        <AppButton
          type="button"
          variant="primaryOutlined"
          icon="caret-right"
          :disabled="!nextResponse"
          :to="
            nextResponse &&
            `/admin/callouts/view/${callout.slug}/responses/${nextResponse.id}`
          "
        />
      </AppButtonGroup>
    </div>
    <AppHeading class="mb-4">
      {{ t('calloutResponsesPage.responseNo', { no: response.number }) }}
    </AppHeading>
    <AppInfoList class="mb-4">
      <AppInfoListItem :name="t('calloutResponse.data.contact')">
        <router-link
          v-if="response.contact"
          :to="`/admin/contacts/${response.contact.id}`"
          class="text-link"
        >
          {{ response.contact.displayName }}
        </router-link>
      </AppInfoListItem>
      <AppInfoListItem
        :name="t('calloutResponse.data.createdAt')"
        :value="formatLocale(response.createdAt, 'Pp')"
      />
      <AppInfoListItem
        :name="t('calloutResponse.data.bucket')"
        :value="
          buckets.find((bucket) => bucket.id === response!.bucket)?.label ||
          response.bucket
        "
      />
      <AppInfoListItem :name="t('calloutResponse.data.tags')">
        <AppTag v-for="tag in response.tags" :key="tag.id" :tag="tag.name" />
      </AppInfoListItem>
    </AppInfoList>
    <div class="flex gap-2">
      <MoveBucket :current-bucket="response.bucket" size="sm">
        Move bucket
      </MoveBucket>
      <ToggleTag
        :tag-items="tagItems"
        :selected-tags="response.tags.map((t) => t.id)"
        :manage-url="`/admin/callouts/view/${callout.slug}/responses/tags`"
        size="sm"
      >
        Toggle tags
      </ToggleTag>
    </div>
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
import { computed, onBeforeMount, ref, watchEffect } from 'vue';
import {
  GetCalloutDataWith,
  GetCalloutResponseData,
  GetCalloutResponseDataWith,
} from '../../../../../../utils/api/api.interface';
import {
  fetchResponse,
  fetchResponses,
  fetchTags,
} from '../../../../../../utils/api/callout';
import { Form } from 'vue-formio';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../../../components/AppHeading.vue';
import AppInfoList from '../../../../../../components/AppInfoList.vue';
import AppInfoListItem from '../../../../../../components/AppInfoListItem.vue';
import { formatLocale } from '../../../../../../utils/dates/locale-date-formats';
import AppButton from '../../../../../../components/button/AppButton.vue';
import AppButtonGroup from '../../../../../../components/button/AppButtonGroup.vue';
import { addBreadcrumb } from '../../../../../../store/breadcrumb';
import MoveBucket from '../../../../../../components/pages/admin/callouts/MoveBucket.vue';
import ToggleTag from '../../../../../../components/pages/admin/callouts/ToggleTag.vue';
import { buckets } from '../../../../../../components/pages/admin/callouts/callouts.interface';
import AppTag from '../../../../../../components/AppTag.vue';

const props = defineProps<{
  rid: string;
  callout: GetCalloutDataWith<'form'>;
}>();

const { t } = useI18n();

addBreadcrumb(computed(() => [{ title: props.rid }]));

const response =
  ref<GetCalloutResponseDataWith<'answers' | 'contact' | 'tags'>>();
const prevResponse = ref<GetCalloutResponseData>();
const nextResponse = ref<GetCalloutResponseData>();

const tagItems = ref<{ id: string; label: string }[]>([]);

onBeforeMount(async () => {
  const tags = await fetchTags(props.callout.slug);
  tagItems.value = tags.map((tag) => ({ id: tag.id, label: tag.name }));
});

watchEffect(async () => {
  const newResponse = await fetchResponse(props.callout.slug, props.rid, [
    'answers',
    'contact',
    'tags',
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
          value: [newResponse.createdAt.toISOString()],
        },
      ],
    },
  });

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
          value: [newResponse.createdAt.toISOString()],
        },
      ],
    },
  });

  response.value = newResponse;
  prevResponse.value =
    olderResponses.count > 0 ? olderResponses.items[0] : undefined;
  nextResponse.value =
    newerResponses.count > 0 ? newerResponses.items[0] : undefined;
});
</script>
