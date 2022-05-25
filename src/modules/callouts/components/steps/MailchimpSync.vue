<template>
  <div>
    <div class="grid grid-cols-2 gap-6">
      <div class="col-span-1">
        <AppRadioGroup
          v-model="dataProxy.useMailchimpSync"
          name="useMailchimpSync"
          label="Use Mailchimp sync"
          :options="[
            [true, 'Yes'],
            [false, 'No'],
          ]"
        />
      </div>
      <p class="col-span-1 text-sm text-grey mt-6">
        You can connect your callout to Mailchimp to trigger automatic emails
        and cross data from the answers with your newsletter subscriber
        profiles.
      </p>
    </div>
    <div
      class="grid grid-cols-2 gap-6 mt-3"
      v-show="dataProxy.useMailchimpSync"
    >
      <div class="col-span-1">
        <p>
          <b>Select the fields</b> you want to sync with Mailchimp, making use
          of a feature called Merge Tags.
        </p>

        <div class="flex flex-col md:flex-row items-center">
          <AppSelect
            v-model="foo"
            :items="[
              { id: '1', label: '-' },
              { id: '2', label: 'age-group' },
            ]"
          />
          <span class="ml-3 mr-2">
            <font-awesome-icon icon="link" />
          </span>
          <AppSelect
            v-model="foo"
            :items="[
              { id: '1', label: '-' },
              { id: '2', label: 'mailchimp-age-group' },
            ]"
          />
        </div>
      </div>
    </div>
    <div>
      <div class="col-span-1">
        <h3>available segments</h3>
        <div v-for="segment in segments" class="flex flex-row justify-between">
          <div>
            <b>{{ segment.name }}</b>
          </div>
          <div>{{ segment.memberCount }}</div>
          <div>{{ segment.newsletterTag }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeMount, ref } from 'vue';
import AppRadioGroup from '../../../../components/forms/AppRadioGroup.vue';
import { MailchimpSyncStepProps } from '../../create-callout.interface';
import AppSelect from '../../../../components/forms/AppSelect.vue';
import { fetchSegments } from '../../../../utils/api/segments';
import { GetSegmentData } from '../../../../utils/api/api.interface';

const emit = defineEmits(['update:validated']);
const props = defineProps<{ data: MailchimpSyncStepProps }>();
const dataProxy = ref(props.data);

const segments = ref<GetSegmentData[]>([]);

const foo = '';
onMounted(() => emit('update:validated', true));

onBeforeMount(async () => {
  segments.value = await fetchSegments();
});
</script>
