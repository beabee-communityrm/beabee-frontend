<template>
  <div>
    <AppLabel v-if="label" :label="label" :required="required" />
    <div class="flex items-start gap-4">
      <div class="bg-grey-light flex-0 basis-28">
        <img
          :src="imageUrl"
          :width="width"
          :height="height"
          class="w-full h-auto"
          :class="!imageUrl && 'invisible'"
        />
      </div>
      <div>
        <AppButton is="label" class="mr-2">
          <input
            ref="inputRef"
            type="file"
            accept="image/jpeg,image/png"
            class="sr-only"
            @change="handleChange"
          />
          {{ t('actions.chooseFile') }}
        </AppButton>
        <span v-if="uploading">
          <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
          {{ t('form.uploading') }}
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { sameAs } from '@vuelidate/validators';
import { ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from '../../axios';
import AppButton from './AppButton.vue';
import AppLabel from './AppLabel.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: unknown; // TODO: should be string but vuelidate $model is unknown
  width: number;
  height: number;
  label?: string;
  required?: boolean;
}>();

const { t } = useI18n();

const baseURL = import.meta.env.VITE_APP_BASE_URL;

const inputRef = ref<HTMLInputElement>();
const uploading = ref(false);

const imageUrl = ref(props.modelValue as string);

useVuelidate({ uploading: { equal: sameAs(false) } }, { uploading });

watch(toRef(props, 'modelValue'), (newModelValue) => {
  imageUrl.value = newModelValue as string;
  if (inputRef.value) {
    inputRef.value.value = '';
  }
});

function handleChange() {
  const file = inputRef.value?.files?.item(0);
  if (file) {
    imageUrl.value = URL.createObjectURL(file);
    uploadFile(file);
  }
}

async function uploadFile(file: File) {
  const data = new FormData();
  data.append('file', file);

  uploading.value = true;

  const resp = await axios.post('/upload/', data, {
    baseURL,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const newUrl = `${baseURL}/uploads/${props.width}x${props.height}/${resp.data.hash}`;
  emit('update:modelValue', newUrl);

  uploading.value = false;
}
</script>
