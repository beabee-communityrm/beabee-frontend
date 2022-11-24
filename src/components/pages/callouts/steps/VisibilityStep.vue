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
          [true, inputT('anonymous.opts.yes')],
          [false, inputT('anonymous.opts.no')],
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
    <AppFormSection :help="inputT('editable.help')">
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
import useVuelidate from '@vuelidate/core';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppRadioGroup from '../../../forms/AppRadioGroup.vue';
import AppFormSection from '../../../forms/AppFormSection.vue';
import { VisibilityStepProps } from '../callouts.interface';

const emit = defineEmits(['update:error', 'update:validated']);
defineProps<{ data: VisibilityStepProps }>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.visibility.inputs.' + key);

const validate = useVuelidate();

watch(
  validate,
  () => {
    emit('update:error', validate.value.$errors.length > 0);
    emit('update:validated', !validate.value.$invalid);
  },
  { immediate: true }
);
</script>
