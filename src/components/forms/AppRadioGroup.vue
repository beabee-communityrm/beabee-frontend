<template>
  <label :for="item" v-for="item in options" class="block">
    <input
      type="radio"
      :id="item"
      :name="name"
      :value="item"
      v-model="selected"
      :checked="modelValue === item ? true : false"
    />
    {{ item }}
  </label>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
  modelValue: string | null;
  options: Array<string>;
  default?: string;
  name?: string;
}>();

const selected = ref(props.default ? props.default : '');
watch(selected, () => emit('update:modelValue', selected.value));
</script>
