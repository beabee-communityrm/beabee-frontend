<template>
  <h4 class="font-semibold">Callout title</h4>
  <AppInput v-model="calloutTitle" :required="true"></AppInput>
  <AppButton :disabled="!valid" @click="handleClick" class="mt-2"
    >Continue</AppButton
  >
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import AppButton from '../../../components/forms/AppButton.vue';
import AppInput from '../../../components/forms/AppInput.vue';

const props = defineProps<{ data: { title: string } }>();
const calloutTitle = ref(props.data.title);

const valid = computed((): boolean => calloutTitle.value.length > 0);

const emit = defineEmits(['update:data', 'update:validated']);
const handleClick = () => {
  emit('update:data', { title: calloutTitle });
  emit('update:validated', true);
};
</script>
