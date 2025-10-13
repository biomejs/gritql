'use client';

import { usePathname } from 'next/navigation';
import { WorkerAnalysisProvider } from 'src/workers/provider';

import { doesPathHaveEditor } from '@/libs/dynamic';
import { StandaloneEditorProvider } from '@/components/editor/context';

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
