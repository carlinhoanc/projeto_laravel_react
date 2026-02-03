import { Editor } from '@tinymce/tinymce-react';

interface HTMLEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export function HTMLEditor({ value, onChange, placeholder = 'Digite aqui...', height = 300 }: HTMLEditorProps) {
  return (
    <Editor
      apiKey="no-api-key"
      value={value}
      onEditorChange={onChange}
      init={{
        height: height,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        branding: false,
        toolbar_location: 'top',
        content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }',
        promotion: false,
        placeholder: placeholder,
      }}
    />
  );
}