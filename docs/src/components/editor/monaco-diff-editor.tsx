import { useEffect, useMemo, useRef, useState } from 'react';

import { DiffEditor, DiffEditorProps } from '@monaco-editor/react';
import merge from 'lodash/merge';

import { Match, Position, Range } from '@/universal/matching/types';

import { diffEditorOptions, readOnlyOptions } from './config';

const noop = () => { };

export const SSRStyle = {
  height: '100%',
  lineHeight: '18px',
  fontSize: '12px',
  borderRadius: 0,
  flex: 1,
  margin: 0,
};

export interface MonacoDiffProps extends DiffEditorProps {
  maxLines?: number;
  minLines?: number;
  noCliff?: boolean;
  highlightedVariable?: string | null;
  highlights?: Range[];
  match?: Match;
  onCursorPositionChange?: (position?: Position) => void;
  onChange?: (original: string, modified: string) => void;
  placeholderColor?: string;
  focusIfEmpty?: boolean;
}

export const MonacoDiffEditor = ({
  original,
  modified,
  language = 'plaintext',
  options,
  noCliff,
  maxLines,
  minLines = 1,
  onCursorPositionChange = noop,
  onChange = noop,
  highlights,
  ...rest
}: MonacoDiffProps) => {
  const readOnly = options?.readOnly ?? true;
  const editorRef = useRef<any>(null);
  const [didMount, setDidMount] = useState(false);
  const decorationsRef = useRef<any[]>([]);

  const height = useMemo(() => {
    const lines = Math.max(
      (original ?? '').split('\n').length,
      (modified ?? '').split('\n').length,
    );
    return Math.max(minLines, Math.min(maxLines ?? lines, lines)) * 18;
  }, [original, modified, maxLines, minLines]);

  const handleEditorDidMount = async (editor: any) => {
    editorRef.current = editor;
    setDidMount(true);
    editor.getModifiedEditor().onDidChangeCursorPosition(onCursorPositionChange);
    editor.getOriginalEditor().onDidChangeCursorPosition(onCursorPositionChange);
  };

  useEffect(() => {
    if (!didMount || !editorRef.current || !highlights || highlights.length === 0) {
      // Clear existing decorations if no highlights
      if (didMount && editorRef.current && decorationsRef.current.length > 0) {
        const originalEditor = editorRef.current.getOriginalEditor();
        decorationsRef.current = originalEditor.deltaDecorations(decorationsRef.current, []);
      }
      return;
    }

    const originalEditor = editorRef.current.getOriginalEditor();

    // Convert highlights to Monaco decorations
    const decorations = highlights.map((range: Range) => ({
      range: {
        startLineNumber: range.start.line,
        startColumn: range.start.column,
        endLineNumber: range.end.line,
        endColumn: range.end.column,
      },
      options: {
        className: 'highlight-decoration',
        inlineClassName: 'match-highlight',
        isWholeLine: false,
      },
    }));

    // Apply decorations to the original editor (left side)
    decorationsRef.current = originalEditor.deltaDecorations(decorationsRef.current, decorations);
  }, [didMount, highlights]);

  useEffect(() => {
    if (!didMount || !editorRef.current) return;
    editorRef.current.getModifiedEditor().setValue(modified ?? '');
    editorRef.current.getOriginalEditor().setValue(original ?? '');
  }, [original, modified, didMount]);


  return (
    <DiffEditor
      theme='grit'
      loading={<Loading original={original ?? ''} modified={modified ?? ''} />}
      height={noCliff ? '100%' : `${height}px`}
      options={merge(diffEditorOptions, readOnly && { ...readOnlyOptions }, options)}
      onMount={handleEditorDidMount}
      language={language}
      {...rest}
    />
  )
};

const Loading = ({ original, modified }: { original: string; modified: string }) => (
  <div style={{ display: 'flex', gap: '1rem' }}>
    <pre style={SSRStyle}>{original}</pre>
    <pre style={SSRStyle}>{modified}</pre>
  </div>
);
