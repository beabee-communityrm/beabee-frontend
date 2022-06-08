<template>
  <label v-if="label" class="block mb-1.5 font-semibold">{{ label }} </label>

  <div v-if="editor" class="mb-2 min-h-[2rem] h-auto">
    <div class="flex flex-row">
      <RichTextEditorButton
        icon="bold"
        :active="editor.isActive('bold')"
        @click="run((cmd) => cmd.toggleBold())"
      />
      <RichTextEditorButton
        icon="italic"
        :active="editor.isActive('italic')"
        @click="run((cmd) => cmd.toggleItalic())"
      />
      <RichTextEditorButton
        icon="underline"
        :active="editor.isActive('underline')"
        @click="run((cmd) => cmd.toggleUnderline())"
      />
      <RichTextEditorButton
        icon="strikethrough"
        :active="editor.isActive('strike')"
        @click="run((cmd) => cmd.toggleStrike())"
      />
      <RichTextEditorButton
        icon="heading"
        :active="editor.isActive('heading', { level: 3 })"
        @click="run((cmd) => cmd.toggleHeading({ level: 3 }))"
      />
      <RichTextEditorButton
        icon="list"
        :active="editor.isActive('bulletList')"
        @click="run((cmd) => cmd.toggleBulletList())"
      />
      <RichTextEditorButton
        icon="list-ol"
        :active="editor.isActive('orderedList')"
        @click="run((cmd) => cmd.toggleOrderedList())"
      />
      <RichTextEditorButton
        icon="link"
        :active="editor.isActive('link')"
        @click="setLink"
      />
    </div>
  </div>
  <editor-content :editor="editor" class="content-message" />
</template>

<script lang="ts" setup="{ emit }">
import { onBeforeUnmount, watch } from 'vue';
import { useEditor, EditorContent, ChainedCommands } from '@tiptap/vue-3';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import Typeography from '@tiptap/extension-typography';
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
    Typeography,
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

function run(cb: (cmd: ChainedCommands) => ChainedCommands) {
  if (editor.value) cb(editor.value.chain().focus()).run();
}

function setLink() {
  if (!editor.value) return;

  const previousUrl = editor.value.getAttributes('link').href;
  const url = window.prompt('Set URL (blank to remove)', previousUrl);

  if (url === null) {
    return;
  }

  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
  } else {
    editor.value
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run();
  }
}
</script>

<style>
.ProseMirror {
  @apply p-2 min-h-[5rem] h-auto bg-white w-full border border-primary-40 rounded focus:outline-none focus:shadow-input;
}
</style>
