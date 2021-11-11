<template>
  <section class="mb-6">
    <h3 class="font-semibold text-lg mb-1">{{ t('join.memberAccount') }}</h3>

    <p class="mb-3 text-sm">
      {{ t('join.memberAlready') }}
      <router-link to="/login" class="text-link hover:text-primary underline">{{
        t('join.login')
      }}</router-link>
    </p>

    <div class="mb-5">
      <AppInput
        v-model="signUpData.email"
        input-type="email"
        :label="t('form.email')"
        :error-message="errorGenerator(joinValidation, 'email')"
        @blur="joinValidation.email.$touch"
      />
    </div>

    <AppInput
      v-model="signUpData.password"
      input-type="password"
      :label="t('form.password')"
      :error-message="errorGenerator(joinValidation, 'password')"
      :info-message="t('form.passwordInfo')"
      @blur="joinValidation.password.$touch"
    />
  </section>
</template>

<script lang="ts" setup>
import AppInput from '../../../../components/forms/AppInput.vue';
import { errorGenerator } from '../../../../utils/form-error-generator';
import { useI18n } from 'vue-i18n';
import { useJoin } from '../use-join';

const { t } = useI18n();

const { signUpData, joinValidation } = useJoin();
</script>
