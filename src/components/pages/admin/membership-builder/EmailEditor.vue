<template>
  <div class="mb-8 grid grid-cols-2 gap-8">
    <div>
      <AppSubHeading class="mb-4">{{ label }}</AppSubHeading>
      <template v-if="email">
        <div class="mb-4">
          <AppInput v-model="email.subject" label="Subject" required />
        </div>
        <RichTextEditor v-model="email.body" label="Message" required />
      </template>
      <AppAlert v-else variant="warning">
        This email is managed by your email provider, you can't edit it here
      </AppAlert>
    </div>
    <div v-if="email">
      <div class="content-message bg-white p-4 shadow" v-html="emailBody" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import { currentUser } from '../../../../store';
import AppSubHeading from '../../../AppSubHeading.vue';
import AppInput from '../../../forms/AppInput.vue';
import RichTextEditor from '../../../rte/RichTextEditor.vue';
import AppAlert from '../../../AppAlert.vue';

const props = defineProps<{
  label: string;
  // Should be GetEmailData | false but compiler doesn't correctly convert type to Vue props
  email: { body: string; subject: string } | false;
  footer: string;
}>();

// Allows us to mutate the props directly
const email = ref(props.email);

const emailBody = computed(
  () =>
    props.email &&
    props.email.body
      .replace('*|FNAME|*', currentUser.value?.firstname || '')
      .replace('*|LNAME|*', currentUser.value?.lastname || '') + props.footer
);
</script>
