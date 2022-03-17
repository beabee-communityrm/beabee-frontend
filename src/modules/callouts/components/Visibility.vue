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

  <AppButton :disabled="!valid" @click="handleClick" class=""
    >Continue</AppButton
  >
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppInput from '../../../components/forms/AppInput.vue';
import AppButton from '../../../components/forms/AppButton.vue';

const props = defineProps<{ data: { foo: string } }>();
const fooInput = ref(props.data.foo);

const isNotEmptyString = (obj: { value: string }) => obj.value.length > 0;
const valid = computed((): boolean => isNotEmptyString(fooInput));

const emit = defineEmits(['update:data', 'update:validated']);
const handleClick = () => {
  emit('update:data', { foo: fooInput });
  emit('update:validated', true);
};
</script>
