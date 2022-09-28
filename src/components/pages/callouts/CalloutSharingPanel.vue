<template>
  <div class="my-2 flex h-auto flex-col border border-primary-40 p-5">
    {{ t('callout.share.address') }}

    <div
      class="mt-2 mb-4 flex flex-row items-center justify-between rounded bg-white pl-3"
    >
      <span class="mr-2 text-link">{{ calloutUrl }}</span>
      <AppButton icon="copy" size="sm" @click="copyToClipboard">{{
        t('common.copy')
      }}</AppButton>
    </div>

    {{ t('callout.share.services') }}

    <div class="mt-3 grid w-2/3 grid-cols-3 grid-rows-2 gap-2">
      <div>
        <a
          :href="
            'https://www.facebook.com/sharer/sharer.php?u=' +
            encodeURIComponent(calloutUrl)
          "
          target="_blank"
          rel="nofollow noopener"
        >
          <font-awesome-icon :icon="['fab', 'facebook']" class="mr-1" />
          Facebook
        </a>
      </div>
      <div>
        <a
          :href="
            'https://www.linkedin.com/shareArticle?mini=true&url=' +
            encodeURIComponent(calloutUrl)
          "
          target="_blank"
          rel="nofollow noopener"
        >
          <font-awesome-icon :icon="['fab', 'linkedin']" class="mr-1" />
          LinkedIn
        </a>
      </div>
      <div>
        <a
          :href="
            'https://telegram.me/share/url?url=' +
            encodeURIComponent(calloutUrl)
          "
          target="_blank"
          rel="nofollow noopener"
        >
          <font-awesome-icon :icon="['fab', 'telegram']" class="mr-1" />
          Telegram
        </a>
      </div>
      <div>
        <a
          :href="
            'https://twitter.com/share?url=' + encodeURIComponent(calloutUrl)
          "
          target="_blank"
          rel="nofollow noopener"
        >
          <font-awesome-icon :icon="['fab', 'twitter']" class="mr-1" />
          Twitter
        </a>
      </div>
      <div>
        <a
          :href="
            'https://api.whatsapp.com/send?text=' +
            encodeURIComponent(calloutUrl)
          "
          target="_blank"
          rel="nofollow noopener"
        >
          <font-awesome-icon :icon="['fab', 'whatsapp']" class="mr-1" />
          WhatsApp
        </a>
      </div>
      <div>
        <a
          :href="'mailto:?body=' + encodeURIComponent(calloutUrl)"
          target="_blank"
          rel="nofollow noopener"
        >
          <font-awesome-icon :icon="['fa', 'envelope']" class="mr-1" />
          {{ t('form.email') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import AppButton from '../../forms/AppButton.vue';

const { t } = useI18n();

const props = defineProps<{
  slug: string;
}>();

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const calloutUrl = `${baseUrl}/callouts/${props.slug}`;

const copyToClipboard = () => navigator.clipboard.writeText(calloutUrl);
</script>
