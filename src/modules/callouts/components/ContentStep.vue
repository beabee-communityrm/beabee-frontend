<template>
  <AppHeading>Callout content</AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppTextArea
        v-model="dataProxy.introText"
        label="Introduction text"
        required
      />
    </div>
    <div></div>
  </div>
  <div class="callout-form mt-8">
    <FormBuilder :options="formOpts" />
  </div>
</template>
<script lang="ts" setup>
// import useVuelidate from '@vuelidate/core';
// import { helpers, required } from '@vuelidate/validators';
import { ref, watch } from 'vue';
import { FormBuilder } from 'vue-formio';
import AppHeading from '../../../components/AppHeading.vue';
import AppTextArea from '../../../components/forms/AppTextArea.vue';
import { errorGenerator } from '../../../utils/form-error-generator';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{ data: { introText: string; formSchema: any } }>();

const dataProxy = ref(props.data);
//const validation = useVuelidate({
//   introText: helpers.withMessage('Introduction text is required', required),
// }, props.data);

const formOpts = {
  builder: {
    data: false,
    layout: false,
    resource: false,
    // advanced: false,
    premium: false,
  },
};

/*watch(
  () => validation.value.$errors.length > 0,
  (valid) => {
    emit('update:validated', valid);
  }
);*/
</script>
