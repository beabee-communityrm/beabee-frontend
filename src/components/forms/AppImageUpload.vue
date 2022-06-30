<template>
  <div>
    <AppLabel v-if="label" :label="label" :required="required" />
    <div class="flex items-start gap-4">
      <div class="bg-grey-light flex-0 basis-28">
        <img
          :src="imageUrl"
          width="400"
          height="200"
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
        <AppButton
          :disabled="!canUpload"
          :loading="uploading"
          @click="handleUpload"
        >
          {{ t('actions.upload') }}
        </AppButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from '../../axios';
import AppButton from './AppButton.vue';
import AppLabel from './AppLabel.vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  modelValue: string;
  label?: string;
  required?: boolean;
}>();

const { t } = useI18n();

const baseURL = import.meta.env.VITE_APP_BASE_URL;

const inputRef = ref<HTMLInputElement>();
const canUpload = ref(false);
const uploading = ref(false);

const imageUrl = ref(props.modelValue);

function handleChange() {
  if (inputRef.value && inputRef.value.files) {
    const file = inputRef.value.files[0];
    if (file) {
      imageUrl.value = URL.createObjectURL(file);
      canUpload.value = true;
    } else {
      canUpload.value = false;
    }
  }
}

async function handleUpload() {
  if (
    inputRef.value &&
    inputRef.value.files &&
    inputRef.value.files.length > 0
  ) {
    const data = new FormData();
    data.append('file', inputRef.value.files[0]);

    uploading.value = true;

    const resp = await axios.post('/upload/', data, {
      baseURL,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const newUrl = baseURL + '/uploads/' + resp.data.hash;
    emit('update:modelValue', newUrl);

    uploading.value = false;
    canUpload.value = false;
  }
}
</script>
