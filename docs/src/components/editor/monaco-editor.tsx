"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import merge from 'lodash/merge';
import Editor, { OnMount, EditorProps, useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { gritDarkTheme } from './theme/grit-dark';
import { editorOptions, readOnlyOptions } from './config';

const noop = () => { };

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
  const monaco = useMonaco();

  const mergedOptions = merge(editorOptions, readOnly && { ...readOnlyOptions }, options)

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


  return <Editor
    theme='grit'
    loading={'Loading...'}
    height={'100%'}
    options={mergedOptions}
    onChange={(value, editor) => {
      const hasFocus = editorRef.current?.hasTextFocus();
      if (hasFocus) onChange(value, editor);
    }}
    onMount={handleEditorDidMount}
    language={language}
    {...rest}
  />
};
