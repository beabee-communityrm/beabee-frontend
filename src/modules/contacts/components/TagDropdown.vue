<template>
  <label v-if="label" class="block mb-1.5 font-semibold">{{ label }}</label>
  <div class="flex flex-row flex-wrap ml-0 mt-2 sm:mt-0">
    <ContactTag
      v-for="tag in modelValue"
      @click="handleRemoveTag(tag)"
      :tag="tag"
      :has-remove-icon="true"
    />
  </div>
  <div class="flex flex-col sm:flex-row">
    <div
      @click="isTagMenuVisible = !isTagMenuVisible"
      class="
        cursor-pointer
        hover:bg-white
        border border-primary-40
        focus:shadow-input
        rounded
        align-middle
        w-full
        sm:w-1/2
        bg-white
        p-2
      "
      :class="isTagMenuVisible ? 'h-auto focus:shadow-input' : ''"
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
          @click="handleAddTag(tag)"
          class="hover:bg-primary-20 first:mt-2 p-2"
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

const props = defineProps<{
  modelValue: string[];
  label?: string;
}>();
const emit = defineEmits(['update:modelValue']);

const isTagMenuVisible = ref(false);

const availableTags = computed(() =>
  ['French', 'Blah blah', 'Go Bristol'].filter(
    (e) => !props.modelValue.includes(e)
  )
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
