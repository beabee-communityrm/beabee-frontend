<template>
  <div class="flex">
    <!--<div class="flex-1">actions</div>-->
    <form
      class="relative"
      @submit.prevent="emit('update:modelValue', basicSearchValue)"
    >
      <AppInput
        v-model="basicSearchValue"
        class="pr-8"
        :placeholder="t('contacts.search')"
      />
      <button class="absolute right-0 w-8 h-full">
        <font-awesome-icon icon="search" />
      </button>
    </form>
    <a
      href="/members?type=advanced"
      class="ml-2 p-2"
      :class="showAdvancedSearch && 'bg-primary-10'"
    >
      {{ t('contacts.advancedSearch') }}
    </a>
  </div>
  <div v-if="showAdvancedSearch" class="bg-primary-10 p-3 mt-1">
    Advanced search
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../../components/forms/AppInput.vue';

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: string;
}>();

const basicSearchValue = ref(props.modelValue);
watch(
  () => props.modelValue,
  (value) => {
    basicSearchValue.value = value;
  }
);
const showAdvancedSearch = ref(false);
</script>
