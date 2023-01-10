<template>
  <AppForm
    :button-text="t('actions.save')"
    :success-text="t('addNotice.noticeSaved')"
    @submit.prevent="$emit('submit', data)"
  >
    <AppLabel :label="`This is the shared form`" />

    <div class="mb-3">
      <AppInput
        v-model="data.name"
        :label="t('addNotice.form.name')"
        required
      />
    </div>

    <AppLabel :label="t('addNotice.form.startDateAndTime')" />
    <div class="mb-3 flex">
      <div>
        <AppInput v-model="data.startDate" type="date" />
      </div>
      <div>
        <AppInput v-model="data.startTime" type="time" />
      </div>
    </div>

    <AppLabel :label="t('addNotice.form.expirationDateAndTime')" />
    <div class="mb-3 flex">
      <div>
        <AppInput v-model="data.expirationDate" type="date" />
      </div>
      <div>
        <AppInput v-model="data.expirationTime" type="time" />
      </div>
    </div>

    <div class="mb-3">
      <AppInput
        v-model="data.text"
        :label="t('addNotice.form.text')"
        required
      />
    </div>

    <div class="mb-3">
      <AppInput
        v-model="data.buttonText"
        :label="t('addNotice.form.buttonText')"
      />
    </div>

    <div class="mb-3">
      <AppInput v-model="data.url" :label="t('addNotice.form.url')" />
    </div>
  </AppForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import AppForm from '../forms/AppForm.vue';
import AppInput from '../forms/AppInput.vue';
import AppLabel from '../forms/AppLabel.vue';
import { NoticeFormData } from './notice.interface';

const emit = defineEmits(['submit']);
const props = defineProps<{ data: NoticeFormData }>();

const { t } = useI18n();

const data = reactive<NoticeFormData>({
  name: props.data.name,
  startDate: props.data.startDate,
  startTime: props.data.startTime,
  expirationDate: props.data.expirationDate,
  expirationTime: props.data.expirationTime,
  text: props.data.text,
  buttonText: props.data.buttonText,
  url: props.data.url,
});
</script>
