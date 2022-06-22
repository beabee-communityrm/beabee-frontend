<template>
  <div v-if="joinContent" class="flex gap-8">
    <div class="flex-1">
      <AppInput
        v-model="joinContent.title"
        label="Title"
        required
        class="mb-5"
      />
      <RichTextEditor
        v-model="joinContent.subtitle"
        label="Subtitle"
        class="mb-5"
      />

      <AppHeading class="mb-4">Suggested contribution amounts</AppHeading>
      <div class="flex gap-4 mb-4">
        <div
          v-for="period in joinContent.periods"
          :key="period.name"
          class="flex-1"
        >
          <AppLabel :label="t('common.' + period.name)" />
          <AppInput
            v-for="(presetAmount, i) in period.presetAmounts"
            :key="i"
            input-type="number"
            class="w-32 block mb-2"
            :model-value="presetAmount"
            @update:model-value="updateAmount(period.name, i, $event)"
          />
        </div>
      </div>
      <div class="flex gap-4 mb-4">
        <div class="flex-1">
          <AppLabel label="Minimum amount" />
          <AppInput
            v-model="joinContent.minMonthlyAmount"
            input-type="number"
            class="w-32 block mb-2"
          />
        </div>
        <div class="flex-1">
          <AppLabel label="Default amount" />
          <!-- <AppSelect v-model="selectedDefaultAmount" :items="defaultAmounts" /> -->
        </div>
      </div>
      <AppCheckbox
        v-model="joinContent.showAbsorbFee"
        label="Ask about processing fee"
        class="font-semibold"
      />
    </div>
    <div class="flex-1">right</div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import { JoinContent } from '../../../../utils/api/api.interface';
import { fetchJoinContent } from '../../../../utils/api/content';
import AppInput from '../../../../components/forms/AppInput.vue';
import RichTextEditor from '../../../../components/rte/RichTextEditor.vue';
import AppHeading from '../../../../components/AppHeading.vue';
import AppLabel from '../../../../components/forms/AppLabel.vue';
import { useI18n } from 'vue-i18n';
import AppSelect from '../../../../components/forms/AppSelect.vue';
import { ContributionPeriod } from '../../../../utils/enums/contribution-period.enum';
import AppCheckbox from '../../../../components/forms/AppCheckbox.vue';

const joinContent = ref<JoinContent>();

const { n, t } = useI18n();

function updateAmount(
  periodName: ContributionPeriod,
  slot: number,
  amount: number
) {
  console.log(periodName, slot, amount);
  if (joinContent.value) {
    const period = joinContent.value.periods.find(
      (period) => period.name === periodName
    );
    if (period) {
      period.presetAmounts[slot] = amount;
    }
  }
}

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

const defaultAmounts = computed(() =>
  joinContent.value
    ? joinContent.value.periods.flatMap((period) =>
        period.presetAmounts.map((amount) => ({
          id: `${period.name}_${amount}`,
          label: `${n(amount, 'currency')}/${t('common.' + period.name)}`,
        }))
      )
    : []
);

onBeforeMount(async () => {
  joinContent.value = await fetchJoinContent();
});
</script>
