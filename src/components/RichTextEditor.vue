<template>
	<p>text box below but invisible :sad:</p>
	<editor-content :editor="editor" />
</template>

<script lang="ts" setup="{ emit }">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';

const props = defineProps<{
	modelValue: string;
}>();
const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
	content: props.modelValue.value,
	extensions: [StarterKit],
	onUpdate: () => emit('update:modelValue', editor.value.getHTML()),
});
</script>
