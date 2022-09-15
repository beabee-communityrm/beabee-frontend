<template>
  <AppLabel v-if="label" :label="label" />
  <div class="flex flex-row flex-wrap mb-1 mt-1">
    <ContactTag
      v-for="tag in modelValue"
      :key="tag"
      :tag="tag"
      :has-remove-icon="true"
      @click:remove-tag="handleRemoveTag(tag)"
    />
  </div>
  <div class="flex flex-col sm:flex-row">
    <div
      class="
        cursor-pointer
        hover:bg-white
        border border-primary-40
        focus:shadow-input
        rounded
        align-middle
        w-full
        sm:w-1/2 sm:min-w-[17rem]
        bg-white
        p-2
      "
      :class="isTagMenuVisible ? 'h-auto focus:shadow-input' : ''"
      @click="isTagMenuVisible = !isTagMenuVisible"
    >
      <p class="align-middle">
        <font-awesome-icon
          class="inline-block cursor-pointer mr-2 ml-2"
          icon="caret-down"
        />
        Pick a tag from the list below
      </p>
      <div :class="isTagMenuVisible ? 'block' : 'hidden'" class="">
        <p
          v-for="tag in availableTags"
          :key="tag"
          class="hover:bg-primary-20 first:mt-2 p-2"
          @click="handleAddTag(tag)"
        >
          <font-awesome-icon
            class="inline-block cursor-pointer mr-2 ml-2"
            icon="tag"
          />
          {{ tag }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { computed } from '@vue/reactivity';
import ContactTag from './ContactTag.vue';
import AppLabel from '../../../forms/AppLabel.vue';

const props = defineProps<{
  tags: string[];
  modelValue: string[];
  label?: string;
}>();
const emit = defineEmits(['update:modelValue']);

const isTagMenuVisible = ref(false);

const availableTags = computed(() =>
  props.tags.filter((e) => !props.modelValue.includes(e))
);

const handleAddTag = (tag: string) => {
  emit('update:modelValue', [...props.modelValue, tag]);
};
const handleRemoveTag = (tag: string) => {
  emit(
    'update:modelValue',
    props.modelValue.filter((e) => e != tag)
  );
};
</script>
