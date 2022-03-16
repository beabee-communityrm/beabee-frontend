<template>
  <h4 class="font-semibold">Callout title</h4>
  <AppInput :model-value="calloutTitle" :required="true"></AppInput>
  <AppButton
    :disabled="!valid"
    @click="emit('update:modelValue', calloutTitle)"
    class="mt-2"
    >Continue</AppButton
  >
</template>

<script lang="ts" setup>
import AppButton from '../../../components/forms/AppButton.vue';
import AppInput from '../../../components/forms/AppInput.vue';

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);

// does not appear to be updated by AppInput
const calloutTitle = '';
const valid = (): boolean => calloutTitle.length > 0;
</script>
