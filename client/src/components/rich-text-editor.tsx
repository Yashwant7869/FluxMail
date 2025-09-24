import { useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const insertVariable = (variable: string) => {
    const textArea = document.getElementById('rich-editor') as HTMLTextAreaElement;
    if (textArea) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      const newContent = content.substring(0, start) + variable + content.substring(end);
      onChange(newContent);
      
      // Set cursor position after inserted variable
      setTimeout(() => {
        textArea.focus();
        textArea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  const variables = [
    { label: 'Name', value: '{{name}}' },
    { label: 'Email', value: '{{email}}' },
    { label: 'Company', value: '{{company}}' }
  ];

  return (
    <div className="border border-input rounded-lg bg-background">
      {/* Toolbar */}
      <div className="border-b border-input p-3 flex items-center space-x-2 flex-wrap">
        <button
          type="button"
          className="p-2 hover:bg-accent rounded"
          title="Bold"
          onClick={() => document.execCommand('bold')}
          data-testid="button-bold"
        >
          <i className="fas fa-bold text-sm"></i>
        </button>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded"
          title="Italic"
          onClick={() => document.execCommand('italic')}
          data-testid="button-italic"
        >
          <i className="fas fa-italic text-sm"></i>
        </button>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded"
          title="Underline"
          onClick={() => document.execCommand('underline')}
          data-testid="button-underline"
        >
          <i className="fas fa-underline text-sm"></i>
        </button>
        <div className="w-px h-6 bg-border"></div>
        <button
          type="button"
          className="p-2 hover:bg-accent rounded"
          title="Link"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) document.execCommand('createLink', false, url);
          }}
          data-testid="button-link"
        >
          <i className="fas fa-link text-sm"></i>
        </button>
        <div className="w-px h-6 bg-border"></div>
        
        <select
          className="px-2 py-1 text-xs border border-input rounded bg-background"
          onChange={(e) => {
            if (e.target.value) {
              insertVariable(e.target.value);
              e.target.value = '';
            }
          }}
          data-testid="select-variables"
        >
          <option value="">Variables</option>
          {variables.map((variable) => (
            <option key={variable.value} value={variable.value}>
              {variable.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Editor Content */}
      <div className="p-4">
        <textarea
          id="rich-editor"
          className="w-full min-h-[200px] max-h-[400px] resize-none outline-none bg-transparent"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Start typing your email content..."
          data-testid="textarea-email-content"
        />
      </div>
    </div>
  );
}
