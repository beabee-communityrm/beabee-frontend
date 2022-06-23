<template>
  <form v-if="welcomeEmail && cancellationEmail" @submit.prevent="handleSubmit">
    <AppHeading class="mb-5">Welcome & goodbye emails</AppHeading>
    <div class="flex mb-8">
      <div class="flex-1">
        <AppSubHeading class="mb-4">Welcome email</AppSubHeading>
        <AppInput v-model="welcomeEmail.subject" label="Subject" class="mb-4" />
        <RichTextEditor v-model="welcomeEmail.body" label="Message" />
      </div>
      <div class="flex-1"></div>
    </div>

    <div class="flex">
      <div class="flex-1">
        <AppSubHeading class="mb-4">Cancellation email</AppSubHeading>
        <AppInput
          v-model="cancellationEmail.subject"
          label="Subject"
          class="mb-4"
        />
        <RichTextEditor v-model="cancellationEmail.body" label="Message" />
      </div>
      <div class="flex-1"></div>
    </div>
    <AppButton type="submit" variant="link" class="w-32">Save</AppButton>
  </form>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import AppHeading from '../../../../components/AppHeading.vue';
import AppSubHeading from '../../../../components/AppSubHeading.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import { GetEmailData } from '../../../../utils/api/api.interface';
import { fetchEmail } from '../../../../utils/api/email';

const welcomeEmail = ref<GetEmailData>();
const cancellationEmail = ref<GetEmailData>();

async function handleSubmit() {
  return;
}

onBeforeMount(async () => {
  welcomeEmail.value = await fetchEmail('welcome');
  cancellationEmail.value = await fetchEmail('cancelled-contribution');
});
</script>
