<template>
  <span
    class="inline-flex rounded border border-primary-40 focus-within:shadow-input"
  >
    <button
      type="button"
      class="bg-primary-20 px-2"
      @click="isRelative = !isRelative"
    >
      <font-awesome-icon
        :icon="['fa', isRelative ? 'circle-arrow-right' : 'circle-dot']"
      />
    </button>
    <input
      v-if="isRelative"
      v-model="relativeValue"
      type="text"
      class="p-2 leading-tight focus:outline-none"
      placeholder="$now(d:-1)"
    />
    <input
      v-else
      v-model="dateValue"
      type="date"
      class="p-2 leading-tight focus:outline-none"
    />
  </span>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['update:modelValue']);
const props = defineProps<{ modelValue: string }>();

const isRelative = ref(props.modelValue.startsWith('$now'));

const relativeValue = ref(isRelative.value ? props.modelValue : '');
const dateValue = ref(isRelative.value ? '' : props.modelValue);

watch([isRelative, relativeValue, dateValue], () => {
  emit(
    'update:modelValue',
    isRelative.value ? relativeValue.value : dateValue.value
  );
});
</script>
