<route lang="yaml">
name: adminSettingsTheme
meta:
  title: menu.adminSettings
  role: admin
</route>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="grid lg:grid-cols-2 gap-8 mb-8">
      <div>
        <AppHeading class="mb-4">
          {{ t('adminSettings.theme.fonts') }}
        </AppHeading>
      </div>
      <div>
        <AppHeading class="mb-4">
          {{ t('adminSettings.theme.colors') }}
        </AppHeading>
        <label
          v-for="preset in colorPresets"
          :key="preset.name"
          class="flex mb-2 items-center max-w-[15rem] cursor-pointer"
        >
          <input
            v-model="activePreset"
            type="radio"
            name="activePreset"
            :value="preset.name"
            required
          />
          <span class="flex-1 ml-2">
            {{ t('adminSettings.theme.presetColors.' + preset.name) }}
          </span>
          <span
            v-for="(color, name) in preset.colors"
            :key="name"
            class="w-8 h-8 rounded-full ml-2"
            :style="{ backgroundColor: color }"
          >
          </span>
        </label>
        <label class="flex items-center h-8 mb-4 cursor-pointer">
          <input
            id="colorPreset_custom"
            v-model="activePreset"
            type="radio"
            name="activePreset"
            value="custom"
            class="mr-2"
          />
          {{ t('adminSettings.theme.customColors') }}
        </label>
        <div
          v-if="activePreset === 'custom' && customColors"
          class="grid grid-cols-3 gap-2"
        >
          <div
            v-for="name in visibleCustomColors"
            :key="name"
            class="border border-primary-20 rounded p-2"
          >
            <label class="block text-sm mb-2">
              {{ t('adminSettings.theme.colorNames.' + name) }}
            </label>
            <AppColorInput :id="name" v-model="customColors[name]" />
          </div>
        </div>
      </div>
    </div>

    <MessageBox v-if="hasSaved" type="success" class="mb-4">
      {{ t('form.saved') }}
    </MessageBox>

    <MessageBox v-if="validation.$errors.length > 0" class="mb-4">
      {{ t('form.errors.aggregator') }}
    </MessageBox>

    <div class="flex">
      <AppButton
        type="submit"
        variant="link"
        :loading="saving"
        :disabled="validation.$invalid"
      >
        {{ t('actions.update') }}
      </AppButton>
      <AppButton
        v-if="originalTheme"
        variant="text"
        class="ml-2"
        @click="resetTheme"
      >
        {{ t('actions.reset') }}
      </AppButton>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import { updateContent } from '../../../utils/api/content';
import { getFullTheme, Theme } from '../../../theme';
import { generalContent } from '../../../store';
import AppButton from '../../../components/forms/AppButton.vue';
import MessageBox from '../../../components/MessageBox.vue';
import AppColorInput from '../../../components/forms/AppColorInput.vue';
import useVuelidate from '@vuelidate/core';

const { t } = useI18n();

const validation = useVuelidate();

const colorPresets = [
  {
    name: 'default',
    colors: {
      primary: '#262453',
      link: '#43a796',
      body: '#262453',
    },
  },
];

const visibleCustomColors = [
  'primary',
  'link',
  'body',
  'success',
  'warning',
  'danger',
] as const;

// Used to restore unsaved themes on exit
let currentTheme = generalContent.value.theme;

const activePreset = ref('');
const customColors = ref<Theme['colors']>();
const saving = ref(false);
const hasSaved = ref(false);

const activeColors = computed(() =>
  activePreset.value === 'custom'
    ? customColors.value
    : colorPresets.find((p) => p.name === activePreset.value)?.colors
);

watch(
  activeColors,
  (colors) => {
    generalContent.value.theme = { colors };
    hasSaved.value = false;
  },
  { deep: true }
);

async function handleSubmit() {
  hasSaved.value = false;
  saving.value = false;

  try {
    generalContent.value = await updateContent('general', {
      theme: {
        colors: activeColors.value,
      },
    });

    currentTheme = generalContent.value.theme;
    hasSaved.value = true;
  } catch (err) {}
  saving.value = false;
}

function resetTheme() {
  customColors.value = getFullTheme(currentTheme).colors;
  activePreset.value =
    colorPresets.find((p) => p.name === currentTheme.colors?._name)?.name ||
    'custom';
}

onBeforeMount(resetTheme);

onBeforeUnmount(() => {
  generalContent.value.theme = currentTheme;
});
</script>
