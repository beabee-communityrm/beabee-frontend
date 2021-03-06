<template>
  <div>
    <div class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <AppHeading class="mb-5">{{ stepT('title') }}</AppHeading>
        <p>{{ stepT('text') }}</p>
      </div>
    </div>
    <div v-if="joinContent" class="grid grid-cols-2 gap-8 mb-12">
      <div>
        <div class="mb-4">
          <AppInput
            v-model="validation.joinContent.title.$model"
            :label="stepT('formTitle')"
            required
            :error-message="validation.joinContent.title.$errors[0]?.$message"
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

        <h4 class="font-semibold text-lg mb-4">
          {{ stepT('suggestedAmounts') }} *
        </h4>
        <div class="flex gap-4 mb-4">
          <PeriodAmounts
            v-for="(period, periodI) in joinContent.periods"
            :key="period.name"
            v-model="joinContent.periods[periodI].presetAmounts"
            :period="period.name"
            :min-monthly-amount="joinContent.minMonthlyAmount"
            class="flex-1"
          />
        </div>
        <div class="flex gap-4 mb-4">
          <div class="flex-1">
            <AppLabel :label="stepT('minAmount')" />
            <AppInput
              v-model="joinContent.minMonthlyAmount"
              input-type="number"
              class="w-32 block mb-2"
              min="1"
            />
          </div>
          <div class="flex-1">
            <AppLabel :label="stepT('defaultAmount')" />
            <AppSelect
              v-model="selectedDefaultAmount"
              :items="defaultAmounts"
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
        class="p-4 pt-8 bg-center bg-cover"
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
import { JoinContent } from '../../../../utils/api/api.interface';
import { fetchContent, updateContent } from '../../../../utils/api/content';
import AppInput from '../../../../components/forms/AppInput.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import AppHeading from '../../../../components/AppHeading.vue';
import AppLabel from '../../../../components/forms/AppLabel.vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../../components/forms/AppSelect.vue';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import AppCheckbox from '../../../../components/forms/AppCheckbox.vue';
import JoinForm from '../../../auth/join/components/JoinForm.vue';
import AuthBox from '../../../auth/AuthBox.vue';
import AppImageUpload from '../../../../components/forms/AppImageUpload.vue';
import { generalContent } from '../../../../store';
import { MembershipBuilderEmitter } from '../../membership-builder.interface';
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
        ...generalContent.value,
        backgroundUrl: backgroundUrl.value || '',
      }),
    ]);
  }

  props.emitter.emit('updated');
}

const validation = useVuelidate(
  {
    joinContent: {
      title: { required },
    },
    backgroundUrl: { required },
  },
  {
    joinContent,
    backgroundUrl,
  }
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
