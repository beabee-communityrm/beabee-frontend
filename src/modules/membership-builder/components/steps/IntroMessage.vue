<template>
  <div>
    <div class="grid grid-cols-2 gap-8">
      <div>
        <AppHeading class="mb-5">{{ stepT('title') }}</AppHeading>
        <p class="mb-8">{{ stepT('text') }}</p>
      </div>
    </div>

    <template v-if="profileContent">
      <AppCheckbox
        v-model="showIntroMessage"
        :label="stepT('showWelcomeMessage')"
        class="font-semibold mb-4"
      />

      <div v-if="showIntroMessage" class="grid grid-cols-2 gap-8">
        <div>
          <RichTextEditor
            v-model="validation.profileContent.introMessage.$model"
            :label="stepT('message')"
            class="mb-4"
            required
            :error-message="
              validation.profileContent.introMessage.$errors[0]?.$message
            "
          />
        </div>
        <div>
          <WelcomeMessage
            :first-name="currentUser?.firstname || ''"
            :last-name="currentUser?.lastname || ''"
            :text="profileContent.introMessage"
            small
          />
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../../components/AppHeading.vue';
import AppCheckbox from '../../../../components/forms/AppCheckbox.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import { ProfileContent } from '../../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../../utils/api/content';
import WelcomeMessage from '../../../../components/welcome-message/WelcomeMessage.vue';
import { currentUser } from '../../../../store';
import { MembershipBuilderEmitter } from '../../membership-builder.interface';
import useVuelidate from '@vuelidate/core';
import { requiredIf } from '@vuelidate/validators';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  emitter: MembershipBuilderEmitter;
}>();

const { t } = useI18n();
const stepT = (key: string) => t('membershipBuilder.steps.intro.' + key);

const profileContent = ref<ProfileContent>();
const showIntroMessage = ref(false);

const rules = computed(() => ({
  profileContent: {
    introMessage: {
      required: requiredIf(showIntroMessage.value),
    },
  },
}));
const validation = useVuelidate(rules, { profileContent });
watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});

async function handleUpdate() {
  if (profileContent.value) {
    await updateContent('profile', {
      ...profileContent.value,
      introMessage: showIntroMessage.value
        ? profileContent.value.introMessage
        : '',
    });
  }
  props.emitter.emit('updated');
}

onBeforeMount(async () => {
  props.emitter.on('update', handleUpdate);
  profileContent.value = await fetchContent('profile');
  showIntroMessage.value = !!profileContent.value.introMessage;

  watch(
    [profileContent, showIntroMessage],
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
