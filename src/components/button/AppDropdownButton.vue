<template>
  <AppButton
    ref="buttonRef"
    variant="primaryOutlined"
    :icon="icon"
    class="group"
    :class="open ? '!rounded-b-none !bg-white' : ''"
    :disabled="disabled"
    :title="title"
    @click="open = !open"
  >
    <span v-if="showTitle">{{ title }} </span>

    <template #after>
      <div
        class="border text-left text-sm font-normal text-body-80 shadow-lg"
        :class="{ [sharedClasses]: true, hidden: !open }"
        @click.stop
      >
        <slot />
      </div>
      <div
        v-show="open"
        :class="sharedClasses"
        class="box-content w-full border-x pt-px"
      />
    </template>
  </AppButton>
</template>

<script lang="ts" setup>
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { onBeforeMount, onBeforeUnmount, ref, toRef, watch } from 'vue';
import AppButton from './AppButton.vue';

const props = defineProps<{
  icon: IconDefinition;
  title: string;
  showTitle?: boolean;
  disabled?: boolean;
}>();

const sharedClasses =
  'absolute top-full min-w-full -left-px z-20 border-primary-40 group-hover:border-primary-80 bg-white';

const buttonRef = ref<InstanceType<typeof AppButton>>();
const open = ref(false);

watch(toRef(props, 'disabled'), (disabled) => {
  if (disabled) open.value = false;
});

function handleClick(evt: Event) {
  if (!buttonRef.value?.$el.contains(evt.target as Node)) {
    open.value = false;
  }
}

onBeforeMount(() => {
  document.addEventListener('click', handleClick);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClick);
});
</script>
