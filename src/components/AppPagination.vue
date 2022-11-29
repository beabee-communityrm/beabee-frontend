<template>
  <ul class="-mx-2 flex items-center">
    <li>
      <button
        class="border border-primary p-2 leading-none hover:border-link hover:font-bold"
        :class="isFirst && 'opacity-25 hover:border-link hover:font-bold'"
        :disabled="isFirst"
        @click="emit('update:modelValue', 0)"
      >
        <font-awesome-icon icon="caret-left" />
      </button>
    </li>
    <li>
      <button
        class="border border-primary p-2 leading-none hover:border-link hover:font-bold"
        :class="isFirst && 'opacity-25 hover:border-link hover:font-bold'"
        :disabled="isFirst"
        @click="emit('update:modelValue', modelValue - 1)"
      >
        <font-awesome-icon icon="caret-left" />
      </button>
    </li>
    <li>
      <button
        class="border border-primary p-2 leading-none hover:border-link hover:font-bold"
        :class="isLast && 'opacity-25 hover:border-link hover:font-bold'"
        :disabled="isLast"
        @click="emit('update:modelValue', modelValue + 1)"
      >
        <font-awesome-icon icon="caret-right" />
      </button>
    </li>
    <li>
      <button
        class="border border-primary p-2 leading-none hover:border-link hover:font-bold"
        :class="isLast && 'opacity-25 hover:border-link hover:font-bold'"
        :disabled="isLast"
        @click="emit('update:modelValue', totalPages - 1)"
      >
        <font-awesome-icon icon="caret-right" />
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

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
