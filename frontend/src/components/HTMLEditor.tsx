import { useState } from 'react';

interface HTMLEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function HTMLEditor({ value, onChange, placeholder = 'Digite aqui (aceita HTML)', rows = 5 }: HTMLEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {showPreview ? '?? Editar' : '??? Preview'}
        </button>
        <span className="text-xs text-gray-600">
          Tags: &lt;b&gt;, &lt;i&gt;, &lt;br/&gt;, &lt;ul&gt;&lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;p&gt;, &lt;a href=""&gt;
        </span>
      </div>

      {!showPreview ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="border border-gray-300 p-2 rounded w-full font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <div className="border border-gray-300 p-3 rounded bg-gray-50 min-h-24 text-sm prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: value || '<em>Nenhum conte�do</em>' }} />
        </div>
      )}
    </div>
  );
}
