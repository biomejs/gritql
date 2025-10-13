'use client';

import { useMemo } from 'react';

import cx from 'classnames';
import { editor } from 'monaco-editor';

import { CloseButton } from '@/components/code-block/buttons';
import { SnippetHeading } from '@/components/code-block/heading';
import { useDelayedLoader } from '@/hooks/use-delayed-loader';
import { useDiffEditor } from '@/hooks/use-diff-editor';
import { extractLanguageFromPatternBody, getEditorLangIdFromLanguage } from '@/universal/patterns/utils';

import { useStandaloneEditor } from './context';
import { MonacoDiffEditor } from './monaco-diff-editor';
import { MonacoEditor } from './monaco-editor';

const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  scrollbar: {
    alwaysConsumeMouseWheel: false,
    handleMouseWheel: true,
    vertical: 'auto',
    horizontal: 'auto',
  },
  scrollBeyondLastLine: false,
};

export const StandaloneEditor: React.FC<{
  patternTitle?: string;
  resultTitle?: string;
}> = ({ }) => {
  const { pattern, setPattern, input, setInput } = useStandaloneEditor();

  const language = useMemo(() => extractLanguageFromPatternBody(pattern), [pattern]);
  const { output, onPatternChange, state, match } =
    useDiffEditor({
      pattern,
      setPattern,
      input,
      setInput,
    });

  const errorMessage = useMemo(() => ('log' in state ? state.log?.message : undefined), [state]);

  const showDirty = useDelayedLoader(state.state === 'loading');

  const highlights = useMemo(() => {
    if (!match) return [];
    return match.ranges;
  }, [match]);


  return (
    <div className='flex relative flex-col gap-4 h-full w-full p-2 overflow-hidden rounded-lg bg-neutral-800 transition ease-in-out'>
      <div className='h-1/2 rounded-md overflow-hidden monaco-pattern-editor relative'>
        <div className='flex m-0 justify-between px-3 py-2 bg-black'>
          <SnippetHeading title='Pattern Editor' />
          <CloseButton />
        </div>
        <MonacoEditor
          noCliff
          path='docs/grit.grit'
          value={pattern}
          language={'grit'}
          onChange={onPatternChange}
          options={{
            readOnly: false,
            scrollbar: {
              alwaysConsumeMouseWheel: true,
              handleMouseWheel: true,
              vertical: 'auto',
            },
            lineNumbers: 'on',
            glyphMargin: true,
            scrollBeyondLastLine: true,
            ...EDITOR_OPTIONS,
          }}
          placeholderColor='#9ca3af'
        />
      </div>
      <div className='h-1/2 rounded-md overflow-hidden'>
        <div className='flex m-0 justify-between px-3 py-2 bg-black'>
          <SnippetHeading title='diff' />
        </div>
        <div
          className={cx(
            'monaco-diff-editor h-full',
            { 'is-dirty': showDirty, 'is-match': !!match },
            state.state,
          )}
        >
          <MonacoDiffEditor
            noCliff
            originalModelPath='docs/org-example.js'
            modifiedModelPath='docs/mod-example.js'
            original={input}
            language={language ? getEditorLangIdFromLanguage(language) : 'js'}
            modified={output}
            options={{
              renderIndicators: true,
              renderSideBySide: true,
              lineNumbers: 'on',
              originalEditable: true,
              ...EDITOR_OPTIONS,
            }}
            placeholderColor='#9ca3af'
            highlights={highlights}
          />
        </div>
      </div>
      {errorMessage && (
        <div
          className='animate-slideUp absolute bottom-0 w-full -mx-2 rounded-b-md z-10 bg-tart-600'
          role='alert'
          data-testid='grit-error'
        >
          <p className='overflow-ellipsis overflow-hidden line-clamp-4 my-0 py-1 px-4 text-sm text-white font-mono'>
            <b>Error:</b> {errorMessage}
          </p>
        </div>
      )}
    </div>
  );
};
