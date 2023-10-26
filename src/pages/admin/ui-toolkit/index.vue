<route lang="yaml">
name: adminUiToolkit
meta:
  pageTitle: menu.uiToolkit
  role: admin
</route>

<template>
  <PageTitle border :title="t('menu.uiToolkit')" />
  <div class="mb-6 space-y-3">
    <AppHeading>{{ t('uiToolkit.typography.title') }}</AppHeading>
    <p>
      List of fonts here (title font / text font; serif vs sans)
    </p>
  </div>

  <div class="grid gap-8 lg:grid-cols-2">
    <div>
      <div class="mb-10 space-y-3">
        <AppHeading>Headings</AppHeading>

        <p>
          These are the different levels of headings we have and use in the page
          area content.
        </p>
        <div class="bg-white p-6 space-y-3">
          <AppTitle>h1 AppTitle 32px (was 28px)</AppTitle>
          <AppHeading>h2 AppHeading 26px (was 20px)</AppHeading>
          <AppSubHeading>h3 AppSubHeading 22px (was 18px)</AppSubHeading>
          <AppSectionHeading>h4 AppSectionHeading 20px (new)</AppSectionHeading>
        </div>
      </div>
      <div class="mb-10 space-y-3">
        <AppSubHeading>Other headings</AppSubHeading>
        <div class="bg-white p-6 mb-3 space-y-3">
          <PageTitle :title="t('menu.uiToolkit')" />
          <AppTitle big>h1 AppTitle big 48px</AppTitle>
          <SectionTitle>h2 SectionTitle</SectionTitle>
        </div>
        <p>
          The PageTitle component, extends AppTitle. It should be used only
          once, for the page title.
        </p>
        <p>
          AppTitle big is to be used in places where we need an extra large
          heading such as the callout page or the 404 error page. In screens
          smaller than 768px AppTitle big is resized to 32px.
        </p>
        <p>
          Section title is used only in the user dashboard page; has a specific
          style for mobile
        </p>
      </div>
    </div>

    <div>
      <div class="mb-10 space-y-3">
        <AppHeading>Paragraphs</AppHeading>
        <p>
          The default body text size is 16px across screen sizes.
        </p>
        <p class="text-lg">
          This is a lead paragraph, it uses class <em>text-lg</em>. It's used to
          highlight a paragraph in a text. Examples: the first sentence in an
          error notification box; the introductory paragraph of a callout; a
          call to action.
        </p>
        <p class="text-sm">
          There is also a small text size, set 14px, using class
          <em>text-lg</em>. The small text size is used to set auxiliary texts
          such as informative notes in the callout builder interface, table
          data, pagination.
        </p>
        <p>
          Extra small text is used for additional informations. For example,
          password input field details, the labels on payment methods in .
        </p>
        <p class="text-xs bg-white p-3">
          This is extra small text, set in 12px, using class <em>text-lg</em>.
        </p>
      </div>
      <div class="mb-10 space-y-3">
        <AppHeading>Labels, tags</AppHeading>
        <p class="flex items-baseline">
          <AppBadge class="w-fit mr-2">AppBadge</AppBadge> - didn't find this
          component in use
        </p>
        <ul>
          <li class="flex items-baseline">
            <AppRoundBadge :type="success" /> - success
          </li>
          <li class="flex items-baseline">
            <AppRoundBadge :type="warning" /> - warning
          </li>
          <li class="flex items-baseline">
            <AppRoundBadge :type="danger" /> - danger
          </li>
        </ul>
      </div>
    </div>

    <div class="mb-6">
      <AppHeading class="mb-3">Things to review</AppHeading>
      <ul>
        <li>Callout card component: should use a heading for card title</li>
        <li>headings are missing mobile size adjustments</li>
      </ul>
    </div>
  </div>

  <div class="mb-2">
    <AppHeading>Buttons</AppHeading>
  </div>

  <div class="grid gap-8 lg:grid-cols-2">
    <div class="mb-6 space-y-3">
      <p>All button styles and uses</p>
      <ul class="flex flex-col space-y-4">
        <li><AppButton variant="primary">Primary</AppButton></li>
        <li>
          <AppButton variant="primaryOutlined">Primary Outlined</AppButton>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import AppTitle from '../../../components/AppTitle.vue';
import PageTitle from '../../../components/PageTitle.vue';
import AppHeading from '../../../components/AppHeading.vue';
import AppSubHeading from '../../../components/AppSubHeading.vue';
import AppSectionHeading from '../../../components/AppSectionHeading.vue';
import SectionTitle from '../../../components/pages/profile/SectionTitle.vue';
import AppBadge from '../../../components/AppBadge.vue';
import AppRoundBadge from '../../../components/AppRoundBadge.vue';
import AppButton from '../../../components/button/AppButton.vue';

const { t } = useI18n();
</script>
