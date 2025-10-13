'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

import { useMonacoEditorInit } from '@/components/editor/monaco-editor-init';
import { Template } from '@/templates/plain';

import '@/styles/main.css';

export default function FullWidthLayout({ children }: { children: React.ReactNode }) {
  useMonacoEditorInit({ theme: 'dark' });
  const pathname = usePathname() ?? '';

  return (
    <Template path={pathname} layout='full'>
      <Head>
        <link rel='icon' href='/favicon.svg' />
      </Head>
      {children}
    </Template>
  );
}

