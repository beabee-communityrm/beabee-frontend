<template>
  <AppHeading class="mb-3"> Visibility settings </AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput
        v-model="dataProxy.foo"
        :label="'Something to fill in'"
      ></AppInput>
    </div>
    <p class="col-span-1 text-sm text-grey mt-6">
      The <b>Title</b> will appear on all the mentions of this callout. It's
      worth spending a while coming up with the right name to get people
      interested.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppInput from '../../../components/forms/AppInput.vue';

const emit = defineEmits(['update:data', 'update:validated']);
const props = defineProps<{ data: { foo: string } }>();

const isNotEmptyString = (s: string) => s.length > 0;

const dataProxy = ref(props.data);

watch(
  () => isNotEmptyString(props.data.foo),
  (valid) => emit('update:validated', valid)
);
</script>
