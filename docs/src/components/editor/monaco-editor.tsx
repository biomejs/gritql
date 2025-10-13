import { useRef, useMemo, useState, useEffect } from 'react';
import merge from 'lodash/merge';
import Editor, { OnMount, EditorProps, useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { gritDarkTheme } from './theme/grit-dark';
import { editorOptions, readOnlyOptions } from './config';

const noop = () => { };

export const SSRStyle = {
  height: '100%',
  lineHeight: '18px',
  fontSize: '12px',
  borderRadius: 0,
  flex: 1,
  margin: 0,
};

export interface MonacoProps extends EditorProps {
  minLines?: number;
  maxLines?: number;
  noCliff?: boolean;
  onCursorPositionChange?: (data: editor.ICursorPositionChangedEvent) => void;
  placeholderColor?: string;
}

export const MonacoEditor = ({
  value,
  language = 'plaintext',
  options,
  noCliff,
  maxLines,
  minLines = 1,
  onCursorPositionChange = noop,
  onChange = noop,
  placeholderColor,
  ...rest
}: MonacoProps) => {
  const readOnly = options?.readOnly ?? true;
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isClient, setIsClient] = useState(false);
  const monaco = useMonaco();

  const mergedOptions = merge(editorOptions, readOnly && { ...readOnlyOptions }, options)
  const verticalPadding = mergedOptions.padding.top + mergedOptions.padding.bottom;
  const height = useMemo(() => {
    return getHeight(value ?? '', maxLines, minLines) + verticalPadding;
  }, [value, maxLines, minLines, verticalPadding]);

  const handleEditorDidMount: OnMount = async (editor, _monaco) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition(onCursorPositionChange);
    editor.onDidBlurEditorWidget((data: any) => {
      onCursorPositionChange(data);
    });

    if (value) {
      editor.setValue(value);
    }
  };

  // Initialize Monaco theme
  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('grit', gritDarkTheme);
      monaco.editor.setTheme('grit');
    }
  }, [monaco]);

  // NOTE: return plain text side by side if SSR, Monaco doesn't handle this internally.
  useEffect(() => setIsClient(true), []);

  return isClient ? (
    <Editor
      theme='grit'
      loading={<Loading value={value ?? 'Loading...'} />}
      height={noCliff ? '100%' : `${height}px`}
      options={mergedOptions}
      onChange={(value, editor) => {
        const hasFocus = editorRef.current?.hasTextFocus();
        if (hasFocus) onChange(value, editor);
      }}
      onMount={handleEditorDidMount}
      language={language}
      {...rest}
    />
  ) : (
    <Loading value={value ?? 'Loading...'} />
  );
};

const Loading = ({ value }: { value: string }) => <pre style={SSRStyle}>{value}</pre>;

const getHeight = (value: string, maxLines?: number, minLines = 1) => {
  const lines = value.split('\n').length;
  const height = Math.max(minLines, Math.min(maxLines ?? lines, lines)) * 18;
  return height;
};
