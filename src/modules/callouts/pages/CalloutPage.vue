<template>
  <div v-if="callout" class="md:max-w-2xl">
    <h1 class="text-4xl font-bold mb-8">{{ callout.title }}</h1>
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center text-sm text-body-40 font-semibold">
        <div>
          <div class="flex flex-col">
            <AppItemStatus :status="callout.status" />
            <span
              v-if="callout.status === ItemStatus.Scheduled && callout.starts"
            >
              {{
                t('callout.status.startsIn', {
                  distance: formatDistanceLocale(callout.starts, new Date()),
                })
              }}
            </span>
            <span
              v-else-if="callout.status === ItemStatus.Open && callout.expires"
            >
              {{
                t('callout.status.endsIn', {
                  distance: formatDistanceLocale(callout.expires, new Date()),
                })
              }}
            </span>
            <span
              v-else-if="callout.status === ItemStatus.Ended && callout.expires"
            >
              {{
                t('callout.status.endedOn', {
                  date: formatLocale(callout.expires, 'P'),
                })
              }}
            </span>
          </div>
        </div>
        <div v-if="hasResponded" class="border-body-40 border-l ml-3 pl-3 w-32">
          {{ t('callout.youResponded') }}
        </div>
      </div>
      <AppButton
        v-if="callout.status === ItemStatus.Open"
        icon="share"
        variant="primaryOutlined"
        >{{ t('common.share') }}</AppButton
      >
    </div>
    <div>
      <div class="relative mb-6 pb-[56.25%]">
        <img class="absolute w-full h-full object-cover" :src="callout.image" />
      </div>
      <div
        class="text-lg content-message"
        v-html="callout.templateSchema.intro"
      />
      <div
        v-if="callout.status === ItemStatus.Open || hasResponded"
        class="callout-form mt-10 pt-10 border-primary-40 border-t"
      >
        <Form
          :form="callout.templateSchema.formSchema"
          :submission="
            !callout.allowMultiple && hasResponded && responses
              ? { data: responses.items[0].answers }
              : undefined
          "
          :options="{ readOnly: hasResponded && !callout.allowUpdate }"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { Form } from 'vue-formio';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import {
  GetCalloutResponseData,
  GetMoreCalloutData,
  ItemStatus,
  Paginated,
} from '../../../utils/api/api.interface';
import { fetchCallout, fetchResponses } from '../../../utils/api/callout';
import {
  formatLocale,
  formatDistanceLocale,
} from '../../../utils/dates/locale-date-formats';
import AppButton from '../../../components/forms/AppButton.vue';
import AppItemStatus from '../../../components/AppItemStatus.vue';

const route = useRoute();

const { t } = useI18n();

const callout = ref<GetMoreCalloutData>();
const responses = ref<Paginated<GetCalloutResponseData>>();

const hasResponded = computed(
  () => !!responses.value && responses.value.count > 0
);

onBeforeMount(async () => {
  const calloutId = route.params.id as string;
  callout.value = await fetchCallout(calloutId);
  responses.value = await fetchResponses(calloutId, {
    rules: {
      condition: 'AND',
      rules: [{ field: 'member', operator: 'equal', value: 'me' }],
    },
    sort: 'createdAt',
    order: 'DESC',
  });
});
</script>
