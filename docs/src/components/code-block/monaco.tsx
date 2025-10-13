'use client';

/* eslint-disable complexity */

import { FaPencilRuler, FaPlay } from 'react-icons/fa';

import { WithChildren } from '@/custom-types/shared';
import { MonacoEditor } from '@/components/editor/monaco-editor';

import { CopyButton, TryButton } from './buttons';
import { extractCodeString } from './extract';
import { SnippetHeading } from './heading';

export type MarkdocCodeFenceProps = WithChildren<{
  language: string;
  readOnly: boolean;
  fileName?: string;
  diff?: boolean;
  match?: boolean;
  snippet?: boolean;
  short?: boolean;
  firstInPair?: boolean;
  secondInPair?: boolean;
  title?: string;
}>;

export type FenceProps = {
  props: {
    children: string | FenceProps[];
  };
};

export function CodeBlock(props: MarkdocCodeFenceProps) {
  const {
    children,
    language,
    fileName,
    diff,
    match,
    snippet,
    firstInPair = false,
    secondInPair = false,
  } = props;
  let editorLang = language;

  if (diff || match) {
    return (
      <>
        Placeholder content, you expected a diff or match block here.
        <pre>{children}</pre>
      </>
    );
  }

  let code = '';
  let sample = '';

  if (snippet) {
    const [snippet, pattern] = children as FenceProps[];
    code = extractCodeString(pattern ? [pattern] : '');
    sample = extractCodeString(snippet ? [snippet] : '');
    editorLang = 'grit';
  } else if (typeof children === 'string') {
    code = (children as string).trim();
    sample = code;
  }

  if (props.short) {
    return (
      <div className='relative'>
        <pre className='my-0 codeblock'>{code}</pre>
      </div>
    );
  }


  const title = props.title ?? (firstInPair ? 'Before' : secondInPair ? 'After' : language);

  return (
    <div className='bg-codeblock rounded-md overflow-hidden my-4'>
      <div className='flex justify-between px-3 py-2 bg-black'>
        <SnippetHeading fileName={fileName} title={title} />
        <div className='flex gap-2 w-72 justify-end'>
          <CopyButton data={code} />

        </div>
      </div>
      <pre className='my-0'>{code.trim()}</pre>
    </div>
  );
}
