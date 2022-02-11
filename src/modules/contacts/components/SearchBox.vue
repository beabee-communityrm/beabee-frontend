<template>
  <div class="flex">
    <!--<div class="flex-1">actions</div>-->
    <AppSearchInput v-model="searchText" :placeholder="t('contacts.search')" />
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppSearchInput from '../../../components/forms/AppSearchInput.vue';

const { t } = useI18n();

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: string;
}>();

const searchText = computed({
  get: () => props.modelValue,
  set: (text) => emit('update:modelValue', text),
});
const showAdvancedSearch = ref(false);
</script>
