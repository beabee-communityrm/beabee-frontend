<template>
  <div class="flex mb-2">
    <div
      class="w-7 h-7 mt-1.5 flex-0 rounded-full mr-2"
      :style="{ backgroundColor: modelValue }"
    />
    <div class="flex-1">
      <AppInput
        v-model="colorText"
        name="color"
        pattern="#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})"
        required
      />
    </div>
  </div>
  <ColorPicker
    :id="id"
    alpha-channel="hide"
    :color="modelValue"
    @color-change="changeColor($event.colors.hex)"
  >
    <template #format-switch-button>
      <font-awesome-icon :icon="['fa', 'sort']" />
    </template>
  </ColorPicker>
</template>

<script lang="ts" setup>
import { ColorPicker } from 'vue-accessible-color-picker';
import AppInput from './AppInput.vue';
import { ref, watch } from 'vue';
import useVuelidate from '@vuelidate/core';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  id: string;
  modelValue: string;
}>();

const validation = useVuelidate();
const colorText = ref(props.modelValue);

function changeColor(newColor: string) {
  colorText.value = newColor.substring(0, newColor.length === 5 ? 4 : 7); // Ignore alpha
}

watch(
  colorText,
  (newColor) => {
    if (!validation.value.$invalid) {
      emit('update:modelValue', newColor);
    }
  },
  { flush: 'post' }
);
</script>

<style>
.vacp-color-picker {
  padding: 0;
  background-color: transparent;
}
.vacp-color-space {
  height: 100px;
}
.vacp-copy-button,
.vacp-color-inputs {
  display: none;
}
</style>
