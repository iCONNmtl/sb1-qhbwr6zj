import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, List, ListOrdered, Heading1, Heading2, Heading3 } from 'lucide-react';
import clsx from 'clsx';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-t-lg border-b border-gray-200">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={clsx(
          'p-2 rounded hover:bg-gray-200 transition-colors',
          editor.isActive('bold') && 'bg-gray-200 text-indigo-600'
        )}
        title="Gras (Ctrl+B)"
      >
        <Bold className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={clsx(
          'p-2 rounded hover:bg-gray-200 transition-colors',
          editor.isActive('italic') && 'bg-gray-200 text-indigo-600'
        )}
        title="Italique (Ctrl+I)"
      >
        <Italic className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={clsx(
          'p-2 rounded hover:bg-gray-200 transition-colors',
          editor.isActive('underline') && 'bg-gray-200 text-indigo-600'
        )}
        title="Souligné (Ctrl+U)"
      >
        <UnderlineIcon className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={clsx(
          'p-2 rounded hover:bg-gray-200 transition-colors',
          editor.isActive('heading', { level: 1 }) && 'bg-gray-200 text-indigo-600'
        )}
        title="Titre 1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={clsx(
          'p-2 rounded hover:bg-gray-200 transition-colors',
          editor.isActive('heading', { level: 2 }) && 'bg-gray-200 text-indigo-600'
        )}
        title="Titre 2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={clsx(
          'p-2 rounded hover:bg-gray-200 transition-colors',
          editor.isActive('heading', { level: 3 }) && 'bg-gray-200 text-indigo-600'
        )}
        title="Titre 3"
      >
        <Heading3 className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={clsx(
          'p-2 rounded hover:bg-gray-200 transition-colors',
          editor.isActive('bulletList') && 'bg-gray-200 text-indigo-600'
        )}
        title="Liste à puces"
      >
        <List className="h-4 w-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={clsx(
          'p-2 rounded hover:bg-gray-200 transition-colors',
          editor.isActive('orderedList') && 'bg-gray-200 text-indigo-600'
        )}
        title="Liste numérotée"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        onClick={addLink}
        className={clsx(
          'p-2 rounded hover:bg-gray-200 transition-colors',
          editor.isActive('link') && 'bg-gray-200 text-indigo-600'
        )}
        title="Ajouter un lien"
      >
        <LinkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-indigo-600 hover:text-indigo-500 underline'
        }
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-4 min-h-[200px] focus:outline-none"
      />
    </div>
  );
}