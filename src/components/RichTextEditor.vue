<template>
	<label v-if="label" class="block mb-1.5 font-semibold">{{ label }} </label>

	<editor-content :editor="editor" />
	<div v-if="editor">
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
		</div>
	</div>
</template>

<script lang="ts" setup="{ emit }">
import {
	useEditor,
	EditorContent,
	BubbleMenu,
	FloatingMenu,
} from '@tiptap/vue-3';
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
	extensions: [StarterKit],
	onUpdate: () => emit('update:modelValue', editor.value.getHTML()),
});
</script>

<style>
.ProseMirror {
	@apply p-2 h-[5rem] bg-white w-full border border-primary-40 rounded focus:outline-none focus:shadow-input;
}
</style>
