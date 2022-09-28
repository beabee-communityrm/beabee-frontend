<template>
  <section class="mb-8">
    <AppSubHeading>{{ t('join.memberAccount') }}</AppSubHeading>

    <p class="mb-2 text-sm">
      {{ t('join.memberAlready') }}
      <router-link
        to="/auth/login"
        class="text-link underline hover:text-primary"
        >{{ t('join.login') }}</router-link
      >
    </p>

    <div class="mb-3">
      <AppInput
        v-model="emailProxy"
        :label="t('form.email')"
        type="email"
        name="email"
        required
      />
    </div>

    <AppInput
      v-model="passwordProxy"
      :label="t('form.password')"
      type="password"
      name="password"
      required
      :info-message="t('form.passwordInfo')"
    />
  </section>
</template>

<script lang="ts" setup>
import AppInput from '../../forms/AppInput.vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import AppSubHeading from '../../AppSubHeading.vue';

const emit = defineEmits(['update:email', 'update:password']);
const props = defineProps<{
  email: string;
  password: string;
}>();

const emailProxy = computed({
  get: () => props.email,
  set: (email) => emit('update:email', email),
});

const passwordProxy = computed({
  get: () => props.password,
  set: (password) => emit('update:password', password),
});

const { t } = useI18n();
</script>
