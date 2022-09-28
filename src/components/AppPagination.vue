<template>
  <ul class="-mx-2 flex items-center">
    <li>
      <button
        class="p-2"
        :class="isFirst && 'opacity-25 hover:border-link hover:font-bold'"
        :disabled="isFirst"
        @click="emit('update:modelValue', modelValue - 1)"
      >
        <font-awesome-icon icon="caret-left" />
      </button>
    </li>
    <template v-for="(page, index) in pages" :key="index">
      <li v-if="index > 0 && pages[index - 1] !== page - 1">&hellip;</li>
      <li>
        <button
          :class="
            page === modelValue && 'border-link bg-white font-bold text-link'
          "
          :disabled="page === modelValue"
          class="mx-1 rounded border border-primary p-2 leading-none hover:border-link hover:font-bold"
          @click="emit('update:modelValue', page)"
        >
          {{ page + 1 }}
        </button>
      </li>
    </template>
    <li>
      <button
        class="p-2"
        :class="isLast && 'opacity-25 hover:border-link hover:font-bold'"
        :disabled="isLast"
        @click="emit('update:modelValue', modelValue + 1)"
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
