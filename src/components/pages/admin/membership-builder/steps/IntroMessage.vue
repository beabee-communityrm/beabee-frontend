<template>
  <div>
    <div class="grid grid-cols-2 gap-8">
      <div>
        <AppHeading class="mb-5">{{ stepT('title') }}</AppHeading>
        <p class="mb-8">{{ stepT('text') }}</p>
      </div>
    </div>

    <AppCheckbox
      v-model="showIntroMessage"
      :label="stepT('showWelcomeMessage')"
      class="mb-4 font-semibold"
    />

    <div v-if="showIntroMessage" class="grid grid-cols-2 gap-8">
      <div>
        <RichTextEditor
          v-model="introMessage"
          :label="stepT('message')"
          class="mb-4"
          required
        />
      </div>
      <div>
        <WelcomeMessage
          :first-name="currentUser?.firstname || ''"
          :last-name="currentUser?.lastname || ''"
          :text="introMessage"
          small
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../AppHeading.vue';
import AppCheckbox from '../../../../forms/AppCheckbox.vue';
import RichTextEditor from '../../../../rte/RichTextEditor.vue';
import { fetchContent, updateContent } from '../../../../../utils/api/content';
import WelcomeMessage from '../../../../welcome-message/WelcomeMessage.vue';
import { currentUser } from '../../../../../store';
import { MembershipBuilderEmitter } from '../membership-builder.interface';
import useVuelidate from '@vuelidate/core';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  emitter: MembershipBuilderEmitter;
}>();

const { t } = useI18n();
const stepT = (key: string) => t('membershipBuilder.steps.intro.' + key);

const introMessage = ref('');
const showIntroMessage = ref(false);

const validation = useVuelidate();
watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});

async function handleUpdate() {
  await updateContent('profile', {
    introMessage: showIntroMessage.value ? introMessage.value : '',
  });
  props.emitter.emit('updated');
}

onBeforeMount(async () => {
  props.emitter.on('update', handleUpdate);
  introMessage.value = (await fetchContent('profile')).introMessage;
  showIntroMessage.value = !!introMessage.value;

  watch(
    [introMessage, showIntroMessage],
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
