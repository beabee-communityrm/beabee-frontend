<template>
  <div
    class="flex-0 z-10 flex flex-col gap-2 p-4 shadow-lg md:flex-row md:items-center md:p-6"
  >
    <AppTitle :title="callout.title" light no-margin class="flex-1">
      {{ callout.title }}
    </AppTitle>
    <div v-if="variantItems" class="mr-2">
      <font-awesome-icon :icon="faGlobe" class="mr-2" />{{
        variantItems.find((vi) => vi.id === currentVariant)?.label
      }}
    </div>
    <AppButton
      v-if="viewLink"
      variant="linkOutlined"
      :to="viewLink.to"
      :icon="viewLink.icon"
      class="self-end md:self-auto"
    >
      {{ viewLink.label }}
    </AppButton>

    <AppButton
      v-if="isOpen"
      variant="link"
      class="hidden px-2 md:inline-block"
      @click="$emit('addnew')"
    >
      <font-awesome-icon :icon="faPlus" class="text" />
      {{ t('callout.addLocation') }}
    </AppButton>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import type { GetCalloutDataWith } from '@type';
import {
  faGlobe,
  faImages,
  faMap,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import AppButton from '@components/button/AppButton.vue';
import AppTitle from '@components/AppTitle.vue';
import { useCallout } from './use-callout';
import { toRef } from 'vue';

defineEmits<{ (e: 'addnew'): void }>();
const props = defineProps<{
  callout: GetCalloutDataWith<'responseViewSchema' | 'variantNames'>;
  map?: boolean;
}>();

const { t } = useI18n();

const { currentVariant, isOpen, variantItems } = useCallout(
  toRef(props, 'callout')
);

const viewLink = computed(() =>
  props.callout.responseViewSchema?.gallery && props.map
    ? {
        to: { name: 'calloutGallery', query: { noIntro: 1 } },
        label: t('callout.views.gallery'),
        icon: faImages,
      }
    : props.callout.responseViewSchema?.map && !props.map
      ? {
          to: { name: 'calloutMap', query: { noIntro: 1 } },
          label: t('callout.views.map'),
          icon: faMap,
        }
      : undefined
);
</script>
