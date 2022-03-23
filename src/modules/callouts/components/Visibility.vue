<template>
  <AppHeading class="mb-3"> Visibility settings </AppHeading>
  <div class="grid grid-cols-2 gap-6">
    <div class="col-span-1">
      <AppInput v-model="fooInput" :label="'Something to fill in'"></AppInput>
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

const props = defineProps<{ data: { foo: string } }>();
const fooInput = ref(props.data.foo);

const isNotEmptyString = (obj: { value: string }) => obj.value.length > 0;
const valid = computed((): boolean => isNotEmptyString(fooInput));

const emit = defineEmits(['update:data', 'update:validated']);
watch(valid, () => {
  emit('update:data', {
    foo: fooInput.value,
  });
  emit('update:validated', valid.value);
});
</script>
