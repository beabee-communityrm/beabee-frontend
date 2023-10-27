<route lang="yaml">
name: adminUiToolkit
meta:
  pageTitle: menu.uiToolkit
  role: admin
</route>

<template>
  <PageTitle border :title="t('menu.uiToolkit')" />
  <AppTitle class="mb-3">Typography</AppTitle>
  <div class="grid gap-8 lg:grid-cols-2">
    <div>
      <div class="mb-10 space-y-3">
        <AppHeading>Headings</AppHeading>
        <p class="mb-3">All headings are set in the title font.</p>

        <div class="bg-white p-6 space-y-3">
          <AppTitle>h1 AppTitle 32px</AppTitle>
          <AppHeading>h2 AppHeading 26px</AppHeading>
          <AppSubHeading>h3 AppSubHeading 22px</AppSubHeading>
          <AppSectionHeading>h4 AppSectionHeading 20px</AppSectionHeading>
        </div>
      </div>
      <div class="mb-10 space-y-3">
        <AppSubHeading>Other headings</AppSubHeading>
        <div class="bg-white p-6 mb-3 space-y-3">
          <!-- <PageTitle :title="t('menu.uiToolkit')" /> -->
          <PageTitle title="PageTitle" />
          <p>
            This extends AppTitle, and should only be used once in a page, as
            its title.
          </p>
          <AppTitle big>h1 AppTitle big 48px</AppTitle>
          <p>
            To be used in places where we need an extra large headings, such as
            the callout page or the 404 error page. In screens smaller than
            768px, this is resized to 32px.
          </p>
          <SectionTitle>h2 SectionTitle</SectionTitle>
          <p>
            Used only in the user dashboard page, and has a specific style for
            mobile.
          </p>
        </div>
        <p></p>
        <p></p>
      </div>
    </div>

    <div>
      <div class="mb-10 space-y-3">
        <AppHeading>Paragraphs</AppHeading>
        <p>Texts are set using the body text font.</p>
        <p class="text-lg">
          This is a lead paragraph, with the <em>text-lg</em> class. It's used
          to highlight a paragraph in a text, such as the first sentence in an
          error notification box, the introductory paragraph of a callout, or a
          call to action before a longer explanation.
        </p>
        <p>
          This is a normal paragraph. The default body text size is 16px across
          screen sizes.
        </p>
        <p class="text-sm">
          There is also a small text size, set in 14px, using class
          <em>text-sm</em>. This size is used to set auxiliary texts such as
          informative notes in the callout builder interface, table data or
          pagination.
        </p>
        <p class="text-xs">
          Extra small text is used for additional information, e.g. password
          input field details or payment method details.
        </p>
      </div>
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
