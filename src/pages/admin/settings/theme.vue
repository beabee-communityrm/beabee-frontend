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
          class="flex mb-2 items-center max-w-[20rem] cursor-pointer"
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
            <div class="flex items-center mb-2">
              <div
                class="w-7 h-7 rounded-full mr-2"
                :style="{ backgroundColor: customColors[name] }"
              />
              <div class="text-body-40 font-semibold text-xs">
                {{ toHex(customColors[name]) }}
              </div>
            </div>
            <ColorPicker
              :id="name"
              alpha-channel="hide"
              :color="customColors[name]"
              @color-change="changeColor(name, $event.colors.hex)"
            >
              <template #format-switch-button>
                <font-awesome-icon :icon="['fa', 'sort']" />
              </template>
            </ColorPicker>
          </div>
        </div>
      </div>
    </div>

    <MessageBox v-if="hasSaved" type="success" class="mb-4">
      {{ t('form.saved') }}
    </MessageBox>

    <AppButton type="submit" variant="link" :loading="saving">
      {{ t('actions.update') }}
    </AppButton>
  </form>
</template>

<script lang="ts" setup>
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import AppHeading from '../../../components/AppHeading.vue';
import { fetchContent, updateContent } from '../../../utils/api/content';
import { ColorPicker } from 'vue-accessible-color-picker';
import { toHex } from 'color2k';
import { getFullTheme, PartialTheme, Theme } from '../../../theme';
import { generalContent } from '../../../store';
import AppButton from '../../../components/forms/AppButton.vue';
import MessageBox from '../../../components/MessageBox.vue';

const { t } = useI18n();

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
let originalTheme: undefined | PartialTheme;

const activePreset = ref('');
const customColors = ref<Theme['colors']>();
const saving = ref(false);
const hasSaved = ref(false);

const activeColors = computed(
  () =>
    colorPresets.find((p) => p.name === activePreset.value)?.colors ||
    customColors.value
);

watch(
  activeColors,
  (colors) => {
    generalContent.value.theme = { colors };
  },
  { deep: true }
);

function changeColor(name: keyof Theme['colors'], color: string) {
  if (customColors.value) {
    customColors.value[name] = color;
  }
}

async function handleSubmit() {
  hasSaved.value = false;
  saving.value = false;

  try {
    generalContent.value = await updateContent('general', {
      theme: {
        colors: activeColors.value,
      },
    });

    originalTheme = generalContent.value.theme;
    hasSaved.value = true;
  } catch (err) {}
  saving.value = false;
}

onBeforeMount(async () => {
  const generalContent = await fetchContent('general');
  customColors.value = getFullTheme(generalContent.theme).colors;

  activePreset.value =
    colorPresets.find((p) => p.name === generalContent.theme.colors?._name)
      ?.name || 'custom';

  originalTheme = generalContent.theme;
});

onBeforeUnmount(() => {
  if (originalTheme) {
    generalContent.value.theme = originalTheme;
  }
});
</script>

<style>
.vacp-color-picker {
  padding: 0;
  background-color: transparent;
}
.vacp-color-space {
  height: 100px;
}
.vacp-copy-button {
  display: none;
}
</style>
