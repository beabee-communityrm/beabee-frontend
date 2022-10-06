<template>
  <div>
    <div class="mb-8 grid grid-cols-2 gap-8">
      <div>
        <AppHeading class="mb-5">{{ stepT('bigTitle') }}</AppHeading>
        <p>{{ stepT('text') }}</p>
      </div>
    </div>

    <EmailEditor
      v-if="welcomeEmail !== undefined"
      :label="stepT('welcomeEmail')"
      :email="welcomeEmail"
      :footer="emailFooter"
    />

    <EmailEditor
      v-if="cancellationEmail !== undefined"
      :label="stepT('cancellationEmail')"
      :email="cancellationEmail"
      :footer="emailFooter"
    />
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../AppHeading.vue';
import { GetEmailData } from '../../../../../utils/api/api.interface';
import { fetchContent } from '../../../../../utils/api/content';
import { fetchEmail, updateEmail } from '../../../../../utils/api/email';
import { MembershipBuilderEmitter } from '../membership-builder.interface';
import EmailEditor from '../EmailEditor.vue';
import { isRequestError } from '../../../../../utils/api';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  emitter: MembershipBuilderEmitter;
}>();

const { t } = useI18n();
const stepT = (key: string) => t('membershipBuilder.steps.emails.' + key);

const welcomeEmail = ref<GetEmailData | false>();
const cancellationEmail = ref<GetEmailData | false>();
const emailFooter = ref('');

async function handleUpdate() {
  if (welcomeEmail.value) {
    await updateEmail('welcome', welcomeEmail.value);
  }
  if (cancellationEmail.value) {
    await updateEmail('cancelled-contribution', cancellationEmail.value);
  }

  props.emitter.emit('updated');
}

const validation = useVuelidate();
watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});

async function loadEmail(id: string): Promise<GetEmailData | false> {
  try {
    return await fetchEmail(id);
  } catch (err) {
    if (isRequestError(err, 'external-email-template')) {
      return false;
    }
    return { body: '', subject: '' };
  }
}

onBeforeMount(async () => {
  props.emitter.on('update', handleUpdate);
  welcomeEmail.value = await loadEmail('welcome');
  cancellationEmail.value = await loadEmail('cancelled-contribution');

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
