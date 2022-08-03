<template>
  <h3 class="block text-xl font-semibold mb-2">
    {{ t('callout.contactDetails') }}
  </h3>
  <div class="rounded bg-primary-10 p-4 mb-8">
    <p class="mb-3 text-sm">
      {{ t('join.memberAlready') }}
      <router-link
        to="/auth/login"
        class="text-link hover:text-primary underline"
        >{{ t('join.login') }}</router-link
      >
    </p>
    <div class="mb-4">
      <AppInput
        v-model="nameProxy"
        :label="t('callout.form.name')"
        name="name"
        required
      />
    </div>
    <div>
      <AppInput
        v-model="emailProxy"
        :label="t('callout.form.email')"
        type="email"
        name="email"
        required
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import AppInput from '../../forms/AppInput.vue';

const emit = defineEmits(['update:name', 'update:email']);

const { t } = useI18n();

const props = defineProps<{
  name: string;
  email: string;
}>();

const nameProxy = computed({
  get: () => props.name,
  set: (name) => emit('update:name', name),
});
const emailProxy = computed({
  get: () => props.email,
  set: (email) => emit('update:email', email),
});
</script>
