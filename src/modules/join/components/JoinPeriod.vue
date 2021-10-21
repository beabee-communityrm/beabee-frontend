<template>
  <div class="flex space-x-2">
    <label
      v-for="(period, index) in joinContent.periods"
      :key="index"
      :for="period.name"
      class="flex-grow relative"
    >
      <input
        :id="period.name"
        type="radio"
        :name="period.name"
        :value="period.name"
        class="absolute opacity-0 -z-1"
        :checked="period.name === signUpData.period"
        @change="changePeriod(handleInput($event))"
      />
      <AppButton
        full-width
        color="link"
        class="font-bold"
        :outlined="period.name !== signUpData.period"
        :class="{ 'hover:bg-link-10': period.name !== signUpData.period }"
        tag="span"
      >
        {{
          period.name === 'monthly' ? t('common.monthly') : t('common.annually')
        }}
      </AppButton>
    </label>
  </div>
</template>

<script lang="ts" setup>
import AppButton from '../../../components/forms/AppButton.vue';
import handleInput from '../../../utils/handle-input';
import { useJoin } from '../use-join';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const { joinContent, signUpData } = useJoin();

const emit = defineEmits(['changePeriod']);

const changePeriod = (period: string) => {
  emit('changePeriod', period);
};
</script>
