<template>
	<div class="h-auto flex flex-col border border-primary-40 p-5 my-2">
		Share this callout with the following address:

		<div
			class="
				justify-between
				flex flex-row
				items-center
				bg-white
				rounded
				mt-2
				mb-4
				pl-3
			"
		>
			<span class="text-link mr-2">{{ calloutUrl }}</span>
			<AppButton icon="copy" size="sm" @click="copyToClipboard">Copy</AppButton>
		</div>

		Or quickly share using one of these services:
		<div class="w-2/3 grid gap-2 grid-cols-3 grid-rows-2 mt-3">
			<div>
				<font-awesome-icon :icon="['fab', 'facebook']" class="mr-1" />
				Facebook
			</div>
			<div>
				<font-awesome-icon :icon="['fab', 'linkedin']" class="mr-1" />
				LinkedIn
			</div>
			<div>
				<font-awesome-icon :icon="['fab', 'telegram']" class="mr-1" />
				Telegram
			</div>
			<div>
				<font-awesome-icon :icon="['fab', 'twitter']" class="mr-1" /> Twitter
			</div>
			<div>
				<font-awesome-icon :icon="['fab', 'whatsapp']" class="mr-1" />
				WhatsApp
			</div>
			<div>
				<font-awesome-icon :icon="['fa', 'envelope']" class="mr-1" /> E-mail
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import AppButton from '../../../components/forms/AppButton.vue';

const props = defineProps<{
	slug: string;
}>();

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
const calloutUrl = `${baseUrl}/${props.slug}`;

const copyToClipboard = () => navigator.clipboard.writeText(calloutUrl);
</script>
