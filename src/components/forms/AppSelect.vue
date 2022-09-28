<template>
  <div>
    <AppLabel v-if="label" :label="label" :required="required" />
    <select
      v-model="value"
      class="p-2 w-full border border-primary-40 rounded focus:outline-none focus:shadow-input bg-white"
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
  modelValue: string | null;
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
