<route lang="yaml">
name: theme
meta:
  noAuth: true
  pageTitle: Theme settings
</route>
<template>
  <section class="my-5">
    <h2 class="mb-2 font-title text-2xl">Colours</h2>
    <div class="flex bg-white p-4">
      <div class="flex-1">
        <AppColor name="bg-primary" shade="Primary" />
        <AppColor name="bg-primary-5" shade="5" />
        <AppColor name="bg-primary-10" shade="10" />
        <AppColor name="bg-primary-20" shade="20" />
        <AppColor name="bg-primary-40" shade="40" />
        <AppColor name="bg-primary-70" shade="70" />
        <AppColor name="bg-primary-80" shade="80" />
      </div>
      <div class="flex-1">
        <AppColor name="bg-body" shade="Body" />
        <AppColor name="bg-body-40" shade="40" />
        <AppColor name="bg-body-80" shade="80" />
      </div>
      <div class="flex-1">
        <AppColor name="bg-link" shade="Link" />
        <AppColor name="bg-link-10" shade="10" />
        <AppColor name="bg-link-30" shade="30" />
        <AppColor name="bg-link-70" shade="70" />
        <AppColor name="bg-link-110" shade="110" />
      </div>
      <div class="flex-1">
        <AppColor name="bg-warning" shade="Warning" />
        <AppColor name="bg-warning-10" shade="10" />
        <AppColor name="bg-warning-30" shade="30" />
        <AppColor name="bg-warning-70" shade="70" />
      </div>
      <div class="flex-1">
        <AppColor name="bg-success" shade="Success" />
        <AppColor name="bg-success-10" shade="10" />
        <AppColor name="bg-success-30" shade="30" />
        <AppColor name="bg-success-70" shade="70" />
        <AppColor name="bg-success-110" shade="110" />
      </div>
      <div class="flex-1">
        <AppColor name="bg-danger" shade="Danger" />
        <AppColor name="bg-danger-10" shade="10" />
        <AppColor name="bg-danger-30" shade="30" />
        <AppColor name="bg-danger-70" shade="70" />
        <AppColor name="bg-danger-110" shade="110" />
      </div>
      <div class="flex-1">
        <AppColor name="bg-grey" shade="Grey" />
        <AppColor name="bg-grey-lighter" shade="Lighter" />
        <AppColor name="bg-grey-light" shade="Light" />
        <AppColor name="bg-grey-dark" shade="Dark" />
        <AppColor name="bg-grey-darker" shade="Darker" />
      </div>
    </div>
  </section>

  <section class="my-5">
    <h2 class="mb-2 font-title text-2xl">Components</h2>

    <section>
      <h3 class="mb-2 font-title text-xl">AppSlider</h3>
      <div class="bg-white p-4">
        <div class="max-w-[1200px] mx-auto relative">
          <AppSlider :show-navigation-buttons="true" :infinite="true">

            <!-- Put your slides here -->
            <template #slides>
              <div class="flex-none w-full bg-danger">
                <img class="mx-auto max-w-full" src="https://picsum.photos/seed/1/1200/300" alt="Lorem Picsum">
              </div>
              <div class="flex-none w-full bg-success">
                <div class="w-full h-full flex justify-center items-center">
                  <p>You can put anything you want in here!</p>
                </div>
              </div>
              <div class="flex-none w-full bg-warning">
                <img class="mx-auto max-w-full" src="https://picsum.photos/seed/2/1200/300" alt="Lorem Picsum">
              </div>
            </template>

            <!-- Define your custom navigation template here -->
            <template #navigation="{ nextSlide, prevSlide, toSlide }">
              <span class="w-full h-full flex justify-between absolute top-0">
                <button class="" @click="prevSlide()">
                  <font-awesome-icon class="text-2xl p-2 text-white hover:text-link" :icon="PrevIcon" />
                </button>
                <button @click="nextSlide()">
                  <font-awesome-icon class="text-2xl p-2 text-white hover:text-link" :icon="NextIcon" />
                </button>
              </span>

              <button class="text-2xl p-2 text-white hover:text-link absolute top-0 left-0" @click="toSlide(0)">
                <font-awesome-icon :icon="ResetIcon" />
              </button>

            </template>

          </AppSlider>
        </div>
      </div>

    </section>


  </section>
</template>

<script lang="ts" setup>
import AppColor from '../components/AppColor.vue';
import AppSlider from '../components/AppSlider.vue';
import {
  faAngleRight as NextIcon,
  faAngleLeft as PrevIcon,
  faRotateBack as ResetIcon,
} from '@fortawesome/free-solid-svg-icons';
</script>
