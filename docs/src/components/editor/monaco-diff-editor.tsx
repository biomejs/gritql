import { useEffect, useMemo, useRef, useState } from 'react';

import { DiffEditor, DiffEditorProps, useMonaco } from '@monaco-editor/react';
import merge from 'lodash/merge';

import { Match, Position } from '@/universal/matching/types';

import { diffEditorOptions, readOnlyOptions } from './config';
import { MatchIndex } from './highlights';

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
  oldHighlights?: MatchIndex[];
  newHighlights?: MatchIndex[];
  oldVariables?: any[];
  newVariables?: any[];
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
  ...rest
}: MonacoDiffProps) => {
  const readOnly = options?.readOnly ?? true;
  const editorRef = useRef<any>(null);
  const [didMount, setDidMount] = useState(false);

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
    />
  )
};

const Loading = ({ original, modified }: { original: string; modified: string }) => (
  <div style={{ display: 'flex', gap: '1rem' }}>
    <pre style={SSRStyle}>{original}</pre>
    <pre style={SSRStyle}>{modified}</pre>
  </div>
);
