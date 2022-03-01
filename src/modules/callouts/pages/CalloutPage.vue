<template>
  <div v-if="callout">
    <div class="mb-5">
      <PageTitle :title="callout.title" />
    </div>
    <div class="md:max-w-xl">
      <div>
        <div class="relative mb-4" style="padding-bottom: 56.25%">
          <img
            class="absolute w-full h-full object-cover"
            :src="callout.image"
          />
        </div>
        <div
          class="mb-4 text-lg pb-4 border-primary-40 border-b"
          v-html="callout.templateSchema.intro"
        />
        <div class="callout-form">
          <Form :form="callout.templateSchema.formSchema" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { Form } from 'vue-formio';
import { useRoute } from 'vue-router';
import { GetMoreCalloutData } from '../../../utils/api/api.interface';
import { fetchCallout } from '../../../utils/api/callout';
import PageTitle from '../../../components/PageTitle.vue';

const route = useRoute();

const callout = ref<GetMoreCalloutData>();

onBeforeMount(async () => {
  callout.value = await fetchCallout(route.params.id as string);
});
</script>
<style>
.callout-form {
  & .form-group {
    @apply mb-8 flex flex-col;

    &.formio-component-button {
      @apply block;
    }
  }

  & .col-form-label {
    @apply block text-xl font-semibold mb-2;

    order: -2;
  }

  & .form-text {
    @apply mb-2 text-body-80;

    order: -1;
  }

  & .form-control {
    @apply p-2 w-full bg-white border border-primary-40 rounded focus:outline-none focus:shadow-input;
  }

  & .form-check-input {
    accent-color: theme('colors.link.DEFAULT');
  }

  & .form-check-inline {
    @apply inline-block mr-4;
  }

  & .form-check-label {
    @apply flex align-baseline mb-2;

    & .form-check-input {
      @apply flex-none mr-2;
    }
  }

  & .btn {
    @apply px-4 text-center cursor-pointer inline-flex justify-center items-center font-bold rounded whitespace-nowrap relative h-10 bg-link text-white;

    &:not([disabled]):hover {
      @apply hover:bg-link-110;
    }
  }

  & .formio-select-autocomplete-input {
    @apply opacity-0 absolute -z-1;
  }

  & .field-required::after {
    @apply text-danger;

    content: '*';
  }
}
</style>
