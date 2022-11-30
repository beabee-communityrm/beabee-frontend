<template>
  <ul class="flex justify-start">
    <li class="-mr-px">
      <AppButton
        type="button"
        variant="primaryOutlined"
        icon="step-backward"
        size="sm"
        :disabled="isFirst"
        class="h-full rounded-l rounded-r-none hover:z-10"
        :class="isFirst && 'cursor-auto'"
        @click="emit('update:modelValue', 0)"
      ></AppButton>
    </li>
    <li class="-mr-px">
      <AppButton
        type="button"
        variant="primaryOutlined"
        icon="caret-left"
        size="sm"
        :disabled="isFirst"
        class="h-full rounded-none px-3 hover:z-10"
        :class="isFirst && 'cursor-auto'"
        @click="emit('update:modelValue', modelValue - 1)"
      ></AppButton>
    </li>
    <li class="-mr-px">
      <AppButton
        type="button"
        variant="primaryOutlined"
        icon="caret-right"
        size="sm"
        :disabled="isLast"
        class="h-full rounded-none px-3 hover:z-10"
        :class="isLast && 'cursor-auto'"
        @click="emit('update:modelValue', modelValue + 1)"
      ></AppButton>
    </li>
    <li>
      <AppButton
        type="button"
        variant="primaryOutlined"
        icon="step-forward"
        size="sm"
        :disabled="isLast"
        class="h-full rounded-r rounded-l-none px-3 hover:z-10"
        :class="isLast && 'cursor-auto'"
        @click="emit('update:modelValue', totalPages - 1)"
      ></AppButton>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import AppButton from './forms/AppButton.vue';

const props = defineProps<{
  modelValue: number;
  totalPages: number;
}>();

const emit = defineEmits(['update:modelValue']);

const isFirst = computed(() => props.modelValue === 0);
const isLast = computed(() => props.modelValue >= props.totalPages - 1);

const pages = computed(() => {
  const ret = [0];
  if (props.modelValue - 1 > 0) {
    ret.push(props.modelValue - 1);
  }
  if (!isFirst.value && !isLast.value) {
    ret.push(props.modelValue);
  }
  if (props.modelValue + 1 < props.totalPages - 1) {
    ret.push(props.modelValue + 1);
  }
  if (props.totalPages > 1) {
    ret.push(props.totalPages - 1);
  }
  return ret;
});
</script>
