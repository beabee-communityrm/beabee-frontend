<template>
	<label v-if="label" class="block mb-1.5 font-semibold">{{ label }} </label>
	<editor-content :editor="editor" />
</template>

<script lang="ts" setup="{ emit }">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

const props = defineProps<{
	modelValue: string;
	label?: string;
	required?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

console.log(props.label, props.required);

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
