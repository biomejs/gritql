import type { Metadata } from 'next';

import { WorkerWrapper } from '@/templates/worker-wrapper';
import { StandaloneEditor } from '@/components/editor/standalone-editor';

export const metadata: Metadata = {
  title: 'Playground',
};

export default async function Playground() {
  return (
    <WorkerWrapper>
      <div className='w-full max-w-full min-h-screen px-6 py-8'>
        <div className='max-w-[1800px] mx-auto'>
          <div className='h-[85vh]'>
            <StandaloneEditor />
          </div>
        </div>
      </div>
    </WorkerWrapper>
  );
}

