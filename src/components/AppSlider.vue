<!--
  # AppSlider
  A slider component that allows you to slide between elements. Useful for things like modals with multiple steps or a carousel.

  ## Props
  - `showNavigationButtons` (boolean): Whether or not to show the navigation buttons. Defaults to `false`.
  - `infinite` (boolean): Whether or not to allow infinite scrolling. Defaults to `false`.

  ## Events
  - `slide` (details: AppSliderSlideEventDetails): Emitted when a slide is scrolled to. `details` contains the slide number and the slide element.

  ## Slots
  - `slides`: The slides to display in the slider.
  - `navigation`: The navigation buttons to display. Receives the `prevSlide`, `nextSlide`, and `toSlide` functions as props.

-->

<template>
  <div
    ref="slidesContainerEl"
    class="w-full overflow-x-hidden whitespace-nowrap flex flex-nowrap"
  >
    <slot name="slides"></slot>
  </div>
  <slot
    name="navigation"
    :prev-slide="prevSlide"
    :next-slide="nextSlide"
    :to-slide="toSlide"
  ></slot>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';

// TODO: this is a DOM type, but is not detected by Volar
type ScrollBehavior = 'auto' | 'smooth';

export interface AppSliderProps {
  showNavigationButtons: boolean;
  infinite: boolean;
}

export interface AppSliderSlideEventDetails {
  slideNumber: number;
  slideEl: HTMLElement;
}

const emit = defineEmits<{
  (e: 'slide', details: AppSliderSlideEventDetails): void;
}>();

const props = withDefaults(defineProps<AppSliderProps>(), {
  showNavigationButtons: false,
  infinite: false,
});

const activeSlide = ref(0);
const slideCount = ref(0);
const slidesContainerEl = ref<HTMLElement | null>(null);
const slideEls = ref<HTMLElement[]>([]);

/**
 * Go to a specific slide
 * @param slideNumber The slide number to go to
 */
const toSlide = (slideNumber: number, behavior: ScrollBehavior = 'smooth') => {
  // Get the slide element
  const slideEl = slideEls.value[slideNumber];

  // Validate inputs
  if (slideNumber < 0 || slideNumber >= slideCount.value) {
    throw new Error(`slideNumber ${slideNumber} is out of bounds!`);
  }
  if (!slidesContainerEl.value) throw new Error('slidesContainerEl is null!');
  if (!slideEl)
    throw new Error(`slide element with index ${slideNumber} not found!`);

  // Scroll to the slide
  slideEl.scrollIntoView({ behavior, block: 'center' });

  // Finish up
  activeSlide.value = slideNumber;
  emit('slide', {
    slideNumber,
    slideEl,
  });
};

/**
 * Go to the previous slide
 */
const prevSlide = (behavior?: ScrollBehavior) => {
  let prevIndex = activeSlide.value - 1;
  // If we're at the beginning, go to the end
  if (prevIndex < 0) {
    if (!props.infinite) return; // If we're not infinite, don't do anything
    prevIndex = slideCount.value - 1;
  }
  toSlide(prevIndex, behavior);
};

/**
 * Go to the next slide
 */
const nextSlide = (behavior?: ScrollBehavior) => {
  let nextIndex = activeSlide.value + 1;
  // If we're at the end, go back to the beginning
  if (nextIndex >= slideCount.value) {
    if (!props.infinite) return; // If we're not infinite, don't do anything
    nextIndex = 0;
  }
  toSlide(nextIndex, behavior);
};

const handleResize = () => {
  toSlide(activeSlide.value, 'auto');
};

onMounted(() => {
  slideEls.value.push(
    ...(Array.from(slidesContainerEl.value?.children || []) as HTMLElement[])
  );
  slideCount.value = slideEls.value.length;
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
