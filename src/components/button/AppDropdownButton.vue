<template>
  <AppButton
    variant="primaryOutlined"
    :icon="icon"
    class="group"
    :class="open ? '!rounded-b-none !bg-white' : ''"
    :disabled="disabled"
    @click="open = !open"
  >
    <div
      class="border text-left text-sm font-normal text-body-80"
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
  </AppButton>
</template>

<script lang="ts" setup>
import { ref, toRef, watch } from 'vue';
import AppButton from './AppButton.vue';

const props = defineProps<{
  icon: string;
  disabled?: boolean;
}>();

const sharedClasses =
  'absolute top-full -left-px z-20 border-primary-40 group-hover:border-primary-80 bg-white';

const open = ref(false);

watch(toRef(props, 'disabled'), (disabled) => {
  if (disabled) open.value = false;
});
</script>
