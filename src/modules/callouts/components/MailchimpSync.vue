<template>
  <AppHeading class="mb-3">Sync with Mailchimp (optional)</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <p class="font-semibold">Use Mailchimp sync</p>
      <AppRadioGroup
        v-model="dataProxy.useMailchimpSync"
        name="useMailchimpSync"
        :options="[
          [true, 'Yes'],
          [false, 'No'],
        ]"
      />
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      You can connect your callout to Mailchimp to trigger automatic emails and
      cross data from the answers with your newsletter subscriber profiles.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6" v-show="dataProxy.useMailchimpSync">
    <p>
      To do so select which fields of the callout you want to sync with
      Mailchimp, making use of a feature called Merge Tags.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppRadioGroup from '../../../components/forms/AppRadioGroup.vue';
import { MailchimpSyncStepProps } from '../create-callout.interface';

const emit = defineEmits(['update:validated']);
const props = defineProps<{ data: MailchimpSyncStepProps }>();
const dataProxy = ref(props.data);

onMounted(() => emit('update:validated', true));
</script>
