<template>
  <template v-if="welcomeEmail && cancellationEmail">
    <AppHeading class="mb-5">{{ stepT('bigTitle') }}</AppHeading>
    <p></p>
    <div class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <AppSubHeading class="mb-2">{{ stepT('welcomeEmail') }}</AppSubHeading>
        <p class="mb-4">{{ stepT('welcomeEmailText') }}</p>
        <AppInput v-model="welcomeEmail.subject" label="Subject" class="mb-4" />
        <RichTextEditor v-model="welcomeEmail.body" label="Message" />
      </div>
      <div>
        <EmailPreview :body="welcomeEmail.body" :footer="emailFooter" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-8">
      <div>
        <AppSubHeading class="mb-2">{{
          stepT('cancellationEmail')
        }}</AppSubHeading>
        <p class="mb-4">{{ stepT('cancellationEmailText') }}</p>
        <AppInput
          v-model="cancellationEmail.subject"
          label="Subject"
          class="mb-4"
        />
        <RichTextEditor v-model="cancellationEmail.body" label="Message" />
      </div>
      <div>
        <EmailPreview :body="cancellationEmail.body" :footer="emailFooter" />
      </div>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../components/AppHeading.vue';
import AppSubHeading from '../../../../components/AppSubHeading.vue';
import AppInput from '../../../../components/forms/AppInput.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import { GetEmailData } from '../../../../utils/api/api.interface';
import { fetchContent } from '../../../../utils/api/content';
import { fetchEmail, updateEmail } from '../../../../utils/api/email';
import { MembershipBuilderEmitter } from '../../membership-builder.interface';
import EmailPreview from '../EmailPreview.vue';

const props = defineProps<{
  emitter: MembershipBuilderEmitter;
}>();

const { t } = useI18n();
const stepT = (key: string) => t('membershipBuilder.steps.emails.' + key);

const welcomeEmail = ref<GetEmailData>();
const cancellationEmail = ref<GetEmailData>();
const emailFooter = ref('');

async function handleUpdate() {
  if (welcomeEmail.value && cancellationEmail.value) {
    await Promise.all([
      await updateEmail('welcome', welcomeEmail.value),
      await updateEmail('cancelled-contribution', cancellationEmail.value),
    ]);
  }

  props.emitter.emit('updated');
}

onBeforeMount(async () => {
  props.emitter.on('update', handleUpdate);
  welcomeEmail.value = await fetchEmail('welcome');
  cancellationEmail.value = await fetchEmail('cancelled-contribution');
  emailFooter.value = (await fetchContent('email')).footer;

  watch(
    [welcomeEmail, cancellationEmail],
    () => {
      props.emitter.emit('dirty');
    },
    { deep: true }
  );
});

onBeforeUnmount(() => {
  props.emitter.off('update', handleUpdate);
});
</script>
