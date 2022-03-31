<template>
  <AppHeading class="mb-3">{{
    t('createCallout.steps.visibility.title')
  }}</AppHeading>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <p class="font-semibold mb-1">{{ inputT('who.label') }}</p>
      <AppRadioGroup
        v-model="dataProxy.whoCanTakePart"
        name="whoCanTakePart"
        :options="[
          ['members', inputT('who.opts.members')],
          ['everyone', inputT('who.opts.everyone')],
        ]"
      />
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('who.help')"
    />
  </div>
  <div
    v-if="dataProxy.whoCanTakePart === 'everyone'"
    class="grid grid-cols-2 gap-6 mt-5"
  >
    <div class="col-span-1">
      <p class="font-semibold mb-1">{{ inputT('anonymous.label') }}</p>
      <AppRadioGroup
        v-model="dataProxy.allowAnonymousResponses"
        name="allowAnonymousResponses"
        :options="[
          [true, inputT('anonymous.opts.yes')],
          [false, inputT('anonymous.opts.no')],
        ]"
      />
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('anonymous.help')"
    />
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <p class="font-semibold mb-1">{{ inputT('visible.label') }}</p>
      <AppRadioGroup
        v-model="dataProxy.showOnUserDashboards"
        name="showOnUserDashboards"
        :options="[
          [true, inputT('visible.opts.yes')],
          [false, inputT('visible.opts.no')],
        ]"
      />
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('visible.help')"
    />
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <p class="font-semibold mb-1">{{ inputT('editable.label') }}</p>
      <AppRadioGroup
        v-model="dataProxy.usersCanEditAnswers"
        name="usersCanEditAnswers"
        :options="[
          [true, inputT('editable.opts.yes')],
          [false, inputT('editable.opts.no')],
        ]"
      />
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('editable.help')"
    />
  </div>
</template>

<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import { onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import AppRadioGroup from '../../../components/forms/AppRadioGroup.vue';
import { VisibilityStepProps } from '../create-callout.interface';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{ data: VisibilityStepProps }>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.visibility.inputs.' + key);

const dataProxy = ref(props.data);

const validate = useVuelidate(
  {
    whoCanTakePart: {
      required: helpers.withMessage('Required', required),
    },
    allowAnonymousResponses: {
      required: helpers.withMessage('Required', required),
    },
    showOnUserDashboards: {
      required: helpers.withMessage('Required', required),
    },
  },
  dataProxy
);

watch(validate, () => emit('update:validated', !validate.value.$invalid));
onMounted(() => validate.value.$touch());
</script>
