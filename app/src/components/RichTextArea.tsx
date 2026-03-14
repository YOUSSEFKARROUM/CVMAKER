import { useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, Strikethrough, List, ListOrdered, Link } from 'lucide-react';

interface RichTextAreaProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  id?: string;
  minHeight?: string;
}

export function RichTextArea({ value, onChange, placeholder, id, minHeight = '100px' }: RichTextAreaProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync incoming value only when it comes from outside (not from user typing)
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const execFormat = useCallback((command: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, val ?? undefined);
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleLink = useCallback(() => {
    const url = window.prompt("Entrez l'URL du lien (ex: https://example.com) :");
    if (url && url.trim()) {
      execFormat('createLink', url.trim());
    }
  }, [execFormat]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+B, Ctrl+I, Ctrl+U are handled natively by contenteditable
    // Prevent Enter from adding <div> blocks in some browsers
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      document.execCommand('insertLineBreak');
    }
  };

  const toolbarBtn = (onClick: () => void, title: string, icon: React.ReactNode) => (
    <button
      type="button"
      onMouseDown={(e) => {
        // Prevent blur before execCommand
        e.preventDefault();
        onClick();
      }}
      title={title}
      className="p-1.5 hover:bg-gray-200 dark:hover:bg-slate-600 rounded transition-colors text-gray-700 dark:text-gray-300"
    >
      {icon}
    </button>
  );

  return (
    <div className="border border-gray-200 dark:border-slate-600 rounded-lg mt-1 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-800 flex-wrap">
        {toolbarBtn(() => execFormat('bold'), 'Gras (Ctrl+B)', <Bold className="w-4 h-4" />)}
        {toolbarBtn(() => execFormat('italic'), 'Italique (Ctrl+I)', <Italic className="w-4 h-4" />)}
        {toolbarBtn(() => execFormat('underline'), 'Souligné (Ctrl+U)', <Underline className="w-4 h-4" />)}
        {toolbarBtn(() => execFormat('strikeThrough'), 'Barré', <Strikethrough className="w-4 h-4" />)}
        <div className="w-px h-4 bg-gray-300 dark:bg-slate-500 mx-1" />
        {toolbarBtn(() => execFormat('insertUnorderedList'), 'Liste à puces', <List className="w-4 h-4" />)}
        {toolbarBtn(() => execFormat('insertOrderedList'), 'Liste numérotée', <ListOrdered className="w-4 h-4" />)}
        <div className="w-px h-4 bg-gray-300 dark:bg-slate-500 mx-1" />
        {toolbarBtn(handleLink, 'Insérer un lien', <Link className="w-4 h-4" />)}
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        id={id}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className="w-full p-3 outline-none text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-slate-900 rich-text-editor"
        style={{ minHeight }}
      />
    </div>
  );
}
