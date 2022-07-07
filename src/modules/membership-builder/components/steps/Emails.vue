<template>
  <div>
    <div class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <AppHeading class="mb-5">{{ stepT('bigTitle') }}</AppHeading>
        <p>{{ stepT('text') }}</p>
      </div>
    </div>

    <div v-if="welcomeEmail" class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <AppSubHeading class="mb-4">{{ stepT('welcomeEmail') }}</AppSubHeading>
        <div class="mb-4">
          <AppInput
            v-model="welcomeEmail.subject"
            label="Subject"
            :error-message="
              validation.welcomeEmail.subject.$errors[0]?.$message
            "
            required
            @blur="validation.welcomeEmail.subject.$touch"
          />
        </div>
        <RichTextEditor
          v-model="welcomeEmail.body"
          label="Message"
          :error-message="validation.welcomeEmail.body.$errors[0]?.$message"
          required
          @blur="validation.welcomeEmail.body.$touch"
        />
      </div>
      <div>
        <EmailPreview :body="welcomeEmail.body" :footer="emailFooter" />
      </div>
    </div>

    <div v-if="cancellationEmail" class="grid grid-cols-2 gap-8">
      <div>
        <AppSubHeading class="mb-4">{{
          stepT('cancellationEmail')
        }}</AppSubHeading>
        <div class="mb-4">
          <AppInput
            v-model="cancellationEmail.subject"
            label="Subject"
            :error-message="
              validation.cancellationEmail.subject.$errors[0]?.$message
            "
            required
            @blur="validation.cancellationEmail.subject.$touch"
          />
        </div>
        <RichTextEditor
          v-model="cancellationEmail.body"
          label="Message"
          :error-message="
            validation.cancellationEmail.body.$errors[0]?.$message
          "
          required
          @blur="validation.cancellationEmail.body.$touch"
        />
      </div>
      <div>
        <EmailPreview :body="cancellationEmail.body" :footer="emailFooter" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
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

const emit = defineEmits(['update:error', 'update:validated']);
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

const rules = {
  welcomeEmail: {
    subject: { required },
    body: { required },
  },
  cancellationEmail: {
    subject: { required },
    body: { required },
  },
};
const validation = useVuelidate(rules, { welcomeEmail, cancellationEmail });
watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});

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
