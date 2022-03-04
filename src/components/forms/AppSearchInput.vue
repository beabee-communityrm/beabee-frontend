<template>
  <form
    class="relative"
    @submit.prevent="emit('update:modelValue', searchText)"
  >
    <AppInput v-model="searchText" class="pr-8" :placeholder="placeholder" />
    <button class="absolute right-0 w-8 h-full">
      <font-awesome-icon icon="search" />
    </button>
  </form>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import AppInput from './AppInput.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: string;
  placeholder: string;
}>();

const searchText = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    searchText.value = newValue;
  }
);
</script>
