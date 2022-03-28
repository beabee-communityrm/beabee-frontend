<template>
  <AppHeading class="mb-3">{{
    t('createCallout.steps.visibility.title')
  }}</AppHeading>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <p class="font-semibold mb-1">{{ inputT('who.label') }}</p>
      <AppRadioGroup
        name="whoCanTakePart"
        :options="[inputT('who.opts.members'), inputT('who.opts.everyone')]"
        v-model="dataProxy.whoCanTakePart"
      />
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('who.help')"
    />
  </div>
  <div class="grid grid-cols-2 gap-6 mt-5">
    <div class="col-span-1">
      <p class="font-semibold mb-1">{{ inputT('anonymous.label') }}</p>
      <AppRadioGroup
        name="allowAnonymousResponses"
        :options="[inputT('anonymous.opts.yes'), inputT('anonymous.opts.no')]"
        v-model="dataProxy.allowAnonymousResponses"
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
        name="showOnUserDashboards"
        :options="[inputT('visible.opts.yes'), inputT('visible.opts.no')]"
        v-model="dataProxy.showOnUserDashboards"
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
        name="usersCanEditAnswers"
        :options="[inputT('editable.opts.yes'), inputT('editable.opts.no')]"
        v-model="dataProxy.usersCanEditAnswers"
      />
    </div>
    <div
      class="col-span-1 text-sm text-grey mt-6"
      v-html="inputT('editable.help')"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import AppRadioGroup from '../../../components/forms/AppRadioGroup.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{
  data: {
    whoCanTakePart: string;
    allowAnonymousResponses: string;
    showOnUserDashboards: string;
    usersCanEditAnswers: string;
  };
}>();

const { t } = useI18n();
const inputT = (key: string) =>
  t('createCallout.steps.visibility.inputs.' + key);

const isNotEmptyString = (s: string) => s.length > 0;

const dataProxy = ref(props.data);

watch(
  () =>
    isNotEmptyString(props.data.whoCanTakePart) &&
    isNotEmptyString(props.data.allowAnonymousResponses) &&
    isNotEmptyString(props.data.showOnUserDashboards) &&
    isNotEmptyString(props.data.usersCanEditAnswers),
  (valid) => emit('update:validated', valid)
);
</script>
