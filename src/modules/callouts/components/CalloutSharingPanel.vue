<template>
	<div class="flex flex-col border border-primary-40 p-5">
		Share this callout with the following address:

		<div
			class="
				bg-white
				rounded
				pl-3
				justify-between
				flex flex-row
				items-center
				mt-2
				mb-4
			"
		>
			<span class="text-link mr-2">{{ calloutUrl }}</span>
			<AppButton icon="copy" size="sm" @click="copyToClipboard">Copy</AppButton>
		</div>

		Or quickly share using one of these services:
		<div class="grid gap-2 grid-cols-3 grid-rows-2 mt-2">
			<div>x Facebook</div>
			<div>x LinkedIn</div>
			<div>x Telegram</div>
			<div>x Twitter</div>
			<div>x WhatsApp</div>
			<div>x E-mail</div>
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
