<template>
  <form
    class="relative"
    @submit.prevent="emit('update:modelValue', searchText)"
  >
    <AppInput v-model="searchText" class="pr-12" :placeholder="placeholder" />
    <button
      v-if="searchText.length > 0"
      class="
        absolute
        right-5
        w-8
        h-full
        color-red
        text-primary-70
        hover:text-primary-40
      "
      @click="emit('update:modelValue', '')"
    >
      <font-awesome-icon icon="times" />
    </button>
    <button
      class="absolute right-0 w-8 h-full text-primary hover:text-primary-70"
    >
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
