<template>
  <div class="grid grid-cols-2 gap-8 mb-8">
    <div>
      <AppHeading class="mb-5">{{ stepT('title') }}</AppHeading>
      <p>{{ stepT('text') }}</p>
    </div>
  </div>
  <div v-if="setupContent" class="grid grid-cols-2 gap-8">
    <div>
      <AppInput
        v-model="setupContent.welcome"
        class="mb-4"
        :label="stepT('welcomeMessage')"
      />

      <AppCheckbox
        v-model="setupContent.showMailOptIn"
        :label="stepT('showMailOptIn')"
        class="font-semibold mb-4"
      />

      <template v-if="setupContent.showMailOptIn">
        <AppInput
          v-model="validation.setupContent.mailTitle.$model"
          :label="stepT('heading')"
          class="mb-4"
          required
          :error-message="
            validation.setupContent.mailTitle.$errors[0]?.$message
          "
        />
        <AppTextArea
          v-model="validation.setupContent.mailText.$model"
          :label="stepT('subheading')"
          class="mb-4"
          required
          :error-message="validation.setupContent.mailText.$errors[0]?.$message"
        />
        <AppInput
          v-model="validation.setupContent.mailOptIn.$model"
          :label="stepT('checkboxLabel')"
          class="mb-4"
          required
          :error-message="
            validation.setupContent.mailOptIn.$errors[0]?.$message
          "
        />
      </template>

      <AppCheckbox
        v-model="setupContent.showNewsletterOptIn"
        :label="stepT('showNewsletterOptIn')"
        class="font-semibold mb-4"
      />

      <template v-if="setupContent.showNewsletterOptIn">
        <AppInput
          v-model="validation.setupContent.newsletterTitle.$model"
          :label="stepT('heading')"
          class="mb-4"
          required
          :error-message="
            validation.setupContent.newsletterTitle.$errors[0]?.$message
          "
        />
        <AppTextArea
          v-model="validation.setupContent.newsletterText.$model"
          :label="stepT('subheading')"
          class="mb-4"
          required
          :error-message="
            validation.setupContent.newsletterText.$errors[0]?.$message
          "
        />
        <AppInput
          v-model="validation.setupContent.newsletterOptIn.$model"
          :label="stepT('checkboxLabel')"
          class="mb-4"
          required
          :error-message="
            validation.setupContent.newsletterOptIn.$errors[0]?.$message
          "
        />
      </template>
    </div>
    <div class="p-4 pt-8 bg-center bg-cover">
      <AuthBox>
        <SetupForm :setup-content="setupContent" />
      </AuthBox>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { JoinSetupContent } from '../../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../../utils/api/content';
import AppInput from '../../../../components/forms/AppInput.vue';
import AppHeading from '../../../../components/AppHeading.vue';
import { useI18n } from 'vue-i18n';
import AppCheckbox from '../../../../components/forms/AppCheckbox.vue';
import AppTextArea from '../../../../components/forms/AppTextArea.vue';
import SetupForm from '../../../auth/join/components/SetupForm.vue';
import AuthBox from '../../../auth/AuthBox.vue';
import { generalContent } from '../../../../store';
import { MembershipBuilderEmitter } from '../../membership-builder.interface';
import useVuelidate from '@vuelidate/core';
import { requiredIf } from '@vuelidate/validators';

const emit = defineEmits(['update:error', 'update:validated']);

const props = defineProps<{
  emitter: MembershipBuilderEmitter;
}>();

const setupContent = ref<JoinSetupContent>();
const backgroundUrl = ref('');

const { n, t } = useI18n();

const stepT = (key: string) =>
  t('membershipBuilder.steps.accountConfirmation.' + key);

const rules = computed(() => {
  const requiredIfNewsletter = requiredIf(
    !!setupContent.value?.showNewsletterOptIn
  );
  const requiredIfMail = requiredIf(!!setupContent.value?.showMailOptIn);
  return {
    setupContent: {
      newsletterText: { required: requiredIfNewsletter },
      newsletterOptIn: { required: requiredIfNewsletter },
      newsletterTitle: { required: requiredIfNewsletter },
      mailText: { required: requiredIfMail },
      mailOptIn: { required: requiredIfMail },
      mailTitle: { required: requiredIfMail },
    },
  };
});

const validation = useVuelidate(rules, { setupContent });

watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});

async function handleUpdate() {
  if (setupContent.value) {
    await Promise.all([
      updateContent('join/setup', setupContent.value),
      updateContent('general', {
        ...generalContent.value,
        backgroundUrl: backgroundUrl.value || '',
      }),
    ]);
  }

  props.emitter.emit('updated');
}

onBeforeMount(async () => {
  props.emitter.on('update', handleUpdate);
  setupContent.value = await fetchContent('join/setup');

  watch(
    [setupContent, backgroundUrl],
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
