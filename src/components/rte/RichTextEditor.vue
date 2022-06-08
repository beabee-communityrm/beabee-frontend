<template>
  <label v-if="label" class="block mb-1.5 font-semibold">{{ label }} </label>

  <div v-if="editor" class="mb-2 min-h-[2rem] h-auto">
    <div class="flex flex-row">
      <RichTextEditorButton
        icon="bold"
        :active="editor.isActive('bold')"
        @click="editor.chain().focus().toggleBold().run()"
      />
      <RichTextEditorButton
        icon="italic"
        :active="editor.isActive('italic')"
        @click="editor.chain().focus().toggleItalic().run()"
      />
      <RichTextEditorButton
        icon="underline"
        :active="editor.isActive('underline')"
        @click="editor.chain().focus().toggleUnderline().run()"
      />
      <RichTextEditorButton
        icon="strikethrough"
        :active="editor.isActive('strike')"
        @click="editor.chain().focus().toggleStrike().run()"
      />
      <RichTextEditorButton
        icon="heading"
        :active="editor.isActive('heading', { level: 3 })"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      />
      <RichTextEditorButton
        icon="list"
        :active="editor.isActive('bulletList')"
        @click="editor.chain().focus().toggleBulletList().run()"
      />
      <RichTextEditorButton
        icon="list-ol"
        :active="editor.isActive('orderedList')"
        @click="editor.chain().focus().toggleOrderedList().run()"
      />

      <!-- <RichTextEditorButton
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
  <editor-content :editor="editor" class="content-message" />
</template>

<script lang="ts" setup="{ emit }">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { onBeforeUnmount, watch } from 'vue';
import RichTextEditorButton from './RichTextEditorButton.vue';

const props = defineProps<{
  modelValue: string;
  label?: string;
  required?: boolean;
}>();
const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      blockquote: false,
      codeBlock: false,
      heading: { levels: [3] },
      horizontalRule: false,
    }),
    Underline,
    Link.configure({
      openOnClick: false,
    }),
  ],
  onUpdate: () =>
    editor.value && emit('update:modelValue', editor.value.getHTML()),
});

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value, false);
    }
  }
);

onBeforeUnmount(() => {
  editor.value?.destroy();
});

const setLink = () => {
  const previousUrl = editor.value?.getMarkAttributes('link').href;
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
</style>
