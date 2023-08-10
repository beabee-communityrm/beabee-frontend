<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <AppFormSection :help="inputT('who.help')">
      <AppRadioGroup
        v-model="data.whoCanTakePart"
        name="whoCanTakePart"
        :label="inputT('who.label')"
        :options="[
          ['members', inputT('who.opts.members')],
          ['everyone', inputT('who.opts.everyone')],
        ]"
        required
      />
    </AppFormSection>
    <AppFormSection
      v-if="data.whoCanTakePart === 'everyone'"
      :help="inputT('anonymous.help')"
    >
      <AppRadioGroup
        v-model="data.allowAnonymousResponses"
        name="allowAnonymousResponses"
        :label="inputT('anonymous.label')"
        :options="[
          ['none', inputT('anonymous.opts.none')],
          ['guests', inputT('anonymous.opts.guests')],
          ['all', inputT('anonymous.opts.all')],
        ]"
        required
      />
    </AppFormSection>
    <AppFormSection :help="inputT('visible.help')">
      <AppRadioGroup
        v-model="data.showOnUserDashboards"
        name="showOnUserDashboards"
        :label="inputT('visible.label')"
        :options="[
          [true, inputT('visible.opts.yes')],
          [false, inputT('visible.opts.no')],
        ]"
        required
      />
    </AppFormSection>
    <AppFormSection :help="inputT('multiple.help')">
      <AppRadioGroup
        v-model="data.multipleResponses"
        name="multipleResponses"
        :label="inputT('multiple.label')"
        :options="[
          [true, inputT('multiple.opts.yes')],
          [false, inputT('multiple.opts.no')],
        ]"
        required
      />
    </AppFormSection>
    <AppFormSection
      v-if="!data.multipleResponses"
      :help="inputT('editable.help')"
    >
      <AppRadioGroup
        v-model="data.usersCanEditAnswers"
        name="usersCanEditAnswers"
        :label="inputT('editable.label')"
        :options="[
          [true, inputT('editable.opts.yes')],
          [false, inputT('editable.opts.no')],
        ]"
        required
      />
    </AppFormSection>
  </div>
</template>

<script lang="ts" setup>
import { ItemStatus } from '@beabee/beabee-common';
import useVuelidate from '@vuelidate/core';
import { ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppRadioGroup from '../../../../forms/AppRadioGroup.vue';
import AppFormSection from '../../../../forms/AppFormSection.vue';
import { SettingsStepProps } from '../callouts.interface';
import { sameAs } from '@vuelidate/validators';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  data: SettingsStepProps;
  status: ItemStatus | undefined;
  isActive: boolean;
}>();

const { t } = useI18n();
const inputT = (key: string) => t('createCallout.steps.settings.inputs.' + key);

// Force step to stay unvalidated until it is visited for new callouts
const hasVisited = ref(!!props.status);
watch(toRef(props, 'isActive'), (active) => (hasVisited.value ||= active));
const validation = useVuelidate(
  { v: { yes: sameAs(true) } },
  { v: hasVisited }
);

watch(
  validation,
  () => {
    emit('update:error', validation.value.$errors.length > 0);
    emit('update:validated', !validation.value.$invalid);
  },
  { immediate: true }
);
</script>
