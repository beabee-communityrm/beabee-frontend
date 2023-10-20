<template>
  <div
    class="mb-4 flex gap-2 rounded p-4"
    :class="active ? 'bg-white' : 'cursor-pointer bg-primary-10'"
    @click="emit('select')"
  >
    <div>
      <font-awesome-icon
        :icon="faGripVertical"
        class="cursor-grab text-body-60 hover:text-body"
      />
    </div>
    <div class="flex-1">
      <p class="font-semibold">{{ slideNo + 1 }}: {{ slide.title }}</p>
      <p v-for="nextSlide in nextSlides" :key="nextSlide" class="mt-1 text-xs">
        ↳ {{ nextSlide }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { CalloutSlideSchema } from '@beabee/beabee-common';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { getDecisionComponent } from '../../../../utils/callouts';

const emit = defineEmits<{ (e: 'select'): void }>();
const props = defineProps<{
  slideNo: number;
  slides: CalloutSlideSchema[];
  active: boolean;
}>();

const slide = computed(() => props.slides[props.slideNo]);

const nextSlides = computed(() => {
  const nextSlideId = slide.value.navigation.nextSlideId;
  const decisionSlideIds =
    getDecisionComponent(slide.value)?.values.map((v) => v.nextSlideId) || [];

  // Return list of slide titles that can be next, ordered by slide number
  return [nextSlideId, ...decisionSlideIds]
    .filter((v, i, a) => a.indexOf(v) === i) // Filter unique
    .map((id) => props.slides.findIndex((s) => s.id === id))
    .filter((no) => no > -1)
    .sort()
    .map((no) => `${no + 1}: ${props.slides[no].title}`);
});
</script>
