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
        required
      />

      <AppCheckbox
        v-model="setupContent.showMailOptIn"
        :label="stepT('showMailOptIn')"
        class="font-semibold mb-4"
      />

      <template v-if="setupContent.showMailOptIn">
        <AppInput
          v-model="setupContent.mailTitle"
          :label="stepT('heading')"
          class="mb-4"
          required
        />
        <AppTextArea
          v-model="setupContent.mailText"
          :label="stepT('subheading')"
          class="mb-4"
        />
        <AppInput
          v-model="setupContent.mailOptIn"
          :label="stepT('checkboxLabel')"
          class="mb-4"
        />
      </template>

      <AppCheckbox
        v-model="setupContent.showNewsletterOptIn"
        :label="stepT('showNewsletterOptIn')"
        class="font-semibold mb-4"
      />

      <template v-if="setupContent.showNewsletterOptIn">
        <AppInput
          v-model="setupContent.newsletterTitle"
          :label="stepT('heading')"
          class="mb-4"
          required
        />
        <AppTextArea
          v-model="setupContent.newsletterText"
          :label="stepT('subheading')"
          class="mb-4"
        />
        <AppInput
          v-model="setupContent.newsletterOptIn"
          :label="stepT('checkboxLabel')"
          class="mb-4"
        />
      </template>
    </div>
    <div
      class="p-4 pt-8 bg-center bg-cover"
      :style="`background-image: url(${backgroundUrl})`"
    >
      <AuthBox>
        <SetupForm :setup-content="setupContent" />
      </AuthBox>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import {
  JoinContent,
  JoinSetupContent,
} from '../../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../../utils/api/content';
import AppInput from '../../../../components/forms/AppInput.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import AppHeading from '../../../../components/AppHeading.vue';
import AppLabel from '../../../../components/forms/AppLabel.vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../../components/forms/AppSelect.vue';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import AppCheckbox from '../../../../components/forms/AppCheckbox.vue';
import JoinForm from '../../../auth/join/components/JoinForm.vue';
import AppTextArea from '../../../../components/forms/AppTextArea.vue';
import SetupForm from '../../../auth/join/components/SetupForm.vue';
import AuthBox from '../../../auth/AuthBox.vue';
import AppImageUpload from '../../../../components/forms/AppImageUpload.vue';
import { generalContent } from '../../../../store';
import { MembershipBuilderEmitter } from '../../membership-builder.interface';

const props = defineProps<{
  emitter: MembershipBuilderEmitter;
}>();

const setupContent = ref<JoinSetupContent>();
const backgroundUrl = ref('');

const { n, t } = useI18n();

const stepT = (key: string) => t('membershipBuilder.steps.accountConfirmation.' + key);

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
