import React, { useCallback, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

// ── Preset text colors ──────────────────────────────────────────────
const COLORS = [
  { label: 'Default', value: '' },
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Teal', value: '#14b8a6' },
  { label: 'Blue', value: '#137fec' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Pink', value: '#ec4899' },
];

// ── Toolbar button ──────────────────────────────────────────────────
const ToolBtn: React.FC<{
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ active, onClick, title, children, disabled }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={title}
    disabled={disabled}
    className={`flex items-center justify-center w-7 h-7 rounded text-sm font-medium transition-colors
      ${
        active
          ? 'bg-primary text-white'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
      } disabled:opacity-40`}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5 self-center" />
);

// ── Main component ──────────────────────────────────────────────────
interface RichTextEditorProps {
  value: string; // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "What's on your mind? Use #tags to reach communities...",
  minHeight = '120px',
  className = '',
}) => {
  const [colorOpen, setColorOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Treat editor-empty state as empty string so parent can disable submit
      onChange(editor.isEmpty ? '' : html);
    },
    editorProps: {
      attributes: {
        class: `bg-slate-50 dark:bg-[#233648]/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all`,
        style: `min-height:${minHeight}`,
      },
    },
  });

  const setColor = useCallback(
    (color: string) => {
      if (!editor) return;
      if (color) {
        editor.chain().focus().setColor(color).run();
      } else {
        editor.chain().focus().unsetColor().run();
      }
      setColorOpen(false);
    },
    [editor],
  );

  if (!editor) return null;

  const activeColor = editor.getAttributes('textStyle').color as
    | string
    | undefined;

  return (
    <div
      data-testid="rich-text-editor"
      className={`tiptap-editor flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-[#233648]/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all ${className}`}
    >
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/60">
        {/* Format */}
        <ToolBtn
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_bold
          </span>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_italic
          </span>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_underlined
          </span>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <span className="material-symbols-outlined text-[16px]">
            strikethrough_s
          </span>
        </ToolBtn>

        <Divider />

        {/* Headings */}
        <ToolBtn
          active={editor.isActive('heading', { level: 2 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          title="Heading 2"
        >
          <span className="text-xs font-bold">H2</span>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive('heading', { level: 3 })}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          title="Heading 3"
        >
          <span className="text-xs font-bold">H3</span>
        </ToolBtn>

        <Divider />

        {/* Lists */}
        <ToolBtn
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_list_bulleted
          </span>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_list_numbered
          </span>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Quote"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_quote
          </span>
        </ToolBtn>

        <Divider />

        {/* Alignment */}
        <ToolBtn
          active={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align left"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_align_left
          </span>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align center"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_align_center
          </span>
        </ToolBtn>
        <ToolBtn
          active={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align right"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_align_right
          </span>
        </ToolBtn>

        <Divider />

        {/* Color picker */}
        <div className="relative">
          <ToolBtn
            active={!!activeColor}
            onClick={() => setColorOpen((o) => !o)}
            title="Text color"
          >
            <span className="flex flex-col items-center gap-0 leading-none">
              <span className="material-symbols-outlined text-[15px]">
                palette
              </span>
              <span
                className="w-3.5 h-1 rounded-full mt-0.5"
                style={{ background: activeColor || '#137fec' }}
              />
            </span>
          </ToolBtn>
          {colorOpen && (
            <div
              className="absolute top-full left-0 mt-1 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2 flex gap-1.5 flex-wrap w-[148px]"
              onMouseDown={(e) => e.preventDefault()}
            >
              {COLORS.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  title={c.label}
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    activeColor === c.value || (!activeColor && !c.value)
                      ? 'border-primary scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ background: c.value || '#334155' }}
                />
              ))}
            </div>
          )}
        </div>

        <Divider />

        {/* Clear formatting */}
        <ToolBtn
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
          title="Clear formatting"
        >
          <span className="material-symbols-outlined text-[16px]">
            format_clear
          </span>
        </ToolBtn>
      </div>

      {/* ── Editor content ── */}
      <EditorContent editor={editor} />
    </div>
  );
};
