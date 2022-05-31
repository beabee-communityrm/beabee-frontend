<template>
	<label v-if="label" class="block mb-1.5 font-semibold">{{ label }} </label>

	<div v-if="editor" class="mb-2 min-h-[2rem] h-auto">
		<div class="flex flex-row">
			<AppButton
				type="button"
				variant="primaryOutlined"
				icon="bold"
				:class="{ 'is-active': editor.isActive('bold') }"
				class="mr-1 mt-1"
				size="sm"
				@click="editor.chain().focus().toggleBold().run()"
				>Bold</AppButton
			>
			<AppButton
				type="button"
				variant="primaryOutlined"
				icon="italic"
				:class="{ 'is-active': editor.isActive('italic') }"
				class="mr-1 mt-1"
				size="sm"
				@click="editor.chain().focus().toggleItalic().run()"
				>Italics</AppButton
			>
			<AppButton
				type="button"
				variant="primaryOutlined"
				icon="underline"
				:class="{ 'is-active': editor.isActive('underline') }"
				class="mr-1 mt-1"
				size="sm"
				@click="editor.chain().focus().toggleUnderline().run()"
				>Underline</AppButton
			>
			<AppButton
				type="button"
				variant="primaryOutlined"
				icon="strikethrough"
				:class="{ 'is-active': editor.isActive('strike') }"
				class="mr-1 mt-1"
				size="sm"
				@click="editor.chain().focus().toggleStrike().run()"
				>Strikethr.</AppButton
			>
			<AppButton
				type="button"
				variant="primaryOutlined"
				icon="heading"
				:class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
				class="mr-1 mt-1"
				size="sm"
				@click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
				>Heading</AppButton
			>
			<AppButton
				type="button"
				variant="primaryOutlined"
				icon="list"
				:class="{ 'is-active': editor.isActive('bulletList') }"
				class="mr-1 mt-1"
				size="sm"
				@click="editor.chain().focus().toggleBulletList().run()"
				>Bullet list</AppButton
			>
			<AppButton
				type="button"
				variant="primaryOutlined"
				icon="list-ol"
				:class="{ 'is-active': editor.isActive('orderedList') }"
				class="mr-1 mt-1"
				size="sm"
				@click="editor.chain().focus().toggleOrderedList().run()"
				>Ordered list</AppButton
			>
			<!-- <AppButton
				type="button"
				variant="primaryOutlined"
				icon="link"
				:class="{ 'is-active': editor.isActive('link') }"
				class="mr-1 mt-1"
				size="sm"
				@click="setLink"
				>Link</AppButton
			> -->
		</div>
	</div>
	<editor-content :editor="editor" />
</template>

<script lang="ts" setup="{ emit }">
import {
	useEditor,
	EditorContent,
	BubbleMenu,
	FloatingMenu,
} from '@tiptap/vue-3';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import AppButton from './forms/AppButton.vue';

const props = defineProps<{
	modelValue: string;
	label?: string;
	required?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
	content: props.modelValue.value,
	extensions: [
		StarterKit,
		Underline,
		Link.configure({
			openOnClick: false,
		}),
	],
	onUpdate: () => emit('update:modelValue', editor.value.getHTML()),
});

const setLink = () => {
	const previousUrl = editor.getMarkAttributes('link').href;
	const url = window.prompt('URL', previousUrl);

	// cancelled
	if (url === null) {
		return;
	}

	// empty
	if (url === '') {
		editor.chain().focus().extendMarkRange('link').unsetLink().run();
		return;
	}

	// update link
	editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};
</script>

<style>
.ProseMirror {
	@apply p-2 min-h-[5rem] h-auto bg-white w-full border border-primary-40 rounded focus:outline-none focus:shadow-input;
}
ul,
ol {
	@apply px-4;
}
ul {
	@apply list-disc;
}
ol {
	@apply list-decimal;
}
h1 {
	@apply font-title text-2.5xl;
}
</style>
