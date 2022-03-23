<template>
  <AppHeading class="mb-3"> Visibility settings </AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppHeading>Who can take part?</AppHeading>
      <AppRadioGroup
        name="whoCanTakePart"
        :options="['Members only', 'Everyone']"
        v-model="dataProxy.whoCanTakePart"
      />
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      Callouts can be presented to <b>Everyone</b> or restricted to
      <b>Members only</b> participation.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppHeading>Allow anonymous responses?</AppHeading>
      <AppRadioGroup
        name="allowAnonymousResponses"
        :options="[
          'Yes, contact info is optional',
          'No, require contact details',
        ]"
        v-model="dataProxy.allowAnonymousResponses"
      />
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      You can allow <b>anonymous responses</b>, in which members can choose if
      they reveal their identity and contact details in their answers. Guests
      and anonymous users will be asked for their contact information if this
      field is set to No.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppHeading>Should it be visible in users' dashboards?</AppHeading>
      <AppRadioGroup
        name="showOnUserDashboards"
        :options="['Yes', 'No, accessed through link only']"
        v-model="dataProxy.showOnUserDashboards"
      />
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The callout can be set to <b>Hidden</b> to ensure it is not visible to
      users while you are still reviewing it before making it public.
    </p>
  </div>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppHeading
        >Should people be able to change their answers before the callout
        ends?</AppHeading
      >
      <AppRadioGroup
        name="usersCanEditAnswers"
        :options="['Yes', 'No, answers are final']"
        v-model="dataProxy.usersCanEditAnswers"
      />
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      If checked, the <b>Allow users to update their answers</b> field permits
      people to go back and edit their answers before the callout reaches its
      end date.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppRadioGroup from '../../../components/forms/AppRadioGroup.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{
  data: {
    whoCanTakePart: string;
    allowAnonymousResponses: string;
    showOnUserDashboards: string;
    usersCanEditAnswers: string;
  };
}>();

const isNotEmptyString = (s: string) => s.length > 0;

const dataProxy = ref(props.data);

watch(
  () =>
    isNotEmptyString(props.data.whoCanTakePart) &&
    isNotEmptyString(props.data.allowAnonymousResponses) &&
    isNotEmptyString(props.data.showOnUserDashboards) &&
    isNotEmptyString(props.data.usersCanEditAnswers),
  (valid) => emit('update:validated', valid)
);
</script>
