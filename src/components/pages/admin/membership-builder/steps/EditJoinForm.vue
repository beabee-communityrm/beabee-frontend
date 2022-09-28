<template>
  <div>
    <div class="mb-8 grid grid-cols-2 gap-8">
      <div>
        <AppHeading class="mb-5">{{ stepT('title') }}</AppHeading>
        <p>{{ stepT('text') }}</p>
      </div>
    </div>
    <div v-if="joinContent" class="mb-12 grid grid-cols-2 gap-8">
      <div>
        <div class="mb-4">
          <AppInput
            v-model="joinContent.title"
            :label="stepT('formTitle')"
            required
          />
        </div>
        <RichTextEditor
          v-model="joinContent.subtitle"
          :label="stepT('formSubtitle')"
          class="mb-4"
        />

        <AppImageUpload
          v-model="validation.backgroundUrl.$model"
          :label="stepT('backgroundImage')"
          :width="1440"
          :height="810"
          class="mb-4"
          required
          :error-message="validation.backgroundUrl.$errors[0]?.$message"
        />

        <h4 class="mb-4 text-lg font-semibold">
          {{ stepT('suggestedAmounts') }} *
        </h4>
        <div class="mb-4 flex gap-4">
          <PeriodAmounts
            v-for="(period, periodI) in joinContent.periods"
            :key="period.name"
            v-model="joinContent.periods[periodI].presetAmounts"
            :period="period.name"
            :min-monthly-amount="joinContent.minMonthlyAmount"
            class="flex-1"
          />
        </div>
        <div class="mb-4 flex gap-4">
          <div class="flex-1">
            <AppLabel :label="stepT('minAmount')" />
            <AppInput
              v-model="joinContent.minMonthlyAmount"
              type="number"
              :min="1"
              required
              class="block w-32"
            />
          </div>
          <div class="flex-1">
            <AppSelect
              v-model="selectedDefaultAmount"
              :label="stepT('defaultAmount')"
              :items="defaultAmounts"
              required
            />
          </div>
        </div>
        <AppCheckbox
          v-model="joinContent.showAbsorbFee"
          :label="stepT('showAbsorbFee')"
          class="font-semibold"
        />
      </div>
      <div
        class="bg-cover bg-center p-4 pt-8"
        :style="`background-image: url(${backgroundUrl})`"
      >
        <AuthBox>
          <JoinForm :join-content="joinContent" @submit.prevent="" />
        </AuthBox>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { JoinContent } from '../../../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../../../utils/api/content';
import AppInput from '../../../../forms/AppInput.vue';
import RichTextEditor from '../../../../rte/RichTextEditor.vue';
import AppHeading from '../../../../AppHeading.vue';
import AppLabel from '../../../../forms/AppLabel.vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../../forms/AppSelect.vue';
import { ContributionPeriod } from '../../../../../utils/enums/contribution-period.enum';
import AppCheckbox from '../../../../forms/AppCheckbox.vue';
import JoinForm from '../../../join/JoinForm.vue';
import AuthBox from '../../../../AuthBox.vue';
import AppImageUpload from '../../../../forms/AppImageUpload.vue';
import { generalContent } from '../../../../../store';
import { MembershipBuilderEmitter } from '../membership-builder.interface';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import PeriodAmounts from '../PeriodAmounts.vue';

const emit = defineEmits(['update:error', 'update:validated']);
const props = defineProps<{
  emitter: MembershipBuilderEmitter;
}>();

const joinContent = ref<JoinContent>();
const backgroundUrl = ref('');

const { n, t } = useI18n();

const stepT = (key: string) => t('membershipBuilder.steps.joinForm.' + key);

const selectedDefaultAmount = computed({
  get: () =>
    joinContent.value
      ? `${joinContent.value.initialPeriod}_${joinContent.value.initialAmount}`
      : '',
  set: (defaultAmount) => {
    if (joinContent.value) {
      const [periodName, amount] = defaultAmount.split('_');
      joinContent.value.initialPeriod = periodName as ContributionPeriod;
      joinContent.value.initialAmount = Number(amount);
    }
  },
});

const defaultAmounts = computed(() => {
  return joinContent.value
    ? joinContent.value.periods.flatMap((period) =>
        period.presetAmounts.map((amount) => ({
          id: `${period.name}_${amount}`,
          label: `${n(amount, 'currency')}/${t('common.' + period.name)}`,
        }))
      )
    : [];
});

async function handleUpdate() {
  if (joinContent.value) {
    await Promise.all([
      updateContent('join', joinContent.value),
      updateContent('general', {
        backgroundUrl: backgroundUrl.value || '',
      }),
    ]);
  }

  props.emitter.emit('updated');
}

const validation = useVuelidate(
  { backgroundUrl: { required } },
  { backgroundUrl }
);

watch(validation, () => {
  emit('update:error', validation.value.$errors.length > 0);
  emit('update:validated', !validation.value.$invalid);
});

onBeforeMount(async () => {
  props.emitter.on('update', handleUpdate);
  joinContent.value = await fetchContent('join');
  backgroundUrl.value = generalContent.value.backgroundUrl || '';

  watch(
    [joinContent, backgroundUrl],
    () => {
      props.emitter.emit('dirty');
    },
    { deep: true }
  );
});

onBeforeUnmount(() => {
  props.emitter.off('update', handleUpdate);
});
</script>
