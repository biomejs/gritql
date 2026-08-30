'use client';

import { usePathname } from 'next/navigation';

import { StandaloneEditorProvider } from '@/components/editor/context';
import { doesPathHaveEditor } from '@/libs/dynamic';

import { WorkerAnalysisProvider } from '../workers/provider';

export const WorkerWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname() ?? '';
  const withWorker = doesPathHaveEditor(pathname);

  if (!withWorker) {
    return <>{children}</>;
  }

  return (
    <WorkerAnalysisProvider>
      <StandaloneEditorProvider>{children}</StandaloneEditorProvider>
    </WorkerAnalysisProvider>
  );
};
