<template>
  <div class="mb-8 grid grid-cols-2 gap-8">
    <div>
      <AppHeading class="mb-5">{{ stepT('title') }}</AppHeading>
      <p>{{ stepT('text') }}</p>
    </div>
  </div>
  <div v-if="setupContent" class="grid grid-cols-2 gap-8">
    <div>
      <div class="mb-4">
        <AppInput
          v-model="setupContent.welcome"
          :label="stepT('welcomeMessage')"
        />
      </div>

      <AppCheckbox
        v-model="setupContent.showMailOptIn"
        :label="stepT('showMailOptIn')"
        class="mb-4 font-semibold"
      />

      <template v-if="setupContent.showMailOptIn">
        <div class="mb-4">
          <AppInput
            v-model="setupContent.mailTitle"
            :label="stepT('heading')"
            required
          />
        </div>
        <div class="mb-4">
          <AppTextArea
            v-model="setupContent.mailText"
            :label="stepT('subheading')"
            required
          />
        </div>
        <div class="mb-4">
          <AppInput
            v-model="setupContent.mailOptIn"
            :label="stepT('checkboxLabel')"
            required
          />
        </div>
      </template>

      <AppCheckbox
        v-model="setupContent.showNewsletterOptIn"
        :label="stepT('showNewsletterOptIn')"
        class="mb-4 font-semibold"
      />

      <template v-if="setupContent.showNewsletterOptIn">
        <div class="mb-4">
          <AppInput
            v-model="setupContent.newsletterTitle"
            :label="stepT('heading')"
            required
          />
        </div>
        <div class="mb-4">
          <AppTextArea
            v-model="setupContent.newsletterText"
            :label="stepT('subheading')"
            required
          />
        </div>
        <div class="mb-4">
          <AppInput
            v-model="setupContent.newsletterOptIn"
            :label="stepT('checkboxLabel')"
            required
          />
        </div>
      </template>
    </div>
    <div class="bg-cover bg-center p-4 pt-8">
      <AuthBox>
        <SetupForm :setup-content="setupContent" />
      </AuthBox>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { JoinSetupContent } from '../../../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../../../utils/api/content';
import AppInput from '../../../../forms/AppInput.vue';
import AppHeading from '../../../../AppHeading.vue';
import { useI18n } from 'vue-i18n';
import AppCheckbox from '../../../../forms/AppCheckbox.vue';
import AppTextArea from '../../../../forms/AppTextArea.vue';
import SetupForm from '../../../join/SetupForm.vue';
import AuthBox from '../../../../AuthBox.vue';
import { MembershipBuilderEmitter } from '../membership-builder.interface';
import useVuelidate from '@vuelidate/core';

const emit = defineEmits(['update:error', 'update:validated']);

const props = defineProps<{
  emitter: MembershipBuilderEmitter;
}>();

const setupContent = ref<JoinSetupContent>();

const { t } = useI18n();

const stepT = (key: string) =>
  t('membershipBuilder.steps.accountConfirmation.' + key);

const validation = useVuelidate();

watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});

async function handleUpdate() {
  if (setupContent.value) {
    await updateContent('join/setup', setupContent.value);
  }

  props.emitter.emit('updated');
}

onBeforeMount(async () => {
  props.emitter.on('update', handleUpdate);
  setupContent.value = await fetchContent('join/setup');

  watch(
    setupContent,
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
