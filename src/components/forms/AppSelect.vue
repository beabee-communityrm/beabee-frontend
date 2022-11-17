<template>
  <div>
    <AppLabel v-if="label" :label="label" :required="required" />
    <select
      v-model="value"
      class="w-full rounded border border-primary-40 bg-white p-2 focus:shadow-input focus:outline-none"
      :required="required"
    >
      <option
        v-for="item in items"
        :key="item.id"
        :value="item.id"
        :selected="modelValue === item.id"
      >
        {{ item.label + (item.count ? ' (' + item.count + ')' : '') }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import AppLabel from './AppLabel.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  label?: string;
  modelValue?: string | null;
  items: {
    id: string;
    label: string;
    count?: string;
  }[];
  required?: boolean;
}>();

const value = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
});
</script>
